import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Topic name keywords → authority source categories mapping
const TOPIC_CATEGORY_MAP: Record<string, string[]> = {
  automation: ["AI_Automation", "Tech_Security"],
  ai: ["AI_Automation", "Tech_Security"],
  operational: ["AI_Automation", "Tech_Security"],
  education: ["Business_Leadership", "Data_Research"],
  leadership: ["Business_Leadership", "Data_Research"],
  growth: ["Business_Leadership", "Data_Research"],
  financial: ["Business_Leadership", "Data_Research", "Explainers"],
  "self-efficacy": ["Business_Leadership", "Data_Research", "Explainers"],
  "decision-making": ["Business_Leadership", "Data_Research", "Explainers"],
  structure: ["Business_Leadership", "Data_Research"],
  credibility: ["Business_Leadership", "Data_Research"],
  foundations: ["Business_Leadership", "Data_Research"],
  client: ["Business_Leadership", "AI_Automation"],
  acquisition: ["Business_Leadership", "AI_Automation"],
  offer: ["Business_Leadership", "AI_Automation"],
};

function getCategoriesForTopic(topicName: string): string[] {
  const lower = topicName.toLowerCase();
  const matched = new Set<string>();

  for (const [keyword, categories] of Object.entries(TOPIC_CATEGORY_MAP)) {
    if (lower.includes(keyword)) {
      categories.forEach((c) => matched.add(c));
    }
  }

  // Fallback: if no match, use Business_Leadership + Data_Research
  if (matched.size === 0) {
    matched.add("Business_Leadership");
    matched.add("Data_Research");
  }

  return Array.from(matched);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Fetch all active authority sources
    const { data: sources, error: srcErr } = await supabase
      .from("authority_sources")
      .select("*")
      .eq("is_active", true)
      .order("trust_level")
      .order("name");

    if (srcErr) throw srcErr;

    // 2. Seed citations table from authority sources (idempotent by URL)
    let citationsSeeded = 0;
    const sourceToCitationId: Record<string, string> = {};

    for (const src of sources || []) {
      const citationUrl = `https://${src.domain}`;

      // Check if citation already exists
      const { data: existing } = await supabase
        .from("citations")
        .select("id")
        .eq("url", citationUrl)
        .maybeSingle();

      if (existing) {
        sourceToCitationId[src.id] = existing.id;
        continue;
      }

      const { data: created, error: createErr } = await supabase
        .from("citations")
        .insert({
          url: citationUrl,
          title: src.name,
          source_name: src.name,
          is_active: true,
        })
        .select("id")
        .single();

      if (createErr) {
        console.error(`Failed to seed citation for ${src.name}:`, createErr);
        continue;
      }

      sourceToCitationId[src.id] = created.id;
      citationsSeeded++;
    }

    // Build category → citation IDs lookup (Primary first, then Secondary)
    const categoryToCitationIds: Record<string, string[]> = {};
    for (const src of sources || []) {
      const citId = sourceToCitationId[src.id];
      if (!citId) continue;
      if (!categoryToCitationIds[src.category]) {
        categoryToCitationIds[src.category] = [];
      }
      categoryToCitationIds[src.category].push(citId);
    }

    // 3. Fetch published blog posts with topics
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("id, title, topic_id, topics(name)")
      .eq("published", true);

    // 4. Fetch published Q&A pages with topics
    const { data: qaPages } = await supabase
      .from("qa_pages")
      .select("id, question, topic_id, topics(name)")
      .eq("status", "published");

    let blogAttachments = 0;
    let qaAttachments = 0;

    // 5. Attach citations to blog posts
    for (const post of blogPosts || []) {
      const topicName =
        (post.topics as any)?.name || "Business Leadership";
      const categories = getCategoriesForTopic(topicName);

      // Collect candidate citation IDs from matching categories
      const candidates: string[] = [];
      for (const cat of categories) {
        const ids = categoryToCitationIds[cat] || [];
        for (const id of ids) {
          if (!candidates.includes(id)) candidates.push(id);
        }
      }

      // Take 3-4 citations
      const toAttach = candidates.slice(0, Math.min(4, Math.max(3, candidates.length)));

      for (let i = 0; i < toAttach.length; i++) {
        const { error } = await supabase
          .from("blog_post_citations")
          .upsert(
            {
              blog_post_id: post.id,
              citation_id: toAttach[i],
              sort_order: i,
            },
            { onConflict: "blog_post_id,citation_id", ignoreDuplicates: true }
          );

        if (!error) blogAttachments++;
      }
    }

    // 6. Attach citations to Q&A pages
    for (const qa of qaPages || []) {
      const topicName =
        (qa.topics as any)?.name || "Business Leadership";
      const categories = getCategoriesForTopic(topicName);

      const candidates: string[] = [];
      for (const cat of categories) {
        const ids = categoryToCitationIds[cat] || [];
        for (const id of ids) {
          if (!candidates.includes(id)) candidates.push(id);
        }
      }

      const toAttach = candidates.slice(0, Math.min(4, Math.max(3, candidates.length)));

      for (let i = 0; i < toAttach.length; i++) {
        const { error } = await supabase
          .from("qa_page_citations")
          .upsert(
            {
              qa_page_id: qa.id,
              citation_id: toAttach[i],
              sort_order: i,
            },
            { onConflict: "qa_page_id,citation_id", ignoreDuplicates: true }
          );

        if (!error) qaAttachments++;
      }
    }

    const summary = {
      citations_seeded: citationsSeeded,
      total_citations: Object.keys(sourceToCitationId).length,
      blog_posts_processed: blogPosts?.length || 0,
      qa_pages_processed: qaPages?.length || 0,
      blog_attachments: blogAttachments,
      qa_attachments: qaAttachments,
      total_attachments: blogAttachments + qaAttachments,
    };

    console.log("Bulk attach complete:", summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Bulk attach error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
