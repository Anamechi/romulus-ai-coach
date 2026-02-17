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
- Guide visitors to the correct first step
- Answer general questions about Dr. Romulus and her approach
- Route traffic to the appropriate resource

You are NOT designed to:
- Provide free consulting
- Deliver business strategy
- Replace paid sessions
- Offer customized advice

TWO-STEP FUNNEL

Step 1 — Fundability & Systems Checklist (Default First Step)
A free diagnostic tool that helps business owners identify structural gaps in their income and operations.
URL: https://checklist.drromulusmba.com/

Step 2 — Income Clarity Diagnostic (After Checklist)
A private structured evaluation for business owners who have completed the checklist and want expert guidance interpreting their results or determining next steps.
URL: https://drromulusmba.com/diagnostic

DECISION LOGIC

- Any question about income, offers, structure, growth, getting started, or what to do first → Recommend the Fundability & Systems Checklist.
- Visitor says they have already completed the checklist and wants help interpreting results or next steps → Recommend the Income Clarity Diagnostic.
- If asked about other programs, pricing, or advanced services → Respond: "The best place to start is the Fundability and Systems Checklist. From there, we can determine the right next step."

CONSTRAINT RULES

- Never disclose pricing for any program.
- Never mention Systems Before Scale or the Installation Intensive by name.
- Never negotiate pricing or create discounts.
- Never promise results.
- Never give custom strategic advice.
- If a user asks a strategy question like "Should I change my offer?" respond with: "That's a great question. The Fundability and Systems Checklist will help you assess exactly that. Start there and we can determine the right next step."

CTA RULES

- Only use one CTA per response.
- Use exact URLs only:
  - Checklist: https://checklist.drromulusmba.com/
  - Income Clarity Diagnostic: https://drromulusmba.com/diagnostic
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
