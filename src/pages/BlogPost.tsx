import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Calendar, User } from 'lucide-react';
import { useBlogPostBySlug, useBlogPosts } from '@/hooks/useBlogPosts';
import { LinkedContent } from '@/components/content/LinkedContent';
import { AuthorCard } from '@/components/content/AuthorCard';
import { format } from 'date-fns';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug || '');
  const { data: allPosts } = useBlogPosts(true);

  const markdownComponents: Components = useMemo(() => {
    const components: Components = {
      p: ({ children }) => {
        // Many of the generated articles use "**Section Title**" on its own line.
        // Render that pattern as a heading for consistent spacing on mobile (no :has() dependency).
        const childArray = Array.isArray(children) ? children : [children];
        const only = childArray.length === 1 ? childArray[0] : null;

        // If the paragraph is only a single strong element, promote it to an H2.
        if (
          only &&
          typeof only === 'object' &&
          (only as any)?.type === 'strong' &&
          Array.isArray((only as any)?.props?.children)
        ) {
          const strongText = (only as any).props.children
            .filter((c: any) => typeof c === 'string')
            .join('')
            .trim();

          if (strongText.length > 0) {
            return (
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-10 mb-4">
                {(only as any).props.children}
              </h2>
            );
          }
        }

        return <p className="text-foreground leading-[1.8] mb-6">{children}</p>;
      },
      h2: ({ children }) => (
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
      ),
      ul: ({ children }) => <ul className="my-6 pl-6 space-y-2 text-foreground">{children}</ul>,
      ol: ({ children }) => <ol className="my-6 pl-6 space-y-2 text-foreground">{children}</ol>,
      li: ({ children }) => <li className="leading-relaxed mb-1 text-foreground">{children}</li>,
      blockquote: ({ children }) => (
        <blockquote className="my-8 border-l-2 border-primary/50 pl-4 italic text-muted-foreground">{children}</blockquote>
      ),
      a: ({ href, children }) => (
        <a href={href} className="text-primary underline underline-offset-2 hover:text-primary/80">
          {children}
        </a>
      ),
      hr: () => <hr className="my-10 border-border" />,
      img: ({ alt, ...props }) => (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img {...props} alt={alt || ''} loading="lazy" className="my-8 rounded-xl" />
      ),
    };

    return components;
  }, []);

  const normalizeMarkdownSpacing = (raw: string) => {
    const content = (raw || '').replace(/\r\n/g, '\n');
    const lines = content.split('\n');

    const isSpecialLine = (line: string) => {
      const t = line.trim();
      return (
        t.startsWith('#') ||
        t.startsWith('>') ||
        /^[-*+]\s+/.test(t) ||
        /^\d+\.\s+/.test(t) ||
        t.startsWith('```')
      );
    };

    // If content already has paragraph breaks, don't over-process it.
    const hasParagraphBreaks = content.includes('\n\n');
    if (hasParagraphBreaks) return content;

    const out: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? '';
      const next = lines[i + 1] ?? '';
      out.push(line);

      if (line.trim() === '' || next.trim() === '') continue;
      if (isSpecialLine(line) || isSpecialLine(next)) continue;

      // Force an empty line so Markdown renders separate paragraphs on mobile.
      out.push('');
    }

    return out.join('\n');
  };

  const markdownContent = useMemo(() => normalizeMarkdownSpacing(post?.content || ''), [post?.content]);

  // Get related posts from same topic
  const relatedPosts = allPosts?.filter((p: any) => 
    p.topic_id === post?.topic_id && p.id !== post?.id
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const authorData = post.author ? {
    name: (post.author as any).full_name,
    credentials: (post.author as any).credentials,
    bio: (post.author as any).bio
  } : undefined;

  return (
    <Layout>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
        canonicalUrl={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.cover_image_url || undefined}
        ogImageAlt={post.title}
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
        author={authorData?.name}
      />
      <ArticleSchema
        title={post.title}
        description={post.meta_description || post.excerpt || ''}
        slug={post.slug}
        imageUrl={post.cover_image_url || undefined}
        publishedAt={post.published_at || undefined}
        updatedAt={post.updated_at}
        author={authorData}
        speakableSummary={post.speakable_summary || undefined}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` }
      ]} />

      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to all articles
            </Link>

            {/* Header */}
            <header className="mb-8">
              {post.topic && (
                <Badge variant="secondary" className="mb-4">
                  {(post.topic as any).name}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                {post.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{(post.author as any).full_name}</span>
                  </div>
                )}
                {post.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                  </div>
                )}
                {post.reading_time_minutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time_minutes} min read</span>
                  </div>
                )}
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image_url && (
              <OptimizedImage 
                src={post.cover_image_url} 
                alt={post.title}
                containerClassName="aspect-video rounded-2xl mb-8"
                className="w-full h-full"
                priority
              />
            )}

            {/* Speakable Summary (for voice assistants) */}
            {post.speakable_summary && (
              <div className="speakable-content sr-only">
                {post.speakable_summary}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {markdownContent}
              </ReactMarkdown>
            </div>

            {/* Author/Reviewer Attribution - E-E-A-T Compliant */}
            {(post.author || post.reviewer) && (
              <div className="border-t border-b py-8 mb-12">
                <AuthorCard
                  author={post.author as any}
                  reviewer={post.reviewer as any}
                  showBio
                />
              </div>
            )}

            {/* Linked Content from Internal Links */}
            <LinkedContent sourceType="blog_post" sourceId={post.id} title="You May Also Like" />

            {/* Related Posts from Same Topic */}
            {relatedPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-display font-semibold mb-6">More on This Topic</h2>
                <div className="grid gap-4">
                  {relatedPosts.map((relatedPost: any) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                      <Card className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4 flex items-center gap-4">
                          {relatedPost.cover_image_url && (
                            <OptimizedImage 
                              src={relatedPost.cover_image_url} 
                              alt={relatedPost.title}
                              containerClassName="w-20 h-14 rounded flex-shrink-0"
                              className="w-full h-full"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{relatedPost.title}</h3>
                            {relatedPost.reading_time_minutes && (
                              <span className="text-sm text-muted-foreground">{relatedPost.reading_time_minutes} min read</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="text-center bg-muted/50 rounded-2xl p-8">
              <h2 className="text-xl font-display font-semibold mb-4">Ready for Clarity?</h2>
              <p className="text-muted-foreground mb-6">
                Discover what's actually blocking your growth with the Income Clarity Diagnostic.
              </p>
              <Link to="/diagnostic">
                <Button size="lg">Take the Diagnostic</Button>
              </Link>
            </section>
          </div>
        </div>
      </article>
    </Layout>
  );
}
