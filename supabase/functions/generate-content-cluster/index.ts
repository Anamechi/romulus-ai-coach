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

const CLUSTER_STRUCTURE = [
  { stage: 'TOFU', type: 'guide', focus: 'broad educational overview' },
  { stage: 'TOFU', type: 'explainer', focus: 'how it works, key concepts' },
  { stage: 'TOFU', type: 'guide', focus: 'getting started basics' },
  { stage: 'MOFU', type: 'comparison', focus: 'comparing approaches or solutions' },
  { stage: 'MOFU', type: 'explainer', focus: 'deep-dive best practices' },
  { stage: 'BOFU', type: 'decision', focus: 'action-oriented implementation guide' },
];

const MAX_ATTEMPTS = 3;

function sanitizeJson(raw: string): string {
  return raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

function validateArticle(a: any): string | null {
  if (!a || typeof a !== 'object') return 'not an object';
  const required = ['title', 'slug', 'content', 'speakable_answer', 'meta_title', 'meta_description', 'faqs', 'external_citations'];
  for (const f of required) if (!(f in a)) return `missing ${f}`;
  if (!Array.isArray(a.faqs) || a.faqs.length < 5) return 'need ≥5 FAQs';
  if (!Array.isArray(a.external_citations) || a.external_citations.length < 3) return 'need ≥3 citations';
  for (const c of a.external_citations) {
    if (!c?.url || !c?.title || !c?.source) return 'citation missing url/title/source';
    if (!/^https?:\/\//i.test(c.url)) return 'citation url invalid';
  }
  const wordCount = String(a.content).split(/\s+/).length;
  if (wordCount < 1200) return `content too short (${wordCount} words)`;
  return null;
}

async function generateArticle(
  idx: number,
  stage: string,
  type: string,
  focus: string,
  ctx: { clusterId: string; clusterTopic: string; targetAudience: string; primaryKeyword: string; language: string; siteName: string; masterPrompt: string }
): Promise<any> {
  const systemPrompt = `You are an expert content writer for ${ctx.siteName}, a business consulting and MBA coaching service.
${ctx.masterPrompt}

MANDATORY OUTPUT REQUIREMENTS (non-negotiable):
- Audience: ${ctx.targetAudience}
- Topic: ${ctx.clusterTopic}
- Primary keyword: ${ctx.primaryKeyword}
- Funnel stage: ${stage} (${stage === 'TOFU' ? 'Awareness' : stage === 'MOFU' ? 'Consideration' : 'Decision'})
- Content type: ${type} — ${focus}
- Language: ${ctx.language === 'en' ? 'English' : ctx.language}
- Word count: 1500–2000 words (HARD MINIMUM 1500)
- 5–8 AEO-optimized FAQs (80–120 words each)
- 3–5 credible external citations from authoritative sources (.gov, .edu, peer-reviewed journals, established industry publications like HBR, McKinsey, Forbes, Gartner, Statista, SBA, BLS, etc.)
- EEAT authority block at the end citing Dr. Romulus's credentials (Ed.D., MBA Finance)

ANTI-HALLUCINATION RULES (strict):
- NEVER fabricate statistics, studies, quotes, or data points
- NEVER invent author names, publication dates, or page titles
- ONLY cite sources you are confident exist with real URLs at established domains
- If unsure about a specific stat, use qualitative language ("industry research suggests") instead
- NO income guarantees, NO legal/tax/financial advice, NO specific client names
- Every citation URL must be a real, verifiable page at a reputable publisher

CRITICAL: Respond with ONLY a raw JSON object. No markdown fences, no prose. Start with { end with }.`;

  const userPrompt = `Generate article ${idx + 1} of 6 in the cluster.

Return ONLY this JSON shape:
{
  "title": "H1 (max 70 chars)",
  "slug": "url-friendly-slug",
  "content": "Full markdown article 1500–2000 words with ##/### headers, lists, bold. End with EEAT authority block.",
  "speakable_answer": "40–60 word voice-assistant summary",
  "meta_title": "SEO title <60 chars",
  "meta_description": "SEO description <160 chars",
  "faqs": [
    {"question": "Q1?", "answer": "80–120 word answer"},
    {"question": "Q2?", "answer": "80–120 word answer"},
    {"question": "Q3?", "answer": "80–120 word answer"},
    {"question": "Q4?", "answer": "80–120 word answer"},
    {"question": "Q5?", "answer": "80–120 word answer"}
  ],
  "external_citations": [
    {"title": "Real page title", "url": "https://real-authoritative-domain.com/path", "source": "Publisher name (e.g., Harvard Business Review)"},
    {"title": "...", "url": "https://...", "source": "..."},
    {"title": "...", "url": "https://...", "source": "..."}
  ]
}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
        console.error(`[${stage} #${idx + 1}] attempt ${attempt} API ${response.status}: ${errorText}`);
        if (response.status === 429 || response.status === 402) {
          // back off then retry
          await new Promise((r) => setTimeout(r, 2000 * attempt));
          continue;
        }
        throw new Error(`AI API ${response.status}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? '';
      let parsed: any;
      try {
        parsed = JSON.parse(sanitizeJson(raw));
      } catch (e) {
        console.error(`[${stage} #${idx + 1}] attempt ${attempt} JSON parse failed`);
        continue;
      }

      const err = validateArticle(parsed);
      if (err) {
        console.error(`[${stage} #${idx + 1}] attempt ${attempt} validation: ${err}`);
        continue;
      }

      return parsed;
    } catch (e) {
      console.error(`[${stage} #${idx + 1}] attempt ${attempt} error:`, e);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }

  throw new Error(`Failed to generate ${stage} article #${idx + 1} after ${MAX_ATTEMPTS} attempts`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  let clusterId: string | undefined;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.json();
    clusterId = body.clusterId;
    const { clusterTopic, targetAudience, primaryKeyword, language } = body;
    console.log('Cluster generation start:', { clusterId, clusterTopic });

    await supabase.from('content_clusters').update({ status: 'generating', error_message: null }).eq('id', clusterId);

    const { data: settings } = await supabase.from('content_settings').select('*').single();
    const ctx = {
      clusterId: clusterId!,
      clusterTopic,
      targetAudience,
      primaryKeyword,
      language,
      siteName: settings?.site_name || 'Dr. Romulus MBA',
      masterPrompt: settings?.master_content_prompt || '',
    };

    // Clean any prior partial items for this cluster (idempotent regeneration)
    await supabase.from('cluster_items').delete().eq('cluster_id', clusterId);

    // Run generation in the background to avoid 150s edge timeout.
    // Client polls content_clusters.status for completion.
    const work = (async () => {
      const generated: any[] = [];
      const failures: string[] = [];

      for (let i = 0; i < CLUSTER_STRUCTURE.length; i++) {
        const { stage, type, focus } = CLUSTER_STRUCTURE[i];
        try {
          const article = await generateArticle(i, stage, type, focus, ctx);
          const { data: inserted, error: insertError } = await supabase
            .from('cluster_items')
            .insert({
              cluster_id: clusterId,
              funnel_stage: stage,
              content_type: type,
              title: article.title,
              slug: article.slug,
              content: article.content,
              speakable_answer: article.speakable_answer,
              meta_title: article.meta_title,
              meta_description: article.meta_description,
              faqs: article.faqs,
              internal_links: [],
              external_citations: article.external_citations,
              status: 'draft',
              sort_order: i,
            })
            .select()
            .single();
          if (insertError) throw insertError;
          generated.push(inserted);
          console.log(`✓ ${stage} #${i + 1}: ${article.title}`);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`✗ ${stage} #${i + 1}: ${msg}`);
          failures.push(`${stage} #${i + 1}: ${msg}`);
        }
      }

      if (generated.length === CLUSTER_STRUCTURE.length) {
        await supabase.from('content_clusters').update({ status: 'review', error_message: null }).eq('id', clusterId);
      } else {
        await supabase
          .from('content_clusters')
          .update({
            status: 'failed',
            error_message: `Only ${generated.length}/6 articles generated. Failures: ${failures.join(' | ')}`,
          })
          .eq('id', clusterId);
      }
    })();

    // @ts-ignore EdgeRuntime is available in Supabase edge runtime
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(work);
    } else {
      work.catch((e) => console.error('background work error', e));
    }

    return new Response(
      JSON.stringify({ success: true, status: 'generating', clusterId, message: 'Generation started in background. Poll cluster status for completion.' }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Cluster generation fatal:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (clusterId) {
      await supabase.from('content_clusters').update({ status: 'failed', error_message: msg }).eq('id', clusterId).then(() => {});
    }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
