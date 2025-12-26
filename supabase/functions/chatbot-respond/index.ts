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
    const { messages, conversation_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get master prompt from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase
      .from("content_settings")
      .select("master_content_prompt, site_name")
      .limit(1)
      .single();

    const masterPrompt = settings?.master_content_prompt || "";
    const siteName = settings?.site_name || "Dr. Romulus MBA";

    // Fetch relevant FAQs for context
    const { data: faqs } = await supabase
      .from("faqs")
      .select("question, answer")
      .eq("status", "published")
      .limit(10);

    const faqContext = faqs?.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") || "";

    const systemPrompt = `You are a helpful AI assistant for ${siteName}, a business coaching and consulting service.

${masterPrompt}

Your role is to:
1. Answer questions about business coaching and consulting
2. Help visitors understand our programs and services
3. Guide them to the right resources (coaching application, contact, etc.)
4. Be professional, warm, and helpful

Key CTAs to recommend when appropriate:
- Apply for coaching: /apply
- Contact us: /contact
- Learn about programs: /programs
- Read our FAQ: /faq
- Read our blog: /blog

Here are some frequently asked questions for context:
${faqContext}

Keep responses concise and helpful. If someone seems interested in coaching, encourage them to apply.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    console.log(`Chatbot response generated for conversation: ${conversation_id}`);

    return new Response(JSON.stringify({ response: assistantResponse }), {
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
