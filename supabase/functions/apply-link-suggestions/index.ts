import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { item_ids } = await req.json();

    console.log('Applying link suggestions for items:', item_ids);

    const { data: items, error: fetchError } = await supabase
      .from('linking_scan_items')
      .select('*')
      .in('id', item_ids);

    if (fetchError) throw fetchError;

    let appliedCount = 0;

    for (const item of items || []) {
      if (item.applied) continue;

      const internalLinks = [];
      const sourceType = item.content_type; // 'blog_post', 'qa_page', or 'faq'

      if (item.related_post_suggestion) {
        const suggestion = item.related_post_suggestion as any;
        internalLinks.push({
          source_type: sourceType,
          source_id: item.content_id,
          target_type: 'blog_post',
          target_id: suggestion.id,
          link_text: suggestion.anchor_text,
          is_active: true,
        });
      }

      if (item.faq_suggestion) {
        const suggestion = item.faq_suggestion as any;
        internalLinks.push({
          source_type: sourceType,
          source_id: item.content_id,
          target_type: 'faq',
          target_id: suggestion.id,
          link_text: suggestion.anchor_text,
          is_active: true,
        });
      }

      if (item.pillar_page_suggestion) {
        const suggestion = item.pillar_page_suggestion as any;
        // Only create internal_links record if target is a real content ID (not static pages)
        if (suggestion.id && suggestion.target_type) {
          internalLinks.push({
            source_type: sourceType,
            source_id: item.content_id,
            target_type: suggestion.target_type,
            target_id: suggestion.id,
            link_text: suggestion.anchor_text,
            is_active: true,
          });
        }
      }

      // Insert internal links (skip duplicates)
      for (const link of internalLinks) {
        const { data: existing } = await supabase
          .from('internal_links')
          .select('id')
          .eq('source_type', link.source_type)
          .eq('source_id', link.source_id)
          .eq('target_type', link.target_type)
          .eq('target_id', link.target_id)
          .single();

        if (!existing) {
          await supabase.from('internal_links').insert(link);
        }
      }

      // Mark item as applied
      await supabase
        .from('linking_scan_items')
        .update({
          applied: true,
          applied_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      appliedCount++;
    }

    console.log('Applied suggestions for', appliedCount, 'items');

    return new Response(
      JSON.stringify({ success: true, applied_count: appliedCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Apply error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
