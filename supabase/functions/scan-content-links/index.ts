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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { mode, content_types, topic_filter, max_external_links } = await req.json();

    console.log('Starting content scan:', { mode, content_types, topic_filter, max_external_links });

    // Create scan run record
    const { data: scanRun, error: scanError } = await supabase
      .from('linking_scan_runs')
      .insert({
        status: 'running',
        mode,
        content_types,
        topic_filter: topic_filter || null,
        max_external_links,
      })
      .select()
      .single();

    if (scanError) throw scanError;

    // Fetch content to scan
    let blogPosts: any[] = [];
    let faqs: any[] = [];

    if (content_types.includes('blog_post')) {
      let query = supabase.from('blog_posts').select('id, title, slug, content, topic_id, published');
      if (topic_filter) {
        query = query.eq('topic_id', topic_filter);
      }
      const { data } = await query;
      blogPosts = data || [];
    }

    if (content_types.includes('faq')) {
      let query = supabase.from('faqs').select('id, question, slug, answer, topic_id, status');
      if (topic_filter) {
        query = query.eq('topic_id', topic_filter);
      }
      const { data } = await query;
      faqs = data || [];
    }

    const totalItems = blogPosts.length + faqs.length;

    // Update total items count
    await supabase
      .from('linking_scan_runs')
      .update({ total_items: totalItems })
      .eq('id', scanRun.id);

    // Fetch related data for suggestions
    const { data: allPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, topic_id, published')
      .eq('published', true);

    const { data: allFaqs } = await supabase
      .from('faqs')
      .select('id, question, slug, topic_id, status')
      .eq('status', 'published');

    const { data: authoritySources } = await supabase
      .from('authority_sources')
      .select('*')
      .eq('is_active', true);

    // Process each content item
    let processedCount = 0;

    // Process blog posts
    for (const post of blogPosts) {
      const warnings: string[] = [];
      
      // Find pillar page suggestion
      const pillarSuggestion = PILLAR_PAGES.find(p => p.slug !== 'blog') || PILLAR_PAGES[0];
      
      // Find related post (same topic, different post)
      const relatedPosts = (allPosts || []).filter(
        p => p.id !== post.id && p.topic_id === post.topic_id && p.published
      );
      const relatedPost = relatedPosts[0];
      
      if (!relatedPost) {
        warnings.push('No related blog post found in same topic');
      }

      // Find related FAQ
      const relatedFaqs = (allFaqs || []).filter(
        f => f.topic_id === post.topic_id && f.status === 'published'
      );
      const relatedFaq = relatedFaqs[0];
      
      if (!relatedFaq) {
        warnings.push('No related FAQ found - linking gap detected');
      }

      // Select external citations (prioritize Primary sources)
      const primarySources = (authoritySources || []).filter(s => s.trust_level === 'Primary');
      const secondarySources = (authoritySources || []).filter(s => s.trust_level === 'Secondary');
      const selectedSources = [
        ...primarySources.slice(0, Math.min(2, max_external_links)),
        ...secondarySources.slice(0, Math.max(0, max_external_links - primarySources.length)),
      ].slice(0, max_external_links);

      const externalCitations = selectedSources.map(source => ({
        source_id: source.id,
        source_name: source.name,
        domain: source.domain,
        anchor_text: `According to ${source.name}`,
        url: `https://${source.domain}`,
      }));

      // Create scan item
      const scanItem = {
        scan_run_id: scanRun.id,
        content_type: 'blog_post',
        content_id: post.id,
        content_title: post.title,
        status: 'completed',
        pillar_page_suggestion: {
          id: pillarSuggestion.id,
          title: pillarSuggestion.title,
          slug: pillarSuggestion.slug,
          anchor_text: `Learn more about ${pillarSuggestion.title.toLowerCase()}`,
          url: pillarSuggestion.url,
        },
        related_post_suggestion: relatedPost ? {
          id: relatedPost.id,
          title: relatedPost.title,
          slug: relatedPost.slug,
          anchor_text: `Read about ${relatedPost.title.toLowerCase()}`,
          url: `/blog/${relatedPost.slug}`,
        } : null,
        faq_suggestion: relatedFaq ? {
          id: relatedFaq.id,
          title: relatedFaq.question,
          slug: relatedFaq.slug,
          anchor_text: relatedFaq.question,
          url: `/faq/${relatedFaq.slug}`,
        } : null,
        external_citations: externalCitations,
        internal_links_added: (relatedPost ? 1 : 0) + (relatedFaq ? 1 : 0) + 1, // +1 for pillar
        external_links_added: externalCitations.length,
        warnings,
        applied: mode === 'auto_apply',
        applied_at: mode === 'auto_apply' ? new Date().toISOString() : null,
      };

      await supabase.from('linking_scan_items').insert(scanItem);

      // If auto-apply mode, update the content with internal links
      if (mode === 'auto_apply' && post.content) {
        const updatedContent = await applyLinksToContent(
          post.content,
          scanItem.pillar_page_suggestion,
          scanItem.related_post_suggestion,
          scanItem.faq_suggestion,
          externalCitations
        );

        // Create internal_links records
        const internalLinks = [];
        
        if (scanItem.pillar_page_suggestion) {
          // Pillar pages are static routes, not in internal_links table
        }
        
        if (scanItem.related_post_suggestion) {
          internalLinks.push({
            source_type: 'blog_post',
            source_id: post.id,
            target_type: 'blog_post',
            target_id: scanItem.related_post_suggestion.id,
            link_text: scanItem.related_post_suggestion.anchor_text,
            is_active: true,
          });
        }
        
        if (scanItem.faq_suggestion) {
          internalLinks.push({
            source_type: 'blog_post',
            source_id: post.id,
            target_type: 'faq',
            target_id: scanItem.faq_suggestion.id,
            link_text: scanItem.faq_suggestion.anchor_text,
            is_active: true,
          });
        }

        if (internalLinks.length > 0) {
          await supabase.from('internal_links').insert(internalLinks);
        }
      }

      processedCount++;
      await supabase
        .from('linking_scan_runs')
        .update({ processed_items: processedCount })
        .eq('id', scanRun.id);
    }

    // Process FAQs
    for (const faq of faqs) {
      const warnings: string[] = [];

      // Select external citations for FAQs
      const primarySources = (authoritySources || []).filter(s => s.trust_level === 'Primary');
      const selectedSources = primarySources.slice(0, Math.min(2, max_external_links));

      const externalCitations = selectedSources.map(source => ({
        source_id: source.id,
        source_name: source.name,
        domain: source.domain,
        anchor_text: `According to ${source.name}`,
        url: `https://${source.domain}`,
      }));

      const scanItem = {
        scan_run_id: scanRun.id,
        content_type: 'faq',
        content_id: faq.id,
        content_title: faq.question,
        status: 'completed',
        pillar_page_suggestion: null,
        related_post_suggestion: null,
        faq_suggestion: null,
        external_citations: externalCitations,
        internal_links_added: 0,
        external_links_added: externalCitations.length,
        warnings,
        applied: mode === 'auto_apply',
        applied_at: mode === 'auto_apply' ? new Date().toISOString() : null,
      };

      await supabase.from('linking_scan_items').insert(scanItem);

      processedCount++;
      await supabase
        .from('linking_scan_runs')
        .update({ processed_items: processedCount })
        .eq('id', scanRun.id);
    }

    // Mark scan as completed
    await supabase
      .from('linking_scan_runs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', scanRun.id);

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

async function applyLinksToContent(
  content: string,
  pillarSuggestion: any,
  relatedPost: any,
  faqSuggestion: any,
  externalCitations: any[]
): Promise<string> {
  // Simple link insertion at end of content as a "Related Resources" section
  // A more sophisticated implementation would use NLP to find natural insertion points
  
  let updatedContent = content;
  
  // Add a related resources section if it doesn't exist
  if (!content.includes('## Related Resources') && !content.includes('## Further Reading')) {
    const relatedSection = [
      '\n\n## Related Resources\n',
    ];
    
    if (pillarSuggestion) {
      relatedSection.push(`- [${pillarSuggestion.anchor_text}](${pillarSuggestion.url})`);
    }
    if (relatedPost) {
      relatedSection.push(`- [${relatedPost.anchor_text}](${relatedPost.url})`);
    }
    if (faqSuggestion) {
      relatedSection.push(`- [${faqSuggestion.anchor_text}](${faqSuggestion.url})`);
    }
    
    if (relatedSection.length > 1) {
      updatedContent += relatedSection.join('\n');
    }
  }
  
  return updatedContent;
}
