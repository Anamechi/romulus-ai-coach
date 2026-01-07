import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface ContentSettings {
  id: string;
  master_content_prompt: string;
  site_name: string | null;
  tagline: string | null;
  feature_flags: Json | null;
  min_word_count: number | null;
  min_internal_links: number | null;
  created_at: string;
  updated_at: string;
}

export function useContentSettings() {
  return useQuery({
    queryKey: ['content-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ContentSettings | null;
    },
  });
}

export function useUpdateContentSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<ContentSettings>) => {
      const { data: existing } = await supabase
        .from('content_settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('content_settings')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('content_settings')
          .insert(updates)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    },
  });
}
