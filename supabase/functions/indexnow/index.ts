import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// IndexNow API endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls, action = "submit" } = await req.json();
    
    // Generate or use a stored key (in production, store this and serve at /key.txt)
    const indexNowKey = Deno.env.get("INDEXNOW_KEY") || "drromulusmba-indexnow-key-2025";
    const host = "drromulusmba.com";
    const keyLocation = `https://${host}/${indexNowKey}.txt`;

    console.log(`IndexNow request - Action: ${action}, URLs count: ${urls?.length || 0}`);

    if (action === "get-key") {
      // Return the key for verification file
      return new Response(JSON.stringify({ 
        key: indexNowKey,
        keyLocation,
        instructions: `Create a file at ${keyLocation} containing only: ${indexNowKey}`
      }), {
        headers: corsHeaders,
        status: 200,
      });
    }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No URLs provided. Send an array of URLs to submit." 
      }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    // Validate and normalize URLs
    const normalizedUrls = urls.map((url: string) => {
      if (url.startsWith("/")) {
        return `https://${host}${url}`;
      }
      return url;
    }).filter((url: string) => url.startsWith(`https://${host}`));

    if (normalizedUrls.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: `All URLs must be on the ${host} domain` 
      }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    // Submit to IndexNow endpoints
    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        const payload = normalizedUrls.length === 1
          ? {
              host,
              key: indexNowKey,
              keyLocation,
              url: normalizedUrls[0],
            }
          : {
              host,
              key: indexNowKey,
              keyLocation,
              urlList: normalizedUrls,
            };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        return {
          endpoint,
          status: response.status,
          ok: response.ok || response.status === 202,
          statusText: response.statusText,
        };
      })
    );

    const successCount = results.filter(
      (r) => r.status === "fulfilled" && (r.value.ok)
    ).length;

    const resultsSummary = results.map((r) => {
      if (r.status === "fulfilled") {
        return { ...r.value, success: r.value.ok };
      }
      return { endpoint: "unknown", success: false, error: r.reason };
    });

    console.log(`IndexNow submission complete. Success: ${successCount}/${INDEXNOW_ENDPOINTS.length}`);

    return new Response(JSON.stringify({
      success: successCount > 0,
      message: `Submitted ${normalizedUrls.length} URL(s) to ${successCount}/${INDEXNOW_ENDPOINTS.length} search engines`,
      urlsSubmitted: normalizedUrls,
      results: resultsSummary,
      keyInfo: {
        key: indexNowKey,
        keyLocation,
        note: "Ensure the key file is accessible at the keyLocation URL"
      }
    }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
