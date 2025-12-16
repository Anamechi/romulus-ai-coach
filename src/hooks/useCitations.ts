import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Citation {
  id: string;
  url: string;
  title: string;
  source_name: string | null;
  author_name: string | null;
  published_date: string | null;
  domain_authority: number | null;
  excerpt: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export type CitationInsert = Omit<Citation, 'id' | 'created_at' | 'updated_at'>;

export function useCitations(activeOnly = false) {
  return useQuery({
    queryKey: ['citations', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('citations')
        .select('*')
        .order('domain_authority', { ascending: false, nullsFirst: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Citation[];
    },
  });
}

export function useCitationById(id: string) {
  return useQuery({
    queryKey: ['citations', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Citation | null;
    },
    enabled: !!id,
  });
}

export function useCreateCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (citation: CitationInsert) => {
      const { data, error } = await supabase
        .from('citations')
        .insert(citation)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citations'] });
      toast({ title: 'Citation created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to create citation', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Citation> & { id: string }) => {
      const { data, error } = await supabase
        .from('citations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citations'] });
      toast({ title: 'Citation updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update citation', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('citations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citations'] });
      toast({ title: 'Citation deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete citation', description: error.message, variant: 'destructive' });
    },
  });
}

// Blog post citations
export function useBlogPostCitations(blogPostId: string) {
  return useQuery({
    queryKey: ['blog-post-citations', blogPostId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_post_citations')
        .select('*, citation:citations(*)')
        .eq('blog_post_id', blogPostId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!blogPostId,
  });
}

export function useAddBlogPostCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ blogPostId, citationId, sortOrder = 0 }: { blogPostId: string; citationId: string; sortOrder?: number }) => {
      const { data, error } = await supabase
        .from('blog_post_citations')
        .insert({ blog_post_id: blogPostId, citation_id: citationId, sort_order: sortOrder })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog-post-citations', variables.blogPostId] });
      toast({ title: 'Citation added to blog post' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add citation', description: error.message, variant: 'destructive' });
    },
  });
}

export function useRemoveBlogPostCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ blogPostId, citationId }: { blogPostId: string; citationId: string }) => {
      const { error } = await supabase
        .from('blog_post_citations')
        .delete()
        .eq('blog_post_id', blogPostId)
        .eq('citation_id', citationId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog-post-citations', variables.blogPostId] });
      toast({ title: 'Citation removed from blog post' });
    },
    onError: (error) => {
      toast({ title: 'Failed to remove citation', description: error.message, variant: 'destructive' });
    },
  });
}

// FAQ citations
export function useFaqCitations(faqId: string) {
  return useQuery({
    queryKey: ['faq-citations', faqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq_citations')
        .select('*, citation:citations(*)')
        .eq('faq_id', faqId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!faqId,
  });
}

export function useAddFaqCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ faqId, citationId, sortOrder = 0 }: { faqId: string; citationId: string; sortOrder?: number }) => {
      const { data, error } = await supabase
        .from('faq_citations')
        .insert({ faq_id: faqId, citation_id: citationId, sort_order: sortOrder })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faq-citations', variables.faqId] });
      toast({ title: 'Citation added to FAQ' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add citation', description: error.message, variant: 'destructive' });
    },
  });
}

export function useRemoveFaqCitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ faqId, citationId }: { faqId: string; citationId: string }) => {
      const { error } = await supabase
        .from('faq_citations')
        .delete()
        .eq('faq_id', faqId)
        .eq('citation_id', citationId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faq-citations', variables.faqId] });
      toast({ title: 'Citation removed from FAQ' });
    },
    onError: (error) => {
      toast({ title: 'Failed to remove citation', description: error.message, variant: 'destructive' });
    },
  });
}
