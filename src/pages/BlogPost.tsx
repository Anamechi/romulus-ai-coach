import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, User, CheckCircle, Calendar } from 'lucide-react';
import { useBlogPostBySlug, useBlogPosts } from '@/hooks/useBlogPosts';
import { LinkedContent } from '@/components/content/LinkedContent';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug || '');
  const { data: allPosts } = useBlogPosts(true);

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

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.cover_image_url,
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": post.author ? {
      "@type": "Person",
      "name": (post.author as any).full_name,
      "jobTitle": (post.author as any).credentials,
      "description": (post.author as any).bio
    } : {
      "@type": "Person",
      "name": "Dr. Deanna Romulus"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dr. Romulus MBA",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${post.slug}`
    }
  };

  // Speakable schema if speakable_summary exists
  const speakableSchema = post.speakable_summary ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-content"]
    }
  } : null;

  return (
    <Layout>
      <Helmet>
        <title>{post.meta_title || post.title} | Dr. Romulus MBA</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ''} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        {speakableSchema && (
          <script type="application/ld+json">
            {JSON.stringify(speakableSchema)}
          </script>
        )}
      </Helmet>

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
              <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                <img 
                  src={post.cover_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Speakable Summary (for voice assistants) */}
            {post.speakable_summary && (
              <div className="speakable-content sr-only">
                {post.speakable_summary}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Author/Reviewer Attribution */}
            {(post.author || post.reviewer) && (
              <div className="border-t border-b py-8 mb-12">
                {post.author && (
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {(post.author as any).photo_url ? (
                        <img 
                          src={(post.author as any).photo_url} 
                          alt={(post.author as any).full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Written by</p>
                      <p className="font-semibold">{(post.author as any).full_name}</p>
                      {(post.author as any).credentials && (
                        <p className="text-sm text-muted-foreground">{(post.author as any).credentials}</p>
                      )}
                      {(post.author as any).bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{(post.author as any).bio}</p>
                      )}
                    </div>
                  </div>
                )}
                {post.reviewer && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    <span>Reviewed by {(post.reviewer as any).full_name}</span>
                    {(post.reviewer as any).credentials && (
                      <span className="text-xs">({(post.reviewer as any).credentials})</span>
                    )}
                  </div>
                )}
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
                            <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={relatedPost.cover_image_url} 
                                alt={relatedPost.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
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
              <h2 className="text-xl font-display font-semibold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-muted-foreground mb-6">
                Get personalized coaching to build a structured, credible, and scalable business.
              </p>
              <Link to="/apply">
                <Button size="lg">Apply for Coaching</Button>
              </Link>
            </section>
          </div>
        </div>
      </article>
    </Layout>
  );
}
