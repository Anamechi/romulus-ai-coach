import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBlogPosts } from './useBlogPosts';
import { useFaqs } from './useFaqs';
import { useQAPages } from './useQAPages';
import { useInternalLinks } from './useInternalLinks';

export interface ContentLinkStats {
  id: string;
  title: string;
  type: 'blog_post' | 'faq' | 'qa_page';
  slug: string;
  incomingLinks: number;
  outgoingLinks: number;
  isOrphan: boolean;
  belowThreshold: boolean;
}

export interface LinkHealthReport {
  totalContent: number;
  orphanedContent: number;
  belowThreshold: number;
  averageLinks: number;
  healthScore: number;
}

export function useLinkGovernance(minLinks: number = 1) {
  const { data: blogPosts } = useBlogPosts();
  const { data: faqs } = useFaqs();
  const { data: qaPages } = useQAPages();
  const { data: links } = useInternalLinks();

  return useQuery({
    queryKey: ['link-governance', minLinks, blogPosts?.length, faqs?.length, qaPages?.length, links?.length],
    queryFn: async () => {
      const contentStats: ContentLinkStats[] = [];

      // Count links for blog posts
      blogPosts?.forEach((post: any) => {
        const incoming = links?.filter(
          (l) => l.target_type === 'blog_post' && l.target_id === post.id && l.is_active
        ).length || 0;
        const outgoing = links?.filter(
          (l) => l.source_type === 'blog_post' && l.source_id === post.id && l.is_active
        ).length || 0;

        contentStats.push({
          id: post.id,
          title: post.title,
          type: 'blog_post',
          slug: post.slug,
          incomingLinks: incoming,
          outgoingLinks: outgoing,
          isOrphan: incoming === 0,
          belowThreshold: incoming < minLinks,
        });
      });

      // Count links for FAQs
      faqs?.forEach((faq: any) => {
        const incoming = links?.filter(
          (l) => l.target_type === 'faq' && l.target_id === faq.id && l.is_active
        ).length || 0;
        const outgoing = links?.filter(
          (l) => l.source_type === 'faq' && l.source_id === faq.id && l.is_active
        ).length || 0;

        contentStats.push({
          id: faq.id,
          title: faq.question,
          type: 'faq',
          slug: faq.slug,
          incomingLinks: incoming,
          outgoingLinks: outgoing,
          isOrphan: incoming === 0,
          belowThreshold: incoming < minLinks,
        });
      });

      // Q&A pages (no internal link support yet, but track for completeness)
      qaPages?.forEach((qa: any) => {
        contentStats.push({
          id: qa.id,
          title: qa.question,
          type: 'qa_page',
          slug: qa.slug,
          incomingLinks: 0,
          outgoingLinks: 0,
          isOrphan: true,
          belowThreshold: true,
        });
      });

      // Calculate report
      const totalContent = contentStats.length;
      const orphanedContent = contentStats.filter((c) => c.isOrphan).length;
      const belowThreshold = contentStats.filter((c) => c.belowThreshold).length;
      const totalLinks = contentStats.reduce((sum, c) => sum + c.incomingLinks, 0);
      const averageLinks = totalContent > 0 ? totalLinks / totalContent : 0;

      // Health score: 100 - (orphan% * 0.6 + belowThreshold% * 0.4)
      const orphanPercent = totalContent > 0 ? (orphanedContent / totalContent) * 100 : 0;
      const belowPercent = totalContent > 0 ? (belowThreshold / totalContent) * 100 : 0;
      const healthScore = Math.max(0, Math.round(100 - (orphanPercent * 0.6 + belowPercent * 0.4)));

      const report: LinkHealthReport = {
        totalContent,
        orphanedContent,
        belowThreshold,
        averageLinks: Math.round(averageLinks * 10) / 10,
        healthScore,
      };

      return {
        contentStats,
        report,
        orphaned: contentStats.filter((c) => c.isOrphan),
        belowThresholdItems: contentStats.filter((c) => c.belowThreshold && !c.isOrphan),
      };
    },
    enabled: !!(blogPosts && faqs && qaPages && links),
  });
}

export function useOrphanedContent() {
  const { data } = useLinkGovernance();
  return data?.orphaned || [];
}

export function useLinkHealthReport() {
  const { data } = useLinkGovernance();
  return data?.report || null;
}
