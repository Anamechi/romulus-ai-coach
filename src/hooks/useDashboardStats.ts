import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  blogPosts: { total: number; published: number };
  faqs: { total: number; published: number };
  qaPages: { total: number; published: number };
  leads: { total: number; new: number };
  applications: { total: number; pending: number };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [blogPostsRes, faqsRes, qaPagesRes, leadsRes, applicationsRes] = await Promise.all([
        supabase.from('blog_posts').select('id, published', { count: 'exact' }),
        supabase.from('faqs').select('id, status', { count: 'exact' }),
        supabase.from('qa_pages').select('id, status', { count: 'exact' }),
        supabase.from('leads').select('id, status', { count: 'exact' }),
        supabase.from('applications').select('id, status', { count: 'exact' }),
      ]);

      const blogPosts = blogPostsRes.data || [];
      const faqs = faqsRes.data || [];
      const qaPages = qaPagesRes.data || [];
      const leads = leadsRes.data || [];
      const applications = applicationsRes.data || [];

      return {
        blogPosts: {
          total: blogPosts.length,
          published: blogPosts.filter(p => p.published).length,
        },
        faqs: {
          total: faqs.length,
          published: faqs.filter(f => f.status === 'published').length,
        },
        qaPages: {
          total: qaPages.length,
          published: qaPages.filter(q => q.status === 'published').length,
        },
        leads: {
          total: leads.length,
          new: leads.filter(l => l.status === 'new').length,
        },
        applications: {
          total: applications.length,
          pending: applications.filter(a => a.status === 'pending').length,
        },
      };
    },
  });
}
