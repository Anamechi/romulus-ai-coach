import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyIndexNow } from './useIndexNow';

export interface FAQ {
  id: string;
  slug: string;
  question: string;
  answer: string;
  speakable_answer: string | null;
  status: string;
  featured: boolean;
  author_id: string | null;
  reviewer_id: string | null;
  topic_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type FAQInsert = Omit<FAQ, 'id' | 'created_at' | 'updated_at'>;

export function useFaqs(publishedOnly = false) {
  return useQuery({
    queryKey: ['faqs', publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from('faqs')
        .select('*, author:authors(*), reviewer:reviewers(*), topic:topics(*)')
        .order('sort_order');
      
      if (publishedOnly) {
        query = query.eq('status', 'published');
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useFaqBySlug(slug: string) {
  return useQuery({
    queryKey: ['faq', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*, author:authors(*), reviewer:reviewers(*), topic:topics(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (faq: FAQInsert) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ created successfully');
      
      if (data.status === 'published' && data.slug) {
        notifyIndexNow('faq', data.slug);
      }
    },
    onError: (error) => {
      toast.error('Failed to create FAQ: ' + error.message);
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FAQ> & { id: string }) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ updated successfully');
      
      if (data.status === 'published' && data.slug) {
        notifyIndexNow('faq', data.slug);
      }
    },
    onError: (error) => {
      toast.error('Failed to update FAQ: ' + error.message);
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete FAQ: ' + error.message);
    },
  });
}
