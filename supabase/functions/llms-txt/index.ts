import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "text/plain; charset=utf-8",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const baseUrl = url.searchParams.get("base_url") || "https://drromulusmba.com";

    // Fetch site settings
    const { data: settings } = await supabase
      .from("content_settings")
      .select("site_name, tagline, master_content_prompt")
      .limit(1)
      .single();

    // Fetch active topics with category
    const { data: topics } = await supabase
      .from("topics")
      .select("name, slug, description, funnel_stage")
      .eq("is_active", true)
      .order("sort_order");

    // Fetch published blog posts count by topic
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("topic_id, title, slug")
      .eq("published", true)
      .limit(50);

    // Fetch published FAQs
    const { data: faqs } = await supabase
      .from("faqs")
      .select("question, slug, topic_id")
      .eq("status", "published")
      .limit(50);

    // Fetch published Q&A pages
    const { data: qaPages } = await supabase
      .from("qa_pages")
      .select("question, slug, topic_id")
      .eq("status", "published")
      .limit(50);

    // Fetch active authors for expertise context
    const { data: authors } = await supabase
      .from("authors")
      .select("full_name, credentials, bio")
      .eq("is_active", true);

    const siteName = settings?.site_name || "Dr. Romulus MBA";
    const tagline = settings?.tagline || "Executive Business Coaching";

    let llmsTxt = `# ${siteName}
# ${tagline}

## About
${settings?.master_content_prompt || "A professional business coaching and consulting practice helping entrepreneurs and executives achieve their goals."}

## Main Navigation
- Home: ${baseUrl}/
- About: ${baseUrl}/about
- Programs: ${baseUrl}/programs
- Blog: ${baseUrl}/blog
- FAQ: ${baseUrl}/faq
- Q&A: ${baseUrl}/qa
- Topics: ${baseUrl}/topics
- Contact: ${baseUrl}/contact
- Apply: ${baseUrl}/apply

## Content Authors & Experts
`;

    if (authors?.length) {
      authors.forEach((author) => {
        llmsTxt += `- ${author.full_name}${author.credentials ? ` (${author.credentials})` : ""}\n`;
        if (author.bio) {
          llmsTxt += `  ${author.bio.slice(0, 200)}${author.bio.length > 200 ? '...' : ''}\n`;
        }
      });
    }

    llmsTxt += `\n## Topics\n`;
    if (topics?.length) {
      topics.forEach((topic) => {
        llmsTxt += `\n### ${topic.name}\n`;
        llmsTxt += `URL: ${baseUrl}/topics/${topic.slug}\n`;
        if (topic.funnel_stage) {
          llmsTxt += `Funnel Stage: ${topic.funnel_stage}\n`;
        }
        if (topic.description) {
          llmsTxt += `Description: ${topic.description}\n`;
        }
        
        // List related blog posts
        const relatedPosts = blogPosts?.filter(p => p.topic_id === (topic as any).id);
        if (relatedPosts?.length) {
          llmsTxt += `Related Articles:\n`;
          relatedPosts.slice(0, 5).forEach(post => {
            llmsTxt += `  - ${post.title}: ${baseUrl}/blog/${post.slug}\n`;
          });
        }
      });
    }

    llmsTxt += `\n## Frequently Asked Questions\n`;
    if (faqs?.length) {
      faqs.slice(0, 20).forEach((faq) => {
        llmsTxt += `- Q: ${faq.question}\n`;
        llmsTxt += `  URL: ${baseUrl}/faq/${faq.slug}\n`;
      });
    }

    llmsTxt += `\n## Q&A Pages\n`;
    if (qaPages?.length) {
      qaPages.slice(0, 20).forEach((qa) => {
        llmsTxt += `- ${qa.question}\n`;
        llmsTxt += `  URL: ${baseUrl}/qa/${qa.slug}\n`;
      });
    }

    llmsTxt += `\n## Additional Resources
- Sitemap: ${baseUrl}/sitemap.xml
- AI Sitemap: ${baseUrl}/sitemap-ai.xml
- AI Policy: ${baseUrl}/ai.txt

## Contact
For inquiries, visit ${baseUrl}/contact or ${baseUrl}/apply to schedule a consultation.

## Last Updated
${new Date().toISOString().split('T')[0]}
`;

    return new Response(llmsTxt, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("llms.txt generation error:", error);
    return new Response("Error generating llms.txt", {
      headers: corsHeaders,
      status: 500,
    });
  }
});
