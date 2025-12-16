import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InternalLink {
  id: string;
  source_type: 'blog_post' | 'faq';
  source_id: string;
  target_type: 'blog_post' | 'faq';
  target_id: string;
  link_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InternalLinkInsert = Omit<InternalLink, 'id' | 'created_at' | 'updated_at'>;

// Fetch all internal links
export function useInternalLinks() {
  return useQuery({
    queryKey: ['internal-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internal_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as InternalLink[];
    },
  });
}

// Fetch links for a specific source
export function useSourceLinks(sourceType: 'blog_post' | 'faq', sourceId: string) {
  return useQuery({
    queryKey: ['internal-links', 'source', sourceType, sourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internal_links')
        .select('*')
        .eq('source_type', sourceType)
        .eq('source_id', sourceId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as InternalLink[];
    },
    enabled: !!sourceId,
  });
}

// Fetch linked content with details
export function useLinkedContent(sourceType: 'blog_post' | 'faq', sourceId: string) {
  return useQuery({
    queryKey: ['linked-content', sourceType, sourceId],
    queryFn: async () => {
      // Get links for this source
      const { data: links, error: linksError } = await supabase
        .from('internal_links')
        .select('*')
        .eq('source_type', sourceType)
        .eq('source_id', sourceId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (linksError) throw linksError;
      if (!links || links.length === 0) return { blogPosts: [], faqs: [] };

      // Separate by target type
      const blogPostIds = links.filter(l => l.target_type === 'blog_post').map(l => l.target_id);
      const faqIds = links.filter(l => l.target_type === 'faq').map(l => l.target_id);

      // Fetch blog posts
      let blogPosts: any[] = [];
      if (blogPostIds.length > 0) {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, cover_image_url, reading_time_minutes')
          .in('id', blogPostIds)
          .eq('published', true);
        if (!error && data) blogPosts = data;
      }

      // Fetch FAQs
      let faqs: any[] = [];
      if (faqIds.length > 0) {
        const { data, error } = await supabase
          .from('faqs')
          .select('id, question, slug')
          .in('id', faqIds)
          .eq('status', 'published');
        if (!error && data) faqs = data;
      }

      return { blogPosts, faqs, links };
    },
    enabled: !!sourceId,
  });
}

// Create internal link
export function useCreateInternalLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (link: InternalLinkInsert) => {
      const { data, error } = await supabase
        .from('internal_links')
        .insert(link)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-links'] });
      queryClient.invalidateQueries({ queryKey: ['linked-content'] });
    },
  });
}

// Update internal link
export function useUpdateInternalLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InternalLink> & { id: string }) => {
      const { data, error } = await supabase
        .from('internal_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-links'] });
      queryClient.invalidateQueries({ queryKey: ['linked-content'] });
    },
  });
}

// Delete internal link
export function useDeleteInternalLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('internal_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-links'] });
      queryClient.invalidateQueries({ queryKey: ['linked-content'] });
    },
  });
}
