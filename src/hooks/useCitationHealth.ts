import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CitationHealthCheck {
  id: string;
  citation_id: string;
  status: 'pending' | 'healthy' | 'warning' | 'dead';
  http_status: number | null;
  response_time_ms: number | null;
  last_checked_at: string | null;
  error_message: string | null;
  redirect_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CitationWithHealth {
  id: string;
  url: string;
  title: string;
  source_name: string | null;
  health_check: CitationHealthCheck | null;
}

export function useCitationHealthChecks() {
  return useQuery({
    queryKey: ['citation-health-checks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citations')
        .select(`
          id,
          url,
          title,
          source_name,
          health_check:citation_health_checks(*)
        `)
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      
      return (data || []).map(citation => ({
        ...citation,
        health_check: Array.isArray(citation.health_check) 
          ? citation.health_check[0] || null 
          : citation.health_check,
      })) as CitationWithHealth[];
    },
  });
}

export function useRunHealthCheck() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (citationIds?: string[]) => {
      const { data, error } = await supabase.functions.invoke('check-citation-health', {
        body: { citation_ids: citationIds },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['citation-health-checks'] });
      toast({ 
        title: 'Health check completed', 
        description: `Checked ${data?.checked || 0} citations` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error running health check', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });
}

export function useCitationHealthStats() {
  return useQuery({
    queryKey: ['citation-health-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citation_health_checks')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        healthy: 0,
        warning: 0,
        dead: 0,
        pending: 0,
      };

      data?.forEach((check: any) => {
        if (check.status in stats) {
          stats[check.status as keyof typeof stats]++;
        }
      });

      return stats;
    },
  });
}
