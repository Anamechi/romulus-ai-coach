import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PILLAR_PAGES = [
  { id: 'about', title: 'About Dr. Romulus', slug: 'about', url: '/about' },
  { id: 'coaching', title: '1-on-1 Coaching', slug: 'programs', url: '/programs' },
  { id: 'blog', title: 'Blog', slug: 'blog', url: '/blog' },
  { id: 'faqs', title: 'FAQs', slug: 'faq', url: '/faq' },
];

// Round-robin index tracked per scan run
let pillarIndex = 0;

function pickPillar(): typeof PILLAR_PAGES[0] {
  const p = PILLAR_PAGES[pillarIndex % PILLAR_PAGES.length];
  pillarIndex++;
  return p;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { mode, content_types, topic_filter, max_external_links } = await req.json();
    console.log('Starting content scan:', { mode, content_types, topic_filter, max_external_links });

    // Reset round-robin
    pillarIndex = 0;

    // Create scan run
    const { data: scanRun, error: scanError } = await supabase
      .from('linking_scan_runs')
      .insert({ status: 'running', mode, content_types, topic_filter: topic_filter || null, max_external_links })
      .select()
      .single();
    if (scanError) throw scanError;

    // Fetch content to scan
    let blogPosts: any[] = [];
    let faqs: any[] = [];
    let qaPages: any[] = [];

    if (content_types.includes('blog_post')) {
      let q = supabase.from('blog_posts').select('id, title, slug, content, topic_id, published');
      if (topic_filter) q = q.eq('topic_id', topic_filter);
      const { data } = await q;
      blogPosts = data || [];
    }
    if (content_types.includes('faq')) {
      let q = supabase.from('faqs').select('id, question, slug, answer, topic_id, status');
      if (topic_filter) q = q.eq('topic_id', topic_filter);
      const { data } = await q;
      faqs = data || [];
    }
    if (content_types.includes('qa_page')) {
      let q = supabase.from('qa_pages').select('id, question, slug, answer, topic_id, status');
      if (topic_filter) q = q.eq('topic_id', topic_filter);
      const { data } = await q;
      qaPages = data || [];
    }

    const totalItems = blogPosts.length + faqs.length + qaPages.length;
    await supabase.from('linking_scan_runs').update({ total_items: totalItems }).eq('id', scanRun.id);

    // Fetch all published content for cross-linking
    const { data: allPosts } = await supabase.from('blog_posts').select('id, title, slug, topic_id, published').eq('published', true);
    const { data: allFaqs } = await supabase.from('faqs').select('id, question, slug, topic_id, status').eq('status', 'published');
    const { data: allQAs } = await supabase.from('qa_pages').select('id, question, slug, topic_id, status').eq('status', 'published');
    const { data: authoritySources } = await supabase.from('authority_sources').select('*').eq('is_active', true);

    let processedCount = 0;

    // Helper: pick external citations with rotation
    let sourceRotation = 0;
    function pickExternalCitations(max: number) {
      const sources = authoritySources || [];
      if (sources.length === 0) return [];
      const primary = sources.filter(s => s.trust_level === 'Primary');
      const secondary = sources.filter(s => s.trust_level === 'Secondary');
      const combined = [...primary, ...secondary];
      const selected = [];
      for (let i = 0; i < Math.min(max, combined.length); i++) {
        const idx = (sourceRotation + i) % combined.length;
        selected.push(combined[idx]);
      }
      sourceRotation += max;
      return selected.map(s => ({
        source_id: s.id, source_name: s.name, domain: s.domain,
        anchor_text: `According to ${s.name}`, url: `https://${s.domain}`,
      }));
    }

    // Process blog posts
    for (const post of blogPosts) {
      const warnings: string[] = [];
      const pillar = pickPillar();

      // Related posts: up to 2 same-topic + 1 cross-topic
      const sameTopic = shuffle((allPosts || []).filter(p => p.id !== post.id && p.topic_id === post.topic_id && p.published));
      const crossTopic = shuffle((allPosts || []).filter(p => p.id !== post.id && p.topic_id !== post.topic_id && p.published));
      const relatedPost = sameTopic[0] || null;
      const relatedPost2 = sameTopic[1] || crossTopic[0] || null;

      if (!relatedPost) warnings.push('No related blog post found in same topic');

      // Related FAQ
      const relatedFaqs = shuffle((allFaqs || []).filter(f => f.topic_id === post.topic_id));
      const relatedFaq = relatedFaqs[0] || null;
      if (!relatedFaq) warnings.push('No related FAQ found');

      // Related Q&A page
      const relatedQAs = shuffle((allQAs || []).filter(q => q.topic_id === post.topic_id));
      const relatedQA = relatedQAs[0] || null;

      const externalCitations = pickExternalCitations(max_external_links);

      // Build internal link count
      let internalAdded = 1; // pillar
      if (relatedPost) internalAdded++;
      if (relatedPost2) internalAdded++;
      if (relatedFaq) internalAdded++;
      if (relatedQA) internalAdded++;

      const scanItem: any = {
        scan_run_id: scanRun.id,
        content_type: 'blog_post',
        content_id: post.id,
        content_title: post.title,
        status: 'completed',
        pillar_page_suggestion: { id: pillar.id, title: pillar.title, slug: pillar.slug, anchor_text: `Learn more about ${pillar.title.toLowerCase()}`, url: pillar.url },
        related_post_suggestion: relatedPost ? { id: relatedPost.id, title: relatedPost.title, slug: relatedPost.slug, anchor_text: `Read about ${relatedPost.title.toLowerCase()}`, url: `/blog/${relatedPost.slug}` } : null,
        faq_suggestion: relatedFaq ? { id: relatedFaq.id, title: relatedFaq.question, slug: relatedFaq.slug, anchor_text: relatedFaq.question, url: `/faq/${relatedFaq.slug}` } : null,
        external_citations: externalCitations,
        internal_links_added: internalAdded,
        external_links_added: externalCitations.length,
        warnings,
        applied: mode === 'auto_apply',
        applied_at: mode === 'auto_apply' ? new Date().toISOString() : null,
      };

      await supabase.from('linking_scan_items').insert(scanItem);

      // Auto-apply: create internal_links records
      if (mode === 'auto_apply') {
        const links = [];
        if (relatedPost) links.push({ source_type: 'blog_post', source_id: post.id, target_type: 'blog_post', target_id: relatedPost.id, link_text: `Read about ${relatedPost.title.toLowerCase()}`, is_active: true });
        if (relatedPost2) links.push({ source_type: 'blog_post', source_id: post.id, target_type: 'blog_post', target_id: relatedPost2.id, link_text: `Explore ${relatedPost2.title.toLowerCase()}`, is_active: true });
        if (relatedFaq) links.push({ source_type: 'blog_post', source_id: post.id, target_type: 'faq', target_id: relatedFaq.id, link_text: relatedFaq.question, is_active: true });
        if (relatedQA) links.push({ source_type: 'blog_post', source_id: post.id, target_type: 'qa_page', target_id: relatedQA.id, link_text: relatedQA.question, is_active: true });

        for (const link of links) {
          const { data: existing } = await supabase.from('internal_links').select('id').eq('source_type', link.source_type).eq('source_id', link.source_id).eq('target_type', link.target_type).eq('target_id', link.target_id).single();
          if (!existing) await supabase.from('internal_links').insert(link);
        }
      }

      processedCount++;
      await supabase.from('linking_scan_runs').update({ processed_items: processedCount }).eq('id', scanRun.id);
    }

    // Process Q&A pages (NEW)
    for (const qa of qaPages) {
      const warnings: string[] = [];
      const pillar = pickPillar();

      // Related blog posts
      const sameTopicPosts = shuffle((allPosts || []).filter(p => p.topic_id === qa.topic_id && p.published));
      const crossTopicPosts = shuffle((allPosts || []).filter(p => p.topic_id !== qa.topic_id && p.published));
      const relatedPost = sameTopicPosts[0] || crossTopicPosts[0] || null;

      // Related FAQs
      const relatedFaqs = shuffle((allFaqs || []).filter(f => f.topic_id === qa.topic_id));
      const relatedFaq = relatedFaqs[0] || null;

      // Related Q&A (different from self)
      const relatedQAs = shuffle((allQAs || []).filter(q => q.id !== qa.id && q.topic_id === qa.topic_id));
      const relatedQA = relatedQAs[0] || null;

      if (!relatedPost) warnings.push('No related blog post found');
      if (!relatedFaq) warnings.push('No related FAQ found');

      const externalCitations = pickExternalCitations(max_external_links);

      let internalAdded = 1; // pillar
      if (relatedPost) internalAdded++;
      if (relatedFaq) internalAdded++;
      if (relatedQA) internalAdded++;

      const scanItem: any = {
        scan_run_id: scanRun.id,
        content_type: 'qa_page',
        content_id: qa.id,
        content_title: qa.question,
        status: 'completed',
        pillar_page_suggestion: { id: pillar.id, title: pillar.title, slug: pillar.slug, anchor_text: `Learn more about ${pillar.title.toLowerCase()}`, url: pillar.url },
        related_post_suggestion: relatedPost ? { id: relatedPost.id, title: relatedPost.title, slug: relatedPost.slug, anchor_text: `Read about ${relatedPost.title.toLowerCase()}`, url: `/blog/${relatedPost.slug}` } : null,
        faq_suggestion: relatedFaq ? { id: relatedFaq.id, title: relatedFaq.question, slug: relatedFaq.slug, anchor_text: relatedFaq.question, url: `/faq/${relatedFaq.slug}` } : null,
        external_citations: externalCitations,
        internal_links_added: internalAdded,
        external_links_added: externalCitations.length,
        warnings,
        applied: mode === 'auto_apply',
        applied_at: mode === 'auto_apply' ? new Date().toISOString() : null,
      };

      await supabase.from('linking_scan_items').insert(scanItem);

      // Auto-apply
      if (mode === 'auto_apply') {
        const links = [];
        if (relatedPost) links.push({ source_type: 'qa_page', source_id: qa.id, target_type: 'blog_post', target_id: relatedPost.id, link_text: `Read about ${relatedPost.title.toLowerCase()}`, is_active: true });
        if (relatedFaq) links.push({ source_type: 'qa_page', source_id: qa.id, target_type: 'faq', target_id: relatedFaq.id, link_text: relatedFaq.question, is_active: true });
        if (relatedQA) links.push({ source_type: 'qa_page', source_id: qa.id, target_type: 'qa_page', target_id: relatedQA.id, link_text: relatedQA.question, is_active: true });

        for (const link of links) {
          const { data: existing } = await supabase.from('internal_links').select('id').eq('source_type', link.source_type).eq('source_id', link.source_id).eq('target_type', link.target_type).eq('target_id', link.target_id).single();
          if (!existing) await supabase.from('internal_links').insert(link);
        }
      }

      processedCount++;
      await supabase.from('linking_scan_runs').update({ processed_items: processedCount }).eq('id', scanRun.id);
    }

    // Process FAQs
    for (const faq of faqs) {
      const warnings: string[] = [];

      // FAQs get related blog post and Q&A suggestions
      const sameTopicPosts = shuffle((allPosts || []).filter(p => p.topic_id === faq.topic_id && p.published));
      const relatedPost = sameTopicPosts[0] || null;

      const relatedQAs = shuffle((allQAs || []).filter(q => q.topic_id === faq.topic_id));
      const relatedQA = relatedQAs[0] || null;

      const externalCitations = pickExternalCitations(max_external_links);

      let internalAdded = 0;
      if (relatedPost) internalAdded++;
      if (relatedQA) internalAdded++;

      const scanItem: any = {
        scan_run_id: scanRun.id,
        content_type: 'faq',
        content_id: faq.id,
        content_title: faq.question,
        status: 'completed',
        pillar_page_suggestion: null,
        related_post_suggestion: relatedPost ? { id: relatedPost.id, title: relatedPost.title, slug: relatedPost.slug, anchor_text: `Read about ${relatedPost.title.toLowerCase()}`, url: `/blog/${relatedPost.slug}` } : null,
        faq_suggestion: relatedQA ? { id: relatedQA.id, title: relatedQA.question, slug: relatedQA.slug, anchor_text: relatedQA.question, url: `/qa/${relatedQA.slug}` } : null,
        external_citations: externalCitations,
        internal_links_added: internalAdded,
        external_links_added: externalCitations.length,
        warnings,
        applied: mode === 'auto_apply',
        applied_at: mode === 'auto_apply' ? new Date().toISOString() : null,
      };

      await supabase.from('linking_scan_items').insert(scanItem);

      if (mode === 'auto_apply') {
        const links = [];
        if (relatedPost) links.push({ source_type: 'faq', source_id: faq.id, target_type: 'blog_post', target_id: relatedPost.id, link_text: `Read about ${relatedPost.title.toLowerCase()}`, is_active: true });
        if (relatedQA) links.push({ source_type: 'faq', source_id: faq.id, target_type: 'qa_page', target_id: relatedQA.id, link_text: relatedQA.question, is_active: true });

        for (const link of links) {
          const { data: existing } = await supabase.from('internal_links').select('id').eq('source_type', link.source_type).eq('source_id', link.source_id).eq('target_type', link.target_type).eq('target_id', link.target_id).single();
          if (!existing) await supabase.from('internal_links').insert(link);
        }
      }

      processedCount++;
      await supabase.from('linking_scan_runs').update({ processed_items: processedCount }).eq('id', scanRun.id);
    }

    // Mark scan as completed
    await supabase.from('linking_scan_runs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', scanRun.id);
    console.log('Scan completed:', scanRun.id);

    return new Response(
      JSON.stringify({ success: true, scan_run_id: scanRun.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scan error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
