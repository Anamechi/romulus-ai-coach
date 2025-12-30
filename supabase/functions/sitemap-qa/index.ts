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

    // Fetch published Q&A pages
    const { data: qaPages, error } = await supabase
      .from("qa_pages")
      .select("slug, question, updated_at, meta_description")
      .eq("status", "published")
      .order("sort_order")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching Q&A pages:", error);
      throw error;
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    const today = new Date().toISOString().split("T")[0];

    if (qaPages) {
      for (const qa of qaPages) {
        const lastmod = qa.updated_at
          ? new Date(qa.updated_at).toISOString().split("T")[0]
          : today;
        
        sitemap += `  <url>
    <loc>${baseUrl}/qa/${qa.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/qa/${qa.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/qa/${qa.slug}" />
  </url>
`;
      }
    }

    sitemap += `</urlset>`;

    console.log(`Generated Q&A sitemap with ${qaPages?.length || 0} pages`);

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Q&A sitemap generation error:", error);
    return new Response("Error generating Q&A sitemap", {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 500,
    });
  }
});
