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

    // Fetch published blog posts with images
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("slug, title, updated_at, published_at, cover_image_url, meta_description")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    const today = new Date().toISOString().split("T")[0];

    if (blogPosts) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at
          ? new Date(post.updated_at).toISOString().split("T")[0]
          : today;
        
        sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blog/${post.slug}" />`;
        
        // Add image if available
        if (post.cover_image_url) {
          sitemap += `
    <image:image>
      <image:loc>${post.cover_image_url}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      ${post.meta_description ? `<image:caption>${escapeXml(post.meta_description)}</image:caption>` : ''}
    </image:image>`;
        }
        
        sitemap += `
  </url>
`;
      }
    }

    sitemap += `</urlset>`;

    console.log(`Generated blog sitemap with ${blogPosts?.length || 0} posts`);

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Blog sitemap generation error:", error);
    return new Response("Error generating blog sitemap", {
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
