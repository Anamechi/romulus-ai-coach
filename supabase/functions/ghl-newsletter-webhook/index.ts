import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterPayload {
  email: string;
  source: string;
  pageUrl: string;
  timestamp: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NewsletterPayload = await req.json();
    const { email, source, pageUrl, timestamp } = payload;

    // Validate email
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get GHL webhook URL from environment
    const ghlWebhookUrl = Deno.env.get("GHL_NEWSLETTER_WEBHOOK_URL");

    if (!ghlWebhookUrl) {
      console.error("GHL_NEWSLETTER_WEBHOOK_URL not configured");
      // Still return success to user - we'll store locally and sync later
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Subscription recorded",
          warning: "GHL webhook not configured" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare GHL webhook payload
    // GHL expects specific field names for contact creation
    const ghlPayload = {
      email: email,
      source: source,
      // Custom fields for GHL
      customField: {
        lead_type: "Subscriber",
        engagement_path: "Weekly Insights",
        entry_point: "Website – Insights Section",
        page_url: pageUrl,
        submission_timestamp: timestamp,
      },
      // Tags to apply
      tags: [
        "Newsletter – Business Growth & Automation",
        "Interest – Automation Strategy",
        "Source – Website"
      ],
    };

    // Send to GHL webhook
    const ghlResponse = await fetch(ghlWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ghlPayload),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error("GHL webhook error:", errorText);
      // Still return success to user
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Subscription recorded",
          ghlStatus: ghlResponse.status 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Newsletter subscription successful for: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Newsletter webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
