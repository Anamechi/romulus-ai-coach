import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QAPage {
  id: string;
  slug: string;
  question: string;
  answer: string;
  speakable_answer: string | null;
  status: string;
  featured: boolean;
  topic_id: string | null;
  author_id: string | null;
  reviewer_id: string | null;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export type QAPageInsert = Omit<QAPage, 'id' | 'created_at' | 'updated_at'>;

export function useQAPages() {
  return useQuery({
    queryKey: ['qa-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qa_pages')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QAPage[];
    },
  });
}

export function usePublishedQAPages() {
  return useQuery({
    queryKey: ['qa-pages', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qa_pages')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QAPage[];
    },
  });
}

export function useQAPage(slug: string) {
  return useQuery({
    queryKey: ['qa-pages', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qa_pages')
        .select(`
          *,
          topic:topics(id, name, slug),
          author:authors(id, full_name, credentials, photo_url),
          reviewer:reviewers(id, full_name, credentials, photo_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateQAPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (qaPage: Partial<QAPageInsert>) => {
      const { data, error } = await supabase
        .from('qa_pages')
        .insert(qaPage as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-pages'] });
      toast({ title: 'Q&A page created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating Q&A page', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateQAPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QAPage> & { id: string }) => {
      const { data, error } = await supabase
        .from('qa_pages')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-pages'] });
      toast({ title: 'Q&A page updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating Q&A page', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteQAPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('qa_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-pages'] });
      toast({ title: 'Q&A page deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting Q&A page', description: error.message, variant: 'destructive' });
    },
  });
}
