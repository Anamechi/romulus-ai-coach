import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { useAuthors } from '@/hooks/useAuthors';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users } from 'lucide-react';

export default function AuthorsIndex() {
  const { data: authors, isLoading } = useAuthors();

  const activeAuthors = authors?.filter((a: any) => a.is_active && a.slug) || [];

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Authors', url: '/authors' },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-xl mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Our Authors | Dr. Romulus MBA"
        description="Meet the experts behind Dr. Romulus MBA. Our authors bring decades of experience in business automation, AI integration, and strategic growth."
        canonicalUrl="/authors"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Authors
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the experts behind our content. Each author brings years of experience and deep expertise in their field.
            </p>
          </div>

          {/* Authors Grid */}
          {activeAuthors.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {activeAuthors.map((author: any) => {
                const initials = author.full_name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase();

                const knowsAbout = author.knows_about || [];

                return (
                  <Link key={author.id} to={`/authors/${author.slug}`}>
                    <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all group">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 text-xl">
                            <AvatarImage src={author.photo_url || undefined} alt={author.full_name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {author.full_name}
                            </CardTitle>
                            {author.credentials && (
                              <p className="text-sm text-primary font-medium mt-1">
                                {author.credentials}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {author.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {author.bio}
                          </p>
                        )}
                        {knowsAbout.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {knowsAbout.slice(0, 3).map((topic: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {knowsAbout.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{knowsAbout.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="flex items-center text-primary text-sm font-medium">
                          View Profile
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No authors available yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
