import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLinkedContent } from '@/hooks/useInternalLinks';
import { FileText, HelpCircle } from 'lucide-react';

interface LinkedContentProps {
  sourceType: 'blog_post' | 'faq';
  sourceId: string;
  title?: string;
}

export function LinkedContent({ sourceType, sourceId, title = "Related Content" }: LinkedContentProps) {
  const { data, isLoading } = useLinkedContent(sourceType, sourceId);

  if (isLoading || !data) return null;
  
  const { blogPosts, faqs } = data;
  
  if (blogPosts.length === 0 && faqs.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-3">
        {blogPosts.map((post: any) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{post.title}</h4>
                  {post.reading_time_minutes && (
                    <span className="text-sm text-muted-foreground">{post.reading_time_minutes} min read</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        {faqs.map((faq: any) => (
          <Link key={faq.id} to={`/faq/${faq.slug}`}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{faq.question}</h4>
                  <span className="text-sm text-muted-foreground">FAQ</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
