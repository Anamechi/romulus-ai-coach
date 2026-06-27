// Meta Conversions API relay.
// Receives event payloads from the browser pixel and forwards them to Meta
// server-side, hashing PII (email/phone) with SHA-256 first.
//
// Secrets:
//   META_CAPI_ACCESS_TOKEN  (required)  — never log, never accept from client
//   META_CAPI_TEST_CODE     (optional)  — set for Test Events, unset for prod
//
// Pixel ID is hardcoded (not a secret).

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const PIXEL_ID = "2014599869476161";
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

interface InboundUserData {
  em?: string;
  ph?: string;
  fbp?: string;
  fbc?: string;
}

interface InboundPayload {
  event_name?: string;
  event_id?: string;
  event_time?: number;
  event_source_url?: string;
  action_source?: string;
  user_data?: InboundUserData;
  custom_data?: Record<string, unknown>;
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function looksHashed(v: string): boolean {
  return /^[a-f0-9]{64}$/i.test(v);
}

async function normalizeAndHash(v: string | undefined): Promise<string | undefined> {
  if (!v) return undefined;
  const trimmed = v.trim().toLowerCase();
  if (!trimmed) return undefined;
  return looksHashed(trimmed) ? trimmed : await sha256(trimmed);
}

async function normalizePhone(v: string | undefined): Promise<string | undefined> {
  if (!v) return undefined;
  const digits = v.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return looksHashed(v.trim()) ? v.trim().toLowerCase() : await sha256(digits);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "CAPI not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const testCode = Deno.env.get("META_CAPI_TEST_CODE");

  let body: InboundPayload;
  try {
    body = (await req.json()) as InboundPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.event_name || typeof body.event_name !== "string") {
    return new Response(JSON.stringify({ error: "event_name required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ua = req.headers.get("user-agent") ?? undefined;
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const clientIp = xff.split(",")[0]?.trim() || undefined;

  const inUser = body.user_data ?? {};
  const [em, ph] = await Promise.all([
    normalizeAndHash(inUser.em),
    normalizePhone(inUser.ph),
  ]);

  const user_data: Record<string, unknown> = {};
  if (em) user_data.em = [em];
  if (ph) user_data.ph = [ph];
  if (inUser.fbp) user_data.fbp = inUser.fbp;
  if (inUser.fbc) user_data.fbc = inUser.fbc;
  if (clientIp) user_data.client_ip_address = clientIp;
  if (ua) user_data.client_user_agent = ua;

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
  if (testCode) payload.test_event_code = testCode;

  try {
    const resp = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const text = await resp.text();
    if (!resp.ok) {
      // Log status only; never log the token or full request payload.
      console.error("Meta CAPI error", resp.status, text.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "Upstream error", status: resp.status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }
    return new Response(JSON.stringify({ ok: true, meta: parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Meta CAPI fetch failed", (err as Error).message);
    return new Response(JSON.stringify({ error: "Network error" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
