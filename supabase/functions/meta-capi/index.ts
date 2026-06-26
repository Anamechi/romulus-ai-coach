// Meta Conversions API (server-side) relay.
// Receives event payload from the browser, hashes PII, and forwards to Meta.
// Pixel ID is public and hardcoded. Access token is read from a Supabase secret
// (META_CAPI_ACCESS_TOKEN) and never logged or returned.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PIXEL_ID = "2014599869476161";
const GRAPH_VERSION = "v18.0";

interface IncomingEvent {
  event_name: string;
  event_id: string;
  event_time?: number;
  event_source_url?: string;
  action_source?: string;
  user_data?: {
    em?: string; // raw email
    ph?: string; // raw phone
    fbp?: string;
    fbc?: string;
  };
  custom_data?: Record<string, unknown>;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(v: string): string {
  return v.trim().toLowerCase();
}

function normalizePhone(v: string): string {
  // Strip everything that isn't a digit. Meta expects E.164 digits only.
  return v.replace(/[^\d]/g, "");
}

function getClientIp(req: Request): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? undefined;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");
  if (!accessToken) {
    console.error("META_CAPI_ACCESS_TOKEN not configured");
    return new Response(
      JSON.stringify({ error: "Server not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: IncomingEvent;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.event_name || !body.event_id) {
    return new Response(
      JSON.stringify({ error: "event_name and event_id are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const userAgent = req.headers.get("user-agent") ?? undefined;
  const clientIp = getClientIp(req);

  const user_data: Record<string, unknown> = {};
  const incoming = body.user_data ?? {};
  if (incoming.em) user_data.em = [await sha256Hex(normalizeEmail(incoming.em))];
  if (incoming.ph) user_data.ph = [await sha256Hex(normalizePhone(incoming.ph))];
  if (incoming.fbp) user_data.fbp = incoming.fbp;
  if (incoming.fbc) user_data.fbc = incoming.fbc;
  if (clientIp) user_data.client_ip_address = clientIp;
  if (userAgent) user_data.client_user_agent = userAgent;

  const event = {
    event_name: body.event_name,
    event_time: body.event_time ?? Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    event_source_url: body.event_source_url,
    action_source: body.action_source ?? "website",
    user_data,
    custom_data: body.custom_data ?? {},
  };

  const payload: Record<string, unknown> = { data: [event] };
  const testCode = Deno.env.get("META_CAPI_TEST_CODE");
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      // Log Meta's error body for diagnostics, but never echo our token.
      console.error("Meta CAPI error", res.status, JSON.stringify(json));
      return new Response(
        JSON.stringify({ error: "Meta CAPI rejected event", meta: json }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({
        ok: true,
        event_id: body.event_id,
        events_received: json.events_received,
        fbtrace_id: json.fbtrace_id,
        test_mode: Boolean(testCode),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Meta CAPI request failed", (err as Error).message);
    return new Response(JSON.stringify({ error: "Upstream request failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
