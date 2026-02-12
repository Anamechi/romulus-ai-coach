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
    const { contentId, contentType } = await req.json();
    console.log('Generating QAs for:', { contentId, contentType });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch content
    let title = '';
    let content = '';
    let topicId: string | null = null;

    if (contentType === 'blog_post') {
      const { data, error } = await supabase.from('blog_posts').select('title, content, topic_id').eq('id', contentId).single();
      if (error) throw error;
      title = data.title;
      content = data.content || '';
      topicId = data.topic_id;
    } else if (contentType === 'qa_page') {
      const { data, error } = await supabase.from('qa_pages').select('question, answer, topic_id').eq('id', contentId).single();
      if (error) throw error;
      title = data.question;
      content = data.answer;
      topicId = data.topic_id;
    }

    // Fetch master prompt
    const { data: settings } = await supabase.from('content_settings').select('master_content_prompt').single();
    const masterPrompt = settings?.master_content_prompt || '';

    const systemPrompt = `You are an SEO and AEO expert for Dr. Romulus MBA, a business consulting platform.
${masterPrompt}

Generate 4 contextual Q&A pairs based on the article content below. Each Q&A must:
- Be directly relevant to the article topic
- Have answers of 80-120 words
- Be suitable for FAQ schema markup
- Be written in professional, authoritative tone
- Include actionable insights
- NOT fabricate statistics or make income guarantees

CRITICAL: Respond with ONLY valid JSON. No markdown code blocks.`;

    const userPrompt = `Article Title: ${title}

Article Content (first 2000 chars):
${content.substring(0, 2000)}

Generate 4 Q&A pairs. Return JSON:
{
  "qa_pairs": [
    {
      "question": "Clear, specific question",
      "answer": "Detailed 80-120 word answer with actionable advice",
      "slug": "url-friendly-slug"
    }
  ]
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
    const parsed = JSON.parse(cleanContent);

    // Get default author
    const { data: defaultAuthor } = await supabase
      .from('authors')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    // Insert QA pages
    const insertedQAs = [];
    for (const qa of parsed.qa_pairs) {
      const { data: inserted, error } = await supabase
        .from('qa_pages')
        .insert({
          question: qa.question,
          answer: qa.answer,
          slug: qa.slug,
          topic_id: topicId,
          author_id: defaultAuthor?.id || null,
          speakable_answer: qa.answer.substring(0, 300),
          status: 'draft',
        })
        .select()
        .single();

      if (error) {
        console.error('Insert QA error:', error);
        continue;
      }
      insertedQAs.push(inserted);
    }

    console.log(`Generated ${insertedQAs.length} QA pages`);

    return new Response(
      JSON.stringify({ success: true, generated: insertedQAs.length, qa_pages: insertedQAs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('QA generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
