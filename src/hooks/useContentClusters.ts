import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentCluster {
  id: string;
  cluster_topic: string;
  target_audience: string;
  primary_keyword: string;
  language: string;
  status: 'pending' | 'generating' | 'review' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  items?: ClusterItem[];
}

export interface ClusterItem {
  id: string;
  cluster_id: string;
  funnel_stage: 'TOFU' | 'MOFU' | 'BOFU';
  content_type: 'guide' | 'explainer' | 'comparison' | 'decision';
  title: string;
  slug: string;
  content: string;
  speakable_answer: string;
  meta_title: string;
  meta_description: string;
  faqs: { question: string; answer: string }[];
  internal_links: { title: string; url: string }[];
  external_citations: { title: string; url: string; source: string }[];
  status: 'draft' | 'approved' | 'discarded' | 'published';
  published_content_type?: string;
  published_content_id?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ClusterInput {
  cluster_topic: string;
  target_audience: string;
  primary_keyword: string;
  language: string;
  topic_id?: string | null;
}

export function useContentClusters() {
  return useQuery({
    queryKey: ['content-clusters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_clusters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContentCluster[];
    },
  });
}

export function useContentCluster(id: string) {
  return useQuery({
    queryKey: ['content-cluster', id],
    queryFn: async () => {
      const { data: cluster, error: clusterError } = await supabase
        .from('content_clusters')
        .select('*')
        .eq('id', id)
        .single();

      if (clusterError) throw clusterError;

      const { data: items, error: itemsError } = await supabase
        .from('cluster_items')
        .select('*')
        .eq('cluster_id', id)
        .order('sort_order');

      if (itemsError) throw itemsError;

      return {
        ...cluster,
        items: items.map((item: any) => ({
          ...item,
          faqs: item.faqs || [],
          internal_links: item.internal_links || [],
          external_citations: item.external_citations || [],
        })),
      } as ContentCluster;
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data as ContentCluster | undefined;
      // Poll every 3 seconds while generating
      return data?.status === 'generating' ? 3000 : false;
    },
  });
}

export function useCreateCluster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ClusterInput) => {
      // Create cluster record
      const { data: cluster, error: clusterError } = await supabase
        .from('content_clusters')
        .insert({
          cluster_topic: input.cluster_topic,
          target_audience: input.target_audience,
          primary_keyword: input.primary_keyword,
          language: input.language,
          topic_id: input.topic_id || null,
          status: 'pending',
        })
        .select()
        .single();

      if (clusterError) throw clusterError;

      // Trigger edge function for generation
      const { error: fnError } = await supabase.functions.invoke('generate-content-cluster', {
        body: {
          clusterId: cluster.id,
          clusterTopic: input.cluster_topic,
          targetAudience: input.target_audience,
          primaryKeyword: input.primary_keyword,
          language: input.language,
        },
      });

      if (fnError) {
        // Update cluster status to failed
        await supabase
          .from('content_clusters')
          .update({ status: 'failed', error_message: fnError.message })
          .eq('id', cluster.id);
        throw fnError;
      }

      return cluster;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-clusters'] });
      toast.success('Content cluster generation started');
    },
    onError: (error) => {
      toast.error(`Failed to create cluster: ${error.message}`);
    },
  });
}

export function useUpdateClusterItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ClusterItem> }) => {
      const { data, error } = await supabase
        .from('cluster_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content-cluster', data.cluster_id] });
      toast.success('Item updated');
    },
    onError: (error) => {
      toast.error(`Failed to update item: ${error.message}`);
    },
  });
}

export function useApproveClusterItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('cluster_items')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content-cluster', data.cluster_id] });
      toast.success('Item approved');
    },
  });
}

export function useDiscardClusterItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('cluster_items')
        .update({ status: 'discarded' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content-cluster', data.cluster_id] });
      toast.success('Item discarded');
    },
  });
}

export function useDeleteCluster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clusterId: string) => {
      // Delete cluster items first
      const { error: itemsError } = await supabase
        .from('cluster_items')
        .delete()
        .eq('cluster_id', clusterId);

      if (itemsError) throw itemsError;

      // Then delete the cluster
      const { error: clusterError } = await supabase
        .from('content_clusters')
        .delete()
        .eq('id', clusterId);

      if (clusterError) throw clusterError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-clusters'] });
      toast.success('Cluster deleted');
    },
    onError: (error) => {
      toast.error(`Failed to delete cluster: ${error.message}`);
    },
  });
}

export function usePublishClusterItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clusterId, contentType }: { clusterId: string; contentType: 'blog' | 'qa_page' }) => {
      // Get cluster to access topic_id
      const { data: cluster, error: clusterError } = await supabase
        .from('content_clusters')
        .select('topic_id')
        .eq('id', clusterId)
        .single();

      if (clusterError) throw clusterError;

      // Get approved items
      const { data: items, error: fetchError } = await supabase
        .from('cluster_items')
        .select('*')
        .eq('cluster_id', clusterId)
        .eq('status', 'approved');

      if (fetchError) throw fetchError;
      if (!items?.length) throw new Error('No approved items to publish');

      const publishedItems = [];

      for (const item of items) {
        if (contentType === 'blog') {
          // Create blog post with topic_id from cluster
          const { data: blogPost, error: blogError } = await supabase
            .from('blog_posts')
            .insert({
              title: item.title,
              slug: item.slug,
              content: item.content,
              excerpt: item.speakable_answer,
              meta_title: item.meta_title,
              meta_description: item.meta_description,
              speakable_summary: item.speakable_answer,
              topic_id: cluster?.topic_id || null,
              published: false,
            })
            .select()
            .single();

          if (blogError) throw blogError;

          // Update cluster item
          await supabase
            .from('cluster_items')
            .update({
              status: 'published',
              published_content_type: 'blog',
              published_content_id: blogPost.id,
            })
            .eq('id', item.id);

          publishedItems.push(blogPost);
        } else if (contentType === 'qa_page') {
          // Create Q&A page with topic_id from cluster
          const { data: qaPage, error: qaError } = await supabase
            .from('qa_pages')
            .insert({
              question: item.title,
              slug: item.slug,
              answer: item.content,
              meta_title: item.meta_title,
              meta_description: item.meta_description,
              speakable_answer: item.speakable_answer,
              topic_id: cluster?.topic_id || null,
              status: 'draft',
            })
            .select()
            .single();

          if (qaError) throw qaError;

          // Update cluster item
          await supabase
            .from('cluster_items')
            .update({
              status: 'published',
              published_content_type: 'qa_page',
              published_content_id: qaPage.id,
            })
            .eq('id', item.id);

          publishedItems.push(qaPage);
        }
      }

      // Update cluster status to completed
      await supabase
        .from('content_clusters')
        .update({ status: 'completed' })
        .eq('id', clusterId);

      return publishedItems;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content-cluster', variables.clusterId] });
      queryClient.invalidateQueries({ queryKey: ['content-clusters'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['qa-pages'] });
      toast.success(`Published ${data.length} items as ${variables.contentType === 'blog' ? 'blog posts' : 'Q&A pages'}`);
    },
    onError: (error) => {
      toast.error(`Failed to publish: ${error.message}`);
    },
  });
}
