import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Reviewer {
  id: string;
  full_name: string;
  credentials: string | null;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ReviewerInsert = Omit<Reviewer, 'id' | 'created_at' | 'updated_at'>;

export function useReviewers() {
  return useQuery({
    queryKey: ['reviewers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviewers')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data as Reviewer[];
    },
  });
}

export function useCreateReviewer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewer: ReviewerInsert) => {
      const { data, error } = await supabase
        .from('reviewers')
        .insert(reviewer)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewers'] });
      toast.success('Reviewer created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create reviewer: ' + error.message);
    },
  });
}

export function useUpdateReviewer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reviewer> & { id: string }) => {
      const { data, error } = await supabase
        .from('reviewers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewers'] });
      toast.success('Reviewer updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update reviewer: ' + error.message);
    },
  });
}

export function useDeleteReviewer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviewers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewers'] });
      toast.success('Reviewer deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete reviewer: ' + error.message);
    },
  });
}
