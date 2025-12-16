import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';

export default function BlogIndex() {
  const { data: posts, isLoading } = useBlogPosts(true);

  const featuredPosts = posts?.filter((post: any) => post.featured) || [];
  const regularPosts = posts?.filter((post: any) => !post.featured) || [];

  // Blog listing schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Dr. Romulus MBA Blog",
    "description": "Expert insights on business structure, fundability, automation, and entrepreneurial success.",
    "url": window.location.origin + "/blog",
    "blogPost": posts?.map((post: any) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt || post.meta_description,
      "url": `${window.location.origin}/blog/${post.slug}`,
      "datePublished": post.published_at,
      "author": post.author ? {
        "@type": "Person",
        "name": post.author.full_name
      } : undefined
    })) || []
  };

  return (
    <Layout>
      <Helmet>
        <title>Blog | Dr. Romulus MBA</title>
        <meta name="description" content="Expert insights on business structure, fundability, automation, and entrepreneurial success from Dr. Deanna Romulus." />
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Insights & Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert strategies for building structured, credible, and scalable businesses.
            </p>
          </header>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="space-y-12">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                    <span className="text-primary">⭐</span> Featured Articles
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredPosts.map((post: any) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="h-full hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                          {post.cover_image_url && (
                            <div className="aspect-video overflow-hidden">
                              <img 
                                src={post.cover_image_url} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <CardContent className="p-6">
                            {post.topic && (
                              <Badge variant="secondary" className="mb-3">{post.topic.name}</Badge>
                            )}
                            <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2 mb-4">
                              {post.excerpt || post.meta_description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {post.author && (
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {post.author.full_name}
                                </span>
                              )}
                              {post.reading_time_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {post.reading_time_minutes} min read
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* All Posts */}
              {regularPosts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-display font-semibold mb-6">
                    Latest Articles
                  </h2>
                  <div className="space-y-6">
                    {regularPosts.map((post: any) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="hover:border-primary/50 transition-all duration-300 group">
                          <CardContent className="p-6 flex gap-6">
                            {post.cover_image_url && (
                              <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden hidden md:block">
                                <img 
                                  src={post.cover_image_url} 
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {post.topic && (
                                  <Badge variant="secondary">{post.topic.name}</Badge>
                                )}
                                {post.published_at && (
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(post.published_at), 'MMM d, yyyy')}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2 mb-3">
                                {post.excerpt || post.meta_description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {post.author && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {post.author.full_name}
                                  </span>
                                )}
                                {post.reading_time_minutes && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {post.reading_time_minutes} min read
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-primary ml-auto">
                                  Read more <ArrowRight className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {posts?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No articles published yet. Check back soon!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
