import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentTranslation {
  id: string;
  source_id: string;
  source_type: string;
  language: string;
  group_id: string | null;
  title: string | null;
  slug: string;
  content: string | null;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  speakable_summary: string | null;
  faqs: any;
  hreflang_tag: string | null;
  canonical_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useTranslations(language?: string) {
  return useQuery({
    queryKey: ['translations', language],
    queryFn: async () => {
      let query = supabase
        .from('content_translations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ContentTranslation[];
    },
  });
}

export function useTranslateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sourceId, sourceType, targetLanguage }: {
      sourceId: string;
      sourceType: string;
      targetLanguage: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: { sourceId, sourceType, targetLanguage },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    },
    onError: (error) => {
      toast.error('Translation failed: ' + error.message);
    },
  });
}
