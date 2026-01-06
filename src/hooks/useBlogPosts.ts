import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyIndexNow } from './useIndexNow';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  reviewer_id: string | null;
  topic_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured: boolean;
  reading_time_minutes: number | null;
  speakable_summary: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;

export function useBlogPosts(publishedOnly = false, authCacheKey?: string | null) {
  return useQuery({
    queryKey: ['blog_posts', publishedOnly, authCacheKey ?? null],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*, author:authors(*), reviewer:reviewers(*), topic:topics(*)')
        .order('created_at', { ascending: false });
      
      if (publishedOnly) {
        query = query.eq('published', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog_post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, author:authors(*), reviewer:reviewers(*), topic:topics(*)')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: BlogPostInsert) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Article created successfully');
      
      if (data.published && data.slug) {
        notifyIndexNow('blog', data.slug);
      }
    },
    onError: (error) => {
      toast.error('Failed to create article: ' + error.message);
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Article updated successfully');
      
      if (data.published && data.slug) {
        notifyIndexNow('blog', data.slug);
      }
    },
    onError: (error) => {
      toast.error('Failed to update article: ' + error.message);
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast.success('Article deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete article: ' + error.message);
    },
  });
}
