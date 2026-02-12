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

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  pt: 'Portuguese',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceId, sourceType, targetLanguage } = await req.json();
    console.log('Translating:', { sourceId, sourceType, targetLanguage });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const languageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

    // Fetch source content
    let sourceContent: any;
    if (sourceType === 'blog_post') {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', sourceId).single();
      if (error) throw error;
      sourceContent = { title: data.title, content: data.content, excerpt: data.excerpt, slug: data.slug, meta_title: data.meta_title, meta_description: data.meta_description, speakable_summary: data.speakable_summary };
    } else if (sourceType === 'qa_page') {
      const { data, error } = await supabase.from('qa_pages').select('*').eq('id', sourceId).single();
      if (error) throw error;
      sourceContent = { title: data.question, content: data.answer, slug: data.slug, meta_title: data.meta_title, meta_description: data.meta_description, speakable_summary: data.speakable_answer };
    } else if (sourceType === 'faq') {
      const { data, error } = await supabase.from('faqs').select('*').eq('id', sourceId).single();
      if (error) throw error;
      sourceContent = { title: data.question, content: data.answer, slug: data.slug, speakable_summary: data.speakable_answer };
    } else {
      throw new Error(`Unknown source type: ${sourceType}`);
    }

    // Fetch master prompt
    const { data: settings } = await supabase.from('content_settings').select('master_content_prompt').single();
    const masterPrompt = settings?.master_content_prompt || '';

    const systemPrompt = `You are a professional translator. Translate the following content to ${languageName}.
${masterPrompt}

Rules:
- Preserve all markdown formatting exactly
- Preserve all URLs and links unchanged
- Translate naturally, not literally
- Maintain professional business tone
- Keep technical terms when no standard translation exists
- Preserve the speakable summary at 40-60 words

CRITICAL: Respond with ONLY valid JSON. No markdown code blocks.`;

    const userPrompt = `Translate this content to ${languageName}:

${JSON.stringify(sourceContent, null, 2)}

Return JSON with these fields:
{
  "title": "translated title",
  "slug": "translated-slug-in-${targetLanguage}",
  "content": "translated content with markdown preserved",
  "excerpt": "translated excerpt",
  "meta_title": "translated meta title (max 60 chars)",
  "meta_description": "translated meta description (max 160 chars)",
  "speakable_summary": "translated speakable summary (40-60 words)"
}`;

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
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const translated = JSON.parse(cleanContent);

    // Determine group_id from cluster
    let groupId = null;
    if (sourceType === 'blog_post') {
      const { data: clusterItem } = await supabase
        .from('cluster_items')
        .select('cluster_id')
        .eq('published_content_id', sourceId)
        .maybeSingle();
      groupId = clusterItem?.cluster_id || null;
    }

    const canonicalUrl = `https://drromulusmba.com/${targetLanguage}/${sourceType === 'blog_post' ? 'blog' : sourceType === 'qa_page' ? 'qa' : 'faq'}/${translated.slug}`;

    // Upsert translation
    const { data: insertedTranslation, error: insertError } = await supabase
      .from('content_translations')
      .upsert({
        source_id: sourceId,
        source_type: sourceType,
        language: targetLanguage,
        group_id: groupId,
        title: translated.title,
        slug: translated.slug,
        content: translated.content,
        excerpt: translated.excerpt || null,
        meta_title: translated.meta_title,
        meta_description: translated.meta_description,
        speakable_summary: translated.speakable_summary,
        hreflang_tag: targetLanguage,
        canonical_url: canonicalUrl,
        status: 'draft',
      }, { onConflict: 'source_id,source_type,language' })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('Translation complete:', translated.title);

    return new Response(
      JSON.stringify({ success: true, translation: insertedTranslation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
