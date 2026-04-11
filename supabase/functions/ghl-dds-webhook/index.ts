import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DDSLeadPayload {
  firstName: string;
  email: string;
  phone: string;
  quizScore?: number;
  quizStage?: string;
  recommendedOffer?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: DDSLeadPayload = await req.json();
    const { firstName, email, phone, quizScore, quizStage, recommendedOffer } = payload;

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!firstName || !phone) {
      return new Response(
        JSON.stringify({ error: "First name and phone are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ghlWebhookUrl = Deno.env.get("GHL_DDS_WEBHOOK_URL");

    if (!ghlWebhookUrl) {
      console.error("GHL_DDS_WEBHOOK_URL not configured");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Lead recorded",
          warning: "GHL webhook not configured" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ghlPayload = {
      first_name: firstName,
      email: email,
      phone: phone,
      tags: ["dds lead magnet"],
      customField: {
        lead_type: "DDS Framework",
        entry_point: "DDS Framework Landing Page",
        dds_quiz_score: quizScore?.toString() ?? "",
        dds_quiz_stage: quizStage ?? "",
        recommended_offer: recommendedOffer ?? "",
        submission_timestamp: new Date().toISOString(),
      },
      // Pipeline placement
      pipeline: "DDS Funnel",
      pipeline_stage: "1. Checklist Delivered",
      // Workflow trigger
      workflow: "DDS — Comment Trigger + Lead Capture",
    };

    const ghlResponse = await fetch(ghlWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ghlPayload),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error("GHL DDS webhook error:", errorText);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Lead recorded",
          ghlStatus: ghlResponse.status 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`DDS lead captured for: ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "DDS lead captured successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("DDS webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
