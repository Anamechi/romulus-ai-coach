import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
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

    // Fetch all published content with speakable info
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, title, updated_at, speakable_summary, meta_description")
      .eq("published", true);

    const { data: faqs } = await supabase
      .from("faqs")
      .select("slug, question, updated_at, speakable_answer")
      .eq("status", "published");

    const { data: qaPages } = await supabase
      .from("qa_pages")
      .select("slug, question, updated_at, speakable_answer, meta_description")
      .eq("status", "published");

    const { data: topics } = await supabase
      .from("topics")
      .select("slug, name, description, updated_at")
      .eq("is_active", true);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:ai="http://www.example.org/ai-sitemap/1.0">
`;

    // Add blog posts with AI metadata
    blogPosts?.forEach((post) => {
      const hasSpeakable = !!post.speakable_summary;
      sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <ai:content-type>article</ai:content-type>
    <ai:title>${escapeXml(post.title)}</ai:title>
    <ai:speakable>${hasSpeakable ? 'true' : 'false'}</ai:speakable>
    ${post.meta_description ? `<ai:description>${escapeXml(post.meta_description)}</ai:description>` : ''}
  </url>
`;
    });

    // Add FAQs
    faqs?.forEach((faq) => {
      const hasSpeakable = !!faq.speakable_answer;
      sitemap += `  <url>
    <loc>${baseUrl}/faq/${faq.slug}</loc>
    <lastmod>${faq.updated_at ? new Date(faq.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <ai:content-type>faq</ai:content-type>
    <ai:title>${escapeXml(faq.question)}</ai:title>
    <ai:speakable>${hasSpeakable ? 'true' : 'false'}</ai:speakable>
  </url>
`;
    });

    // Add Q&A pages
    qaPages?.forEach((qa) => {
      const hasSpeakable = !!qa.speakable_answer;
      sitemap += `  <url>
    <loc>${baseUrl}/qa/${qa.slug}</loc>
    <lastmod>${qa.updated_at ? new Date(qa.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <ai:content-type>qa</ai:content-type>
    <ai:title>${escapeXml(qa.question)}</ai:title>
    <ai:speakable>${hasSpeakable ? 'true' : 'false'}</ai:speakable>
    ${qa.meta_description ? `<ai:description>${escapeXml(qa.meta_description)}</ai:description>` : ''}
  </url>
`;
    });

    // Add topics
    topics?.forEach((topic) => {
      sitemap += `  <url>
    <loc>${baseUrl}/topics/${topic.slug}</loc>
    <lastmod>${topic.updated_at ? new Date(topic.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <ai:content-type>topic</ai:content-type>
    <ai:title>${escapeXml(topic.name)}</ai:title>
    ${topic.description ? `<ai:description>${escapeXml(topic.description)}</ai:description>` : ''}
  </url>
`;
    });

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("AI sitemap generation error:", error);
    return new Response("Error generating AI sitemap", {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 500,
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
