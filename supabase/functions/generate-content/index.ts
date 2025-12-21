import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, topicId, count = 3 } = await req.json();

    // Fetch master content prompt
    const { data: settings, error: settingsError } = await supabase
      .from("content_settings")
      .select("master_content_prompt, site_name")
      .single();

    if (settingsError) {
      console.error("Settings error:", settingsError);
      throw new Error("Failed to fetch content settings");
    }

    // Fetch topic details
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select("name, description, funnel_stage, category:categories(name)")
      .eq("id", topicId)
      .single();

    if (topicError) {
      console.error("Topic error:", topicError);
      throw new Error("Failed to fetch topic");
    }

    const masterPrompt = settings?.master_content_prompt || "";
    const siteName = settings?.site_name || "Dr. Romulus MBA";

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "faq") {
      systemPrompt = `You are an expert content strategist for ${siteName}. 
${masterPrompt}

Generate FAQ content that demonstrates E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
Each FAQ should be actionable, educational, and aligned with the coaching/consulting brand voice.
Answers should be comprehensive (150-300 words) and include practical advice.`;

      userPrompt = `Generate ${count} FAQs for the topic: "${topic.name}"
Topic Description: ${topic.description || "N/A"}
Funnel Stage: ${topic.funnel_stage || "TOFU"}
Category: ${(topic.category as any)?.name || "General"}

Return a JSON array with objects containing:
- question: The FAQ question (clear, searchable)
- answer: Comprehensive answer (150-300 words)
- speakable_answer: A concise 2-3 sentence version for voice assistants

Format: [{"question": "...", "answer": "...", "speakable_answer": "..."}]`;

    } else if (type === "blog") {
      systemPrompt = `You are an expert content strategist for ${siteName}.
${masterPrompt}

Generate blog post outlines that demonstrate E-E-A-T and are SEO-optimized.
Each post should be educational, actionable, and aligned with business coaching expertise.`;

      userPrompt = `Generate ${count} blog post ideas for the topic: "${topic.name}"
Topic Description: ${topic.description || "N/A"}
Funnel Stage: ${topic.funnel_stage || "TOFU"}
Category: ${(topic.category as any)?.name || "General"}

Return a JSON array with objects containing:
- title: SEO-optimized title (50-60 chars)
- excerpt: Meta description (150-160 chars)
- content: Full blog post content (800-1200 words, with headers marked as ## H2)
- meta_title: SEO title tag
- meta_description: SEO meta description
- speakable_summary: 2-3 sentence summary for voice assistants
- reading_time_minutes: Estimated reading time

Format: [{"title": "...", "excerpt": "...", "content": "...", "meta_title": "...", "meta_description": "...", "speakable_summary": "...", "reading_time_minutes": 5}]`;
    } else {
      throw new Error("Invalid content type. Use 'faq' or 'blog'");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI generation failed");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    console.log("Raw AI response length:", content.length);

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      // Try direct parse first
      if (cleanContent.startsWith("[")) {
        parsed = JSON.parse(cleanContent);
      } else {
        // Find the JSON array in the content
        const startIndex = cleanContent.indexOf("[");
        const endIndex = cleanContent.lastIndexOf("]");
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const jsonStr = cleanContent.slice(startIndex, endIndex + 1);
          parsed = JSON.parse(jsonStr);
        } else {
          throw new Error("No JSON array found in response");
        }
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Content preview:", content.substring(0, 500) + "...");
      console.error("Content end:", content.substring(content.length - 500));
      throw new Error("Failed to parse AI response. The content may have been truncated.");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      items: parsed,
      topic: topic.name,
      type 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Generate content error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
