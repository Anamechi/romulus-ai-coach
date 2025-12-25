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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { title, topic, description, customPrompt } = await req.json();

    if (!title && !customPrompt) {
      throw new Error("Title or custom prompt is required for image generation");
    }

    console.log("Generating image for:", title || "Custom prompt");
    console.log("Custom prompt provided:", !!customPrompt);

    // Build the image prompt - use custom prompt if provided, otherwise auto-generate
    let imagePrompt: string;
    
    if (customPrompt && customPrompt.trim()) {
      // Use the custom prompt but enhance it for blog header quality
      imagePrompt = `Create a professional, high-quality blog header image (16:9 aspect ratio) based on this description: ${customPrompt.trim()}

Style requirements:
- Ultra high resolution, photorealistic or high-quality illustration style
- Clean composition suitable for a professional blog header
- No text, watermarks, or logos in the image
- Rich colors and professional lighting
- Modern, polished aesthetic`;
    } else {
      // Auto-generate prompt from title and topic
      imagePrompt = `Create a professional, high-quality blog header image for an article titled "${title}".
Topic: ${topic || "Business coaching and strategy"}
${description ? `Article context: ${description}` : ""}

Style requirements:
- Ultra high resolution, photorealistic or high-quality illustration style  
- 16:9 aspect ratio suitable for blog header
- Clean, modern corporate design with sophisticated color palette
- No text, watermarks, or logos in the image
- Conceptual imagery that represents the article's theme
- Professional lighting and composition
- Suitable for a business coaching and consulting website`;
    }

    console.log("Using prompt:", imagePrompt.substring(0, 200) + "...");

    // Generate image using Lovable AI with gemini-2.5-flash-image model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt
          }
        ],
        modalities: ["image", "text"]
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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Image generation failed");
    }

    const aiData = await response.json();
    console.log("AI response received");

    // Extract the image from the response
    const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(aiData));
      throw new Error("No image generated");
    }

    // The image is base64 encoded, extract the data
    const base64Match = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      throw new Error("Invalid image format");
    }

    const imageType = base64Match[1];
    const base64Data = base64Match[2];

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const slugBase = title 
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50)
      : 'custom-image';
    const filename = `${slugBase}-${timestamp}.${imageType}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, bytes, {
        contentType: `image/${imageType}`,
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename);

    console.log("Image uploaded successfully:", urlData.publicUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      imageUrl: urlData.publicUrl,
      filename
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Generate blog image error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
