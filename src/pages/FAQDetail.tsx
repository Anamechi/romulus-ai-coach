import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User, CheckCircle } from 'lucide-react';
import { useFaqBySlug, useFaqs } from '@/hooks/useFaqs';
import { LinkedContent } from '@/components/content/LinkedContent';
import { SEOHead } from '@/components/seo/SEOHead';
import { SingleFAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

export default function FAQDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: faq, isLoading, error } = useFaqBySlug(slug || '');
  const { data: allFaqs } = useFaqs(true);

  // Get related FAQs from same topic
  const relatedFaqs = allFaqs?.filter((f: any) => 
    f.topic_id === faq?.topic_id && f.id !== faq?.id
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
      </Layout>
    );
  }

  if (error || !faq) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">FAQ Not Found</h1>
          <p className="text-muted-foreground mb-8">The FAQ you're looking for doesn't exist or has been removed.</p>
          <Link to="/faq">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to FAQs
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${faq.question} | FAQ`}
        description={faq.answer.slice(0, 160)}
        canonicalUrl={`/faq/${faq.slug}`}
        ogType="website"
      />
      <SingleFAQSchema
        question={faq.question}
        answer={faq.answer}
        slug={faq.slug}
        speakableAnswer={faq.speakable_answer || undefined}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" },
        { name: faq.question, url: `/faq/${faq.slug}` }
      ]} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link to="/faq" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all FAQs
          </Link>

          {/* Main Content */}
          <article>
            <header className="mb-8">
              {faq.topic && (
                <span className="text-sm text-primary font-medium mb-2 block">
                  {(faq.topic as any).name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {faq.question}
              </h1>
            </header>

            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                </div>

                {/* Speakable Answer (hidden visually but available for voice assistants) */}
                {faq.speakable_answer && (
                  <div className="speakable-answer sr-only">
                    {faq.speakable_answer}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Author/Reviewer Attribution */}
            {(faq.author || faq.reviewer) && (
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-12">
                {faq.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Written by {(faq.author as any).full_name}</span>
                    {(faq.author as any).credentials && (
                      <span className="text-xs">({(faq.author as any).credentials})</span>
                    )}
                  </div>
                )}
                {faq.reviewer && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Reviewed by {(faq.reviewer as any).full_name}</span>
                    {(faq.reviewer as any).credentials && (
                      <span className="text-xs">({(faq.reviewer as any).credentials})</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>

          {/* Linked Content from Internal Links */}
          <LinkedContent sourceType="faq" sourceId={faq.id} title="Related Resources" />

          {/* Related FAQs from Same Topic */}
          {relatedFaqs.length > 0 && (
            <section className="mt-12 pt-12 border-t">
              <h2 className="text-2xl font-display font-semibold mb-6">Related Questions</h2>
              <div className="space-y-4">
                {relatedFaqs.map((relatedFaq: any) => (
                  <Link key={relatedFaq.id} to={`/faq/${relatedFaq.slug}`}>
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-medium">{relatedFaq.question}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-12 pt-12 border-t text-center">
            <h2 className="text-xl font-display font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Get in touch and we'll help you out.
            </p>
            <Link to="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
}
