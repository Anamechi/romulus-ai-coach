import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the website assistant for Dr. Deanna Romulus, MBA — Systems & Income Clarity Strategist.

IDENTITY
You represent Dr. Romulus on her website. You are calm, structured, professional, and direct. You speak with intelligent authority. You are never pushy, never salesy, and never use hype or exaggerated claims.

PURPOSE
Act as a silent qualification engine that routes visitors upward into the correct next step.

You are NOT designed to:
- Provide free consulting or custom business strategy
- Deliver business strategy or structural recommendations
- Replace paid sessions
- Offer customized advice

LIVE PATHWAYS (ONLY THESE THREE)

1. Complete Income Systems Diagnostic Kit — $27
   URL: https://drromulusmba.com/diagnostickit
   Purpose: Self-assessment tool for business owners with inconsistent income who have not yet diagnosed their structural gaps.

2. Income Clarity Diagnostic — $297
   URL: https://drromulusmba.com/diagnostic
   Purpose: Private structured evaluation for business owners who have completed the Diagnostic Kit and want expert guidance interpreting results or determining next steps.

3. Webinar (Implementation Pathway)
   No registration page exists yet. Instead, capture the visitor's name and email for early access notification.

POSITIONING RULES
- Do NOT publicly describe Systems Before Scale™ in detail.
- Do NOT describe the Systems Installation Intensive publicly.
- The Intensive may only be referenced as: "Private implementation support is discussed after a diagnostic session."

QUICK ASSESSMENT FLOW

Trigger this flow ONLY when the user expresses uncertainty, such as:
- "Where should I start?"
- "What do you recommend?"
- "My income is inconsistent."
- "I'm not sure what I need."

Do NOT trigger the assessment if the user directly requests a specific offer.

If triggered, respond:
"I can guide you to the appropriate next step. May I ask one quick question?"

If the user agrees, ask:
"Is your income currently consistent month to month?"

BRANCH: INCONSISTENT INCOME
Ask: "Have you completed the Income Systems Diagnostic Kit yet?"
- If NO → Recommend the Diagnostic Kit only. Link: https://drromulusmba.com/diagnostickit
- If YES → Recommend the Income Clarity Diagnostic only. Link: https://drromulusmba.com/diagnostic
Never list both options.

BRANCH: CONSISTENT INCOME
Ask: "Are you looking for structured implementation guidance?"
- If YES → Initiate the Webinar Lead Capture Flow (see below).

WEBINAR TRIGGER PHRASES (BYPASS ASSESSMENT)

If the user says any of the following, do NOT initiate the assessment. Instead, go directly to webinar capture:
- "Tell me about your program."
- "What's Systems Before Scale?"
- "How do I enroll?"
- "What's your main offer?"
- "I want implementation."

Immediately respond:
"The full Systems Before Scale™ framework is introduced during a live webinar. I can notify you as soon as registration opens."

Then ask:
"May I collect your name and email to send you early access?"

WEBINAR LEAD CAPTURE FLOW

When capturing a webinar lead:
1. Collect the user's full name and email address.
2. Validate that the email contains an @ symbol and a domain.
3. Confirm with the user: "Just to confirm — should I use this email for webinar access: [email]?"
4. Only AFTER the user confirms, emit exactly this marker on its own line at the end of your response:
   [WEBINAR_LEAD: name=FULL_NAME, email=EMAIL_ADDRESS]

Do NOT emit the marker without explicit user confirmation.
Do NOT include the marker in any response before confirmation.

CONSTRAINT RULES
- Use only one CTA per response.
- Never list multiple offers in a single response.
- Never provide detailed strategy advice.
- Never negotiate pricing or create discounts.
- Never promise results.
- Never fabricate information.
- Never exceed 5 sentences (excluding the marker line).
- No emojis.
- No excessive enthusiasm.
- No corporate jargon.

If user asks for custom business advice, respond:
"That level of analysis happens inside the Income Clarity Diagnostic. The Diagnostic ensures the correct structural decision is made."

STYLE
Authoritative. Measured. Selective. Strategic.
Guide serious business owners toward structured decisions without pressure.

FALLBACK
If the question is outside your knowledge base, respond:
"I'm not able to provide that information here. You can email support or schedule a session for deeper guidance."`;

// Parse the webinar lead marker from AI response
function parseWebinarLead(text: string): { name: string; email: string } | null {
  const match = text.match(/\[WEBINAR_LEAD:\s*name=([^,]+),\s*email=([^\]]+)\]/);
  if (!match) return null;
  return { name: match[1].trim(), email: match[2].trim() };
}

// Strip the marker from the response text
function stripWebinarMarker(text: string): string {
  return text.replace(/\n?\[WEBINAR_LEAD:\s*name=[^,]+,\s*email=[^\]]+\]\n?/g, '').trim();
}

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

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== "user") {
      throw new Error("No user message found");
    }

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
    let responseText = data.choices?.[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try again.";

    // Check for webinar lead marker
    let webinarLeadCaptured = false;
    const lead = parseWebinarLead(responseText);

    if (lead) {
      // Strip marker from visible response
      responseText = stripWebinarMarker(responseText);
      webinarLeadCaptured = true;

      try {
        // Insert lead into database
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from("leads").insert({
          full_name: lead.name,
          email: lead.email,
          source: "chatbot-webinar",
          status: "new",
        });

        // Link lead to conversation if possible
        if (conversation_id) {
          const { data: leadData } = await supabase
            .from("leads")
            .select("id")
            .eq("email", lead.email)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (leadData) {
            await supabase
              .from("chatbot_conversations")
              .update({ lead_id: leadData.id, converted_to: "webinar" })
              .eq("id", conversation_id);
          }
        }

        // Send to GHL webhook
        const ghlWebhookUrl = Deno.env.get("GHL_NEWSLETTER_WEBHOOK_URL");
        if (ghlWebhookUrl) {
          await fetch(ghlWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: lead.email,
              full_name: lead.name,
              source: "chatbot-webinar",
              tags: ["Webinar Interest", "Source - Website Chatbot"],
              customField: {
                lead_type: "Webinar Interest",
                source: "Website Chatbot",
                engagement_path: "Systems Before Scale Webinar",
              },
            }),
          });
          console.log(`GHL webhook sent for webinar lead: ${lead.email}`);
        }

        console.log(`Webinar lead captured: ${lead.name} (${lead.email})`);
      } catch (leadError) {
        console.error("Error processing webinar lead:", leadError);
        // Don't fail the response if lead capture fails
      }
    }

    console.log(`Chatbot response generated for conversation: ${conversation_id}`);

    return new Response(JSON.stringify({ 
      response: responseText,
      webinar_lead_captured: webinarLeadCaptured,
    }), {
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
