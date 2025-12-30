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
    const url = new URL(req.url);
    const baseUrl = url.searchParams.get("base_url") || "https://drromulusmba.com";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    
    // Get last modification dates from database
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get latest update times for each content type
    const [blogResult, faqResult, qaResult, topicResult] = await Promise.all([
      supabase.from("blog_posts").select("updated_at").eq("published", true).order("updated_at", { ascending: false }).limit(1),
      supabase.from("faqs").select("updated_at").eq("status", "published").order("updated_at", { ascending: false }).limit(1),
      supabase.from("qa_pages").select("updated_at").eq("status", "published").order("updated_at", { ascending: false }).limit(1),
      supabase.from("topics").select("updated_at").eq("is_active", true).order("updated_at", { ascending: false }).limit(1),
    ]);

    const getLastMod = (result: any) => {
      if (result.data && result.data[0]?.updated_at) {
        return new Date(result.data[0].updated_at).toISOString().split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    };

    const blogLastMod = getLastMod(blogResult);
    const faqLastMod = getLastMod(faqResult);
    const qaLastMod = getLastMod(qaResult);
    const topicLastMod = getLastMod(topicResult);
    const today = new Date().toISOString().split('T')[0];

    // Build sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${blogLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-faq.xml</loc>
    <lastmod>${faqLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-qa.xml</loc>
    <lastmod>${qaLastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-topics.xml</loc>
    <lastmod>${topicLastMod}</lastmod>
  </sitemap>
</sitemapindex>`;

    console.log("Generated sitemap index with 5 child sitemaps");

    return new Response(sitemapIndex, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Sitemap index generation error:", error);
    return new Response("Error generating sitemap index", {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 500,
    });
  }
});
