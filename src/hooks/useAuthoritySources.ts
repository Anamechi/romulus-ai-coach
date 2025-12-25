import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AuthoritySourceCategory = 
  | 'SEO_AEO'
  | 'AI_Automation'
  | 'Business_Leadership'
  | 'Data_Research'
  | 'Tech_Security'
  | 'Explainers';

export type TrustLevel = 'Primary' | 'Secondary';

export interface AuthoritySource {
  id: string;
  name: string;
  domain: string;
  category: AuthoritySourceCategory;
  trust_level: TrustLevel;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AuthoritySourceInsert = Omit<AuthoritySource, 'id' | 'created_at' | 'updated_at'>;

const CATEGORY_LABELS: Record<AuthoritySourceCategory, string> = {
  'SEO_AEO': 'SEO / AEO',
  'AI_Automation': 'AI / Automation',
  'Business_Leadership': 'Business / Leadership',
  'Data_Research': 'Data / Research',
  'Tech_Security': 'Tech / Security',
  'Explainers': 'Explainers',
};

export function getCategoryLabel(category: AuthoritySourceCategory): string {
  return CATEGORY_LABELS[category] || category;
}

export function useAuthoritySources(activeOnly = false) {
  return useQuery({
    queryKey: ['authority-sources', { activeOnly }],
    queryFn: async () => {
      let query = supabase
        .from('authority_sources')
        .select('*')
        .order('category')
        .order('name');
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AuthoritySource[];
    },
  });
}

export function useCreateAuthoritySource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (source: AuthoritySourceInsert) => {
      const { data, error } = await supabase
        .from('authority_sources')
        .insert(source)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authority-sources'] });
      toast({ title: 'Authority source created' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating source', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateAuthoritySource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AuthoritySource> & { id: string }) => {
      const { data, error } = await supabase
        .from('authority_sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authority-sources'] });
      toast({ title: 'Authority source updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating source', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteAuthoritySource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('authority_sources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authority-sources'] });
      toast({ title: 'Authority source deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting source', description: error.message, variant: 'destructive' });
    },
  });
}
