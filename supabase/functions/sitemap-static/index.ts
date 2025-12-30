import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const today = new Date().toISOString().split("T")[0];

    // Static pages with their priorities and change frequencies
    const staticPages = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/about", priority: "0.8", changefreq: "monthly" },
      { path: "/programs", priority: "0.9", changefreq: "monthly" },
      { path: "/blog", priority: "0.9", changefreq: "daily" },
      { path: "/faq", priority: "0.7", changefreq: "weekly" },
      { path: "/qa", priority: "0.7", changefreq: "weekly" },
      { path: "/topics", priority: "0.7", changefreq: "weekly" },
      { path: "/contact", priority: "0.6", changefreq: "monthly" },
      { path: "/apply", priority: "0.8", changefreq: "monthly" },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    for (const page of staticPages) {
      sitemap += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.path}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.path}" />
  </url>
`;
    }

    sitemap += `</urlset>`;

    console.log(`Generated static sitemap with ${staticPages.length} pages`);

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Static sitemap generation error:", error);
    return new Response("Error generating static sitemap", {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 500,
    });
  }
});
