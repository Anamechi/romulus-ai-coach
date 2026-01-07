import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { useAuthors } from '@/hooks/useAuthors';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useFaqs } from '@/hooks/useFaqs';
import { useQAPages } from '@/hooks/useQAPages';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, ArrowRight, Linkedin, FileText, HelpCircle, MessageCircleQuestion, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AuthorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: authors, isLoading: authorsLoading } = useAuthors();
  const { data: blogPosts } = useBlogPosts();
  const { data: faqs } = useFaqs();
  const { data: qaPages } = useQAPages();

  const author = authors?.find((a: any) => a.slug === slug);

  if (authorsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-48 w-full mb-8" />
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The author you're looking for doesn't exist.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to About
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Filter content by author
  const authorPosts = blogPosts?.filter((p: any) => p.author_id === author.id && p.published) || [];
  const authorFaqs = faqs?.filter((f: any) => f.author_id === author.id && f.status === 'published') || [];
  const authorQAs = qaPages?.filter((q: any) => q.author_id === author.id && q.status === 'published') || [];

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Authors', url: '/authors' },
    { name: author.full_name, url: `/authors/${author.slug}` },
  ];

  // Parse knows_about if it exists
  const knowsAbout = (author as any).knows_about || [];

  // Person JSON-LD with enhanced E-E-A-T signals
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://drromulusmba.com/authors/${author.slug}#person`,
    name: author.full_name,
    description: author.bio,
    image: author.photo_url,
    url: `https://drromulusmba.com/authors/${author.slug}`,
    jobTitle: author.credentials || 'Business Consultant',
    ...(author.linkedin_url && {
      sameAs: [author.linkedin_url],
    }),
    ...(knowsAbout.length > 0 && {
      knowsAbout: knowsAbout.map((topic: string) => ({
        '@type': 'Thing',
        name: topic,
      })),
    }),
    ...(author.years_experience && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Professional Experience',
        name: `${author.years_experience}+ years of experience`,
      },
    }),
    worksFor: {
      '@type': 'Organization',
      name: 'Dr. Romulus MBA',
      url: 'https://drromulusmba.com',
    },
  };

  const initials = author.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Layout>
      <SEOHead
        title={`${author.full_name} - Author | Dr. Romulus MBA`}
        description={author.bio || `Learn more about ${author.full_name}, a contributor at Dr. Romulus MBA.`}
        canonicalUrl={`/authors/${author.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to About
          </Link>

          {/* Author Header */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <Avatar className="h-32 w-32 text-3xl">
                  <AvatarImage src={author.photo_url || undefined} alt={author.full_name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                    {author.full_name}
                  </h1>
                  {author.credentials && (
                    <p className="text-lg text-primary font-medium mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      {author.credentials}
                    </p>
                  )}
                  {author.bio && (
                    <p className="text-muted-foreground leading-relaxed mb-6 speakable-content">
                      {author.bio}
                    </p>
                  )}

                  {/* Expertise Areas */}
                  {knowsAbout.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Areas of Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {knowsAbout.map((topic: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-4">
                    {author.linkedin_url && (
                      <a
                        href={author.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Linkedin className="h-5 w-5" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author's Content */}
          <div className="space-y-8">
            {/* Blog Posts */}
            {authorPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Articles ({authorPosts.length})
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {authorPosts.map((post: any) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all group">
                        <CardHeader>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center text-primary text-sm font-medium mt-4">
                            Read more
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {authorFaqs.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-6 w-6" />
                  FAQs ({authorFaqs.length})
                </h2>
                <div className="space-y-3">
                  {authorFaqs.slice(0, 5).map((faq: any) => (
                    <Link
                      key={faq.id}
                      to={`/faq/${faq.slug}`}
                      className="group block p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all"
                    >
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {faq.question}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Q&A Pages */}
            {authorQAs.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                  <MessageCircleQuestion className="h-6 w-6" />
                  Q&A Pages ({authorQAs.length})
                </h2>
                <div className="space-y-3">
                  {authorQAs.slice(0, 5).map((qa: any) => (
                    <Link
                      key={qa.id}
                      to={`/qa/${qa.slug}`}
                      className="group block p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all"
                    >
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {qa.question}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No content message */}
            {authorPosts.length === 0 && authorFaqs.length === 0 && authorQAs.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No published content by this author yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
