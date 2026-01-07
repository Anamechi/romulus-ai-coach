import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyIndexNow } from './useIndexNow';

export type FunnelStage = 'TOFU' | 'MOFU' | 'BOFU';

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  funnel_stage: FunnelStage;
  speakable_summary: string | null;
  parent_topic_id: string | null;
  sort_order: number;
  is_active: boolean;
  default_target_audience: string | null;
  default_primary_keyword: string | null;
  created_at: string;
  updated_at: string;
}

export type TopicInsert = Omit<Topic, 'id' | 'created_at' | 'updated_at'>;

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('sort_order')
        .order('name');
      
      if (error) throw error;
      return data as Topic[];
    },
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (topic: TopicInsert) => {
      const { data, error } = await supabase
        .from('topics')
        .insert(topic)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic created successfully');
      
      if (data.is_active && data.slug) {
        notifyIndexNow('topic', data.slug);
      }
    },
    onError: (error) => {
      toast.error('Failed to create topic: ' + error.message);
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Topic> & { id: string }) => {
      const { data, error } = await supabase
        .from('topics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic updated successfully');
      
      if (data.is_active && data.slug) {
        notifyIndexNow('topic', data.slug);
      }
    },
    onError: (error) => {
      toast.error('Failed to update topic: ' + error.message);
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Topic deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete topic: ' + error.message);
    },
  });
}
