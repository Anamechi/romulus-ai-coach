import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ScanMode = 'report_only' | 'auto_apply';

export interface LinkingScanRun {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: ScanStatus;
  mode: ScanMode;
  content_types: string[];
  topic_filter: string | null;
  max_external_links: number;
  total_items: number;
  processed_items: number;
  error_message: string | null;
  run_by: string | null;
  created_at: string;
}

export interface LinkSuggestion {
  id: string;
  title: string;
  slug: string;
  anchor_text: string;
  url: string;
}

export interface ExternalCitation {
  source_id: string;
  source_name: string;
  domain: string;
  anchor_text: string;
  url: string;
}

export interface LinkingScanItem {
  id: string;
  scan_run_id: string;
  content_type: string;
  content_id: string;
  content_title: string | null;
  status: ScanStatus;
  pillar_page_suggestion: LinkSuggestion | null;
  related_post_suggestion: LinkSuggestion | null;
  faq_suggestion: LinkSuggestion | null;
  external_citations: ExternalCitation[];
  links_before: number;
  links_after: number;
  internal_links_added: number;
  external_links_added: number;
  warnings: string[];
  applied: boolean;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useLinkingScanRuns() {
  return useQuery({
    queryKey: ['linking-scan-runs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('linking_scan_runs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LinkingScanRun[];
    },
  });
}

export function useLinkingScanItems(scanRunId: string | null) {
  return useQuery({
    queryKey: ['linking-scan-items', scanRunId],
    queryFn: async () => {
      if (!scanRunId) return [];
      
      const { data, error } = await supabase
        .from('linking_scan_items')
        .select('*')
        .eq('scan_run_id', scanRunId)
        .order('content_title');
      
      if (error) throw error;
      
      // Map the data to properly type the JSONB fields
      return (data || []).map((item) => ({
        ...item,
        pillar_page_suggestion: item.pillar_page_suggestion as unknown as LinkSuggestion | null,
        related_post_suggestion: item.related_post_suggestion as unknown as LinkSuggestion | null,
        faq_suggestion: item.faq_suggestion as unknown as LinkSuggestion | null,
        external_citations: (item.external_citations || []) as unknown as ExternalCitation[],
        warnings: (item.warnings || []) as unknown as string[],
      })) as LinkingScanItem[];
    },
    enabled: !!scanRunId,
  });
}

export function useStartLinkingScan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (params: {
      mode: ScanMode;
      content_types: string[];
      topic_filter?: string;
      max_external_links: number;
    }) => {
      const { data, error } = await supabase.functions.invoke('scan-content-links', {
        body: params,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linking-scan-runs'] });
      toast({ title: 'Scan started successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error starting scan', description: error.message, variant: 'destructive' });
    },
  });
}

export function useApplyLinkSuggestions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const { data, error } = await supabase.functions.invoke('apply-link-suggestions', {
        body: { item_ids: itemIds },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linking-scan-items'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast({ title: 'Link suggestions applied' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error applying suggestions', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteScanRun() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('linking_scan_runs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linking-scan-runs'] });
      toast({ title: 'Scan run deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting scan', description: error.message, variant: 'destructive' });
    },
  });
}
