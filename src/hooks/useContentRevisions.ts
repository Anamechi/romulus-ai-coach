import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentRevision {
  id: string;
  entity_type: string;
  entity_id: string;
  revision_number: number;
  content_snapshot: Record<string, any>;
  created_by: string | null;
  created_at: string;
  change_summary: string | null;
}

export function useContentRevisions(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['content-revisions', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_revisions')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('revision_number', { ascending: false });

      if (error) throw error;
      return data as ContentRevision[];
    },
    enabled: !!entityType && !!entityId,
  });
}

export function useSaveRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      entity_type: string;
      entity_id: string;
      content_snapshot: Record<string, any>;
      change_summary?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      // Get the next revision number
      const { data: existingRevisions } = await supabase
        .from('content_revisions')
        .select('revision_number')
        .eq('entity_type', params.entity_type)
        .eq('entity_id', params.entity_id)
        .order('revision_number', { ascending: false })
        .limit(1);

      const nextRevisionNumber = existingRevisions && existingRevisions.length > 0
        ? (existingRevisions[0] as any).revision_number + 1
        : 1;

      const { error } = await supabase
        .from('content_revisions')
        .insert({
          entity_type: params.entity_type,
          entity_id: params.entity_id,
          revision_number: nextRevisionNumber,
          content_snapshot: params.content_snapshot,
          created_by: user?.id,
          change_summary: params.change_summary,
        } as any);

      if (error) throw error;
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ 
        queryKey: ['content-revisions', params.entity_type, params.entity_id] 
      });
    },
  });
}

export function useRestoreRevision() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      revision: ContentRevision;
      onRestore: (snapshot: Record<string, any>) => Promise<void>;
    }) => {
      await params.onRestore(params.revision.content_snapshot);
    },
    onSuccess: () => {
      toast({ title: 'Revision restored successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error restoring revision', description: error.message, variant: 'destructive' });
    },
  });
}
