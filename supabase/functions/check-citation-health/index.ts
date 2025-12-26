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
    const { citation_ids } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get citations to check
    let query = supabase
      .from("citations")
      .select("id, url")
      .eq("is_active", true);

    if (citation_ids && citation_ids.length > 0) {
      query = query.in("id", citation_ids);
    }

    const { data: citations, error: fetchError } = await query.limit(50);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Checking health for ${citations?.length || 0} citations`);

    const results: any[] = [];

    for (const citation of citations || []) {
      const startTime = Date.now();
      let status = "healthy";
      let httpStatus: number | null = null;
      let responseTime: number | null = null;
      let errorMessage: string | null = null;
      let redirectUrl: string | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(citation.url, {
          method: "HEAD",
          signal: controller.signal,
          redirect: "follow",
        });

        clearTimeout(timeoutId);

        responseTime = Date.now() - startTime;
        httpStatus = response.status;

        if (response.url !== citation.url) {
          redirectUrl = response.url;
        }

        if (httpStatus >= 200 && httpStatus < 300) {
          status = "healthy";
        } else if (httpStatus >= 300 && httpStatus < 400) {
          status = "warning";
        } else if (httpStatus >= 400) {
          status = "dead";
          errorMessage = `HTTP ${httpStatus}`;
        }

        // Check for slow responses
        if (responseTime > 5000) {
          status = "warning";
          errorMessage = "Slow response time";
        }

      } catch (error) {
        status = "dead";
        errorMessage = error instanceof Error ? error.message : "Connection failed";
        responseTime = Date.now() - startTime;
      }

      // Upsert health check result
      const { error: upsertError } = await supabase
        .from("citation_health_checks")
        .upsert({
          citation_id: citation.id,
          status,
          http_status: httpStatus,
          response_time_ms: responseTime,
          last_checked_at: new Date().toISOString(),
          error_message: errorMessage,
          redirect_url: redirectUrl,
        }, { onConflict: "citation_id" });

      if (upsertError) {
        console.error(`Error upserting health check for ${citation.id}:`, upsertError);
      }

      results.push({
        citation_id: citation.id,
        url: citation.url,
        status,
        http_status: httpStatus,
        response_time_ms: responseTime,
      });
    }

    const summary = {
      checked: results.length,
      healthy: results.filter(r => r.status === "healthy").length,
      warning: results.filter(r => r.status === "warning").length,
      dead: results.filter(r => r.status === "dead").length,
    };

    console.log("Health check summary:", summary);

    return new Response(JSON.stringify({ ...summary, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Health check error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
