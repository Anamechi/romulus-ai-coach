import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get base URL from request or environment
    const url = new URL(req.url);
    const baseUrl = url.searchParams.get("base_url") || "https://drromulusmba.com";

    // Fetch published blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    // Fetch published FAQs
    const { data: faqs } = await supabase
      .from("faqs")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    // Static pages with their priorities and change frequencies
    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/about", priority: "0.8", changefreq: "monthly" },
      { path: "/programs", priority: "0.9", changefreq: "monthly" },
      { path: "/blog", priority: "0.9", changefreq: "daily" },
      { path: "/faq", priority: "0.7", changefreq: "weekly" },
      { path: "/contact", priority: "0.6", changefreq: "monthly" },
      { path: "/apply", priority: "0.8", changefreq: "monthly" },
    ];

    const today = new Date().toISOString().split("T")[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      sitemap += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add blog posts
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
  </url>
`;
      }
    }

    // Add FAQ pages
    if (faqs) {
      for (const faq of faqs) {
        const lastmod = faq.updated_at
          ? new Date(faq.updated_at).toISOString().split("T")[0]
          : today;
        sitemap += `  <url>
    <loc>${baseUrl}/faq/${faq.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
    }

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Sitemap generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
