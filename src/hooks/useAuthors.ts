import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Author {
  id: string;
  full_name: string;
  credentials: string | null;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  years_experience: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AuthorInsert = Omit<Author, 'id' | 'created_at' | 'updated_at'>;

export function useAuthors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data as Author[];
    },
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (author: AuthorInsert) => {
      const { data, error } = await supabase
        .from('authors')
        .insert(author)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast.success('Author created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create author: ' + error.message);
    },
  });
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Author> & { id: string }) => {
      const { data, error } = await supabase
        .from('authors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast.success('Author updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update author: ' + error.message);
    },
  });
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast.success('Author deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete author: ' + error.message);
    },
  });
}
