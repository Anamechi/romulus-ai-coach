import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clusterId, clusterTopic, targetAudience, primaryKeyword, language } = await req.json();
    console.log('Starting cluster generation:', { clusterId, clusterTopic, primaryKeyword });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update cluster status to generating
    await supabase
      .from('content_clusters')
      .update({ status: 'generating' })
      .eq('id', clusterId);

    // Fetch content settings for context
    const { data: settings } = await supabase
      .from('content_settings')
      .select('*')
      .single();

    const siteName = settings?.site_name || 'Dr. Romulus MBA';
    const masterPrompt = settings?.master_content_prompt || '';

    // Define the cluster structure
    const clusterStructure = [
      { stage: 'TOFU', type: 'guide', focus: 'broad educational overview' },
      { stage: 'TOFU', type: 'explainer', focus: 'how it works, key concepts' },
      { stage: 'TOFU', type: 'guide', focus: 'getting started basics' },
      { stage: 'MOFU', type: 'comparison', focus: 'comparing approaches or solutions' },
      { stage: 'MOFU', type: 'explainer', focus: 'deep-dive best practices' },
      { stage: 'BOFU', type: 'decision', focus: 'action-oriented implementation guide' },
    ];

    const generatedItems = [];

    for (let i = 0; i < clusterStructure.length; i++) {
      const { stage, type, focus } = clusterStructure[i];
      console.log(`Generating ${stage} ${type} article (${i + 1}/6)...`);

      const systemPrompt = `You are an expert content writer for ${siteName}, a business consulting and MBA coaching service.
${masterPrompt}

Your task is to generate a high-quality, SEO-optimized, EEAT-compliant article that:
- Is written for: ${targetAudience}
- Focuses on: ${clusterTopic}
- Primary keyword: ${primaryKeyword}
- Funnel stage: ${stage} (${stage === 'TOFU' ? 'Awareness - educate and attract' : stage === 'MOFU' ? 'Consideration - build trust and authority' : 'Decision - convert to action'})
- Content type: ${type} (${focus})
- Language: ${language === 'en' ? 'English' : language}
- Word count: 1500-2000 words (MANDATORY)
- Must include 5-8 AEO-optimized FAQs (80-120 words each)
- Must include EEAT authority block citing Dr. Romulus's credentials
- Must use proper markdown formatting (##, ###, bullet points, bold)
- Group ID for this cluster: ${clusterId}

EEAT Authority Block (include at end of article):
Dr. Deanna Romulus, MBA holds a Doctorate in Educational Leadership and an MBA in Finance. With expertise in business strategy, automation systems, and financial self-efficacy, she helps entrepreneurs build structured, credible, and scalable businesses.

Author attribution: Dr. Romulus, MBA - Business Consultant & MBA Coach

Anti-Hallucination Rules:
- Do NOT fabricate statistics, studies, or data points
- Do NOT include legal, tax, or financial advice
- Do NOT make income guarantees or earnings claims
- Do NOT mention specific companies as clients
- Use phrases like "research suggests" or "industry data indicates" only when broadly accurate

Canonical URL format: https://drromulusmba.com/blog/{slug}

CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no code blocks, no explanatory text. Just raw JSON starting with { and ending with }.`;

      const userPrompt = `Generate article ${i + 1} of 6 for this content cluster.

Return ONLY a JSON object with these exact fields:
{
  "title": "Compelling H1 headline (max 70 chars)",
  "slug": "url-friendly-slug",
  "content": "Full article content in markdown format (1500-2000 words). Include headers (##, ###), bullet points, numbered lists, bold text, and actionable advice. End with an EEAT authority block.",
  "speakable_answer": "A 40-60 word direct answer summarizing the key takeaway. This must be factual, clear, and suitable for voice assistants.",
  "meta_title": "SEO title under 60 characters",
  "meta_description": "SEO description under 160 characters",
  "faqs": [
    {"question": "AEO-optimized FAQ 1?", "answer": "Detailed 80-120 word answer with actionable insight"},
    {"question": "AEO-optimized FAQ 2?", "answer": "Detailed 80-120 word answer with actionable insight"},
    {"question": "AEO-optimized FAQ 3?", "answer": "Detailed 80-120 word answer with actionable insight"},
    {"question": "AEO-optimized FAQ 4?", "answer": "Detailed 80-120 word answer with actionable insight"},
    {"question": "AEO-optimized FAQ 5?", "answer": "Detailed 80-120 word answer with actionable insight"}
  ]
}`;

      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI API error status:', response.status);
          console.error('AI API error body:', errorText);
          throw new Error(`AI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        let generatedContent;

        try {
          const content = data.choices[0].message.content;
          // Clean up potential markdown code blocks
          const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          generatedContent = JSON.parse(cleanContent);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Failed to parse AI response as JSON');
        }

        // Insert the generated item
        const { data: insertedItem, error: insertError } = await supabase
          .from('cluster_items')
          .insert({
            cluster_id: clusterId,
            funnel_stage: stage,
            content_type: type,
            title: generatedContent.title,
            slug: generatedContent.slug,
            content: generatedContent.content,
            speakable_answer: generatedContent.speakable_answer,
            meta_title: generatedContent.meta_title,
            meta_description: generatedContent.meta_description,
            faqs: generatedContent.faqs || [],
            internal_links: [],
            external_citations: [],
            status: 'draft',
            sort_order: i,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }

        generatedItems.push(insertedItem);
        console.log(`Successfully generated: ${generatedContent.title}`);

      } catch (itemError) {
        console.error(`Error generating item ${i + 1}:`, itemError);
        // Continue with other items even if one fails
      }
    }

    // Update cluster status
    const finalStatus = generatedItems.length === 6 ? 'review' : 
                        generatedItems.length > 0 ? 'review' : 'failed';
    
    await supabase
      .from('content_clusters')
      .update({ 
        status: finalStatus,
        error_message: generatedItems.length < 6 ? 
          `Only ${generatedItems.length}/6 articles generated successfully` : null
      })
      .eq('id', clusterId);

    console.log(`Cluster generation complete: ${generatedItems.length}/6 items`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        itemsGenerated: generatedItems.length,
        clusterId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Cluster generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Try to update cluster status to failed
    try {
      const { clusterId } = await req.json().catch(() => ({}));
      if (clusterId) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('content_clusters')
          .update({ status: 'failed', error_message: errorMessage })
          .eq('id', clusterId);
      }
    } catch (e) {
      console.error('Failed to update cluster status:', e);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
