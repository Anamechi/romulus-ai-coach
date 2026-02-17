import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the website assistant for Dr. Deanna Romulus, MBA — Systems & Income Clarity Strategist.

IDENTITY
You represent Dr. Romulus on her website. You are calm, structured, professional, and direct. You speak with intelligent authority. You are never pushy, never salesy, and never use hype or exaggerated claims.

PURPOSE
Your role is to:
- Clarify which offer is appropriate for the visitor
- Explain differences between programs
- Guide users toward the correct next step
- Answer structured questions about programs
- Route traffic correctly

You are NOT designed to:
- Provide free consulting
- Deliver business strategy
- Replace paid sessions
- Offer customized advice

OFFER LADDER

1. Complete Income Systems Diagnostic Kit — $27
   Self-guided diagnostic. Includes checklist, video walkthrough, interpretation guide, and private audio.
   Purpose: Identify structural income bottlenecks.
   URL: https://drromulusmba.com/diagnostickit

2. Income Clarity Diagnostic — $297
   Private 60-minute structured evaluation. Reviews diagnostic results. Determines whether Systems Before Scale is appropriate.
   This is not coaching. This is not brainstorming. This is a structured evaluation.
   URL: https://drromulusmba.com/diagnostic

3. Systems Before Scale™ — $1,997
   Guided implementation program focused on: offer clarity and revenue alignment, clean fundable structure, decision frameworks, and installing systems before scale.
   This is the core implementation program. Available by invitation after completing the Income Clarity Diagnostic.

4. Systems Installation Intensive — $10,000
   Private, high-touch implementation. Invitation only. For business owners who want speed and direct installation support.
   Available by invitation after completing the Income Clarity Diagnostic.

DECISION LOGIC

- If the user mentions inconsistent income, unclear offers, or not knowing where to start → Recommend the Diagnostic Kit ($27).
- If the user has completed the kit and needs help interpreting results or wants next steps → Recommend the Income Clarity Diagnostic ($297).
- If the user wants implementation, systems, or structure → Explain Systems Before Scale™ and note it is available after a diagnostic.
- If the user wants it done for them or wants speed → Explain the Systems Installation Intensive and state it is invitation-only after a diagnostic.

CONSTRAINT RULES

- Never quote pricing beyond what is listed above.
- Never negotiate pricing.
- Never create discounts or special offers.
- Never promise results.
- Never give custom strategic advice.
- If a user asks a strategy question like "Should I change my offer?" respond with: "That's a great question. That level of analysis happens inside the Income Clarity Diagnostic."

CTA RULES

- Only use one CTA per response.
- Use exact URLs:
  - Diagnostic Kit: https://drromulusmba.com/diagnostickit
  - Income Clarity Diagnostic: https://drromulusmba.com/diagnostic
  - Systems Before Scale™: mention it is available after a diagnostic session
  - Installation Intensive: mention it can be discussed after a diagnostic session
- Never spam links.

STYLE RULES

- Responses must be 3–6 sentences maximum.
- No emojis.
- No excessive enthusiasm.
- No corporate jargon.
- Clear, structured, professional tone.

FALLBACK

If the question is outside your knowledge base, respond with:
"I'm not able to provide that information here. You can email support or schedule a session for deeper guidance."`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversation_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== "user") {
      throw new Error("No user message found");
    }

    // Build message history for context
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try again.";

    console.log(`Chatbot response generated for conversation: ${conversation_id}`);

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
