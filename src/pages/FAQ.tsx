import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useFaqs } from '@/hooks/useFaqs';
import { SEOHead } from '@/components/seo/SEOHead';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

export default function FAQ() {
  const { data: faqs, isLoading } = useFaqs(true);

  const featuredFaqs = faqs?.filter((faq: any) => faq.featured) || [];
  const regularFaqs = faqs?.filter((faq: any) => !faq.featured) || [];

  // Group FAQs by topic
  const groupedFaqs = regularFaqs.reduce((acc: any, faq: any) => {
    const topicName = faq.topic?.name || 'General';
    if (!acc[topicName]) {
      acc[topicName] = [];
    }
    acc[topicName].push(faq);
    return acc;
  }, {});

  // Prepare FAQ items for schema
  const faqItems = faqs?.map((faq: any) => ({
    question: faq.question,
    answer: faq.answer
  })) || [];

  return (
    <Layout>
      <SEOHead
        title="Frequently Asked Questions"
        description="Find answers to common questions about business coaching, MBA programs, and automation strategies with Dr. Romulus."
        canonicalUrl="/faq"
        ogType="website"
      />
      <FAQSchema faqs={faqItems} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" }
      ]} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Get answers to the most common questions about our coaching programs and services.
            </p>
          </header>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="space-y-12">
              {/* Featured FAQs */}
              {featuredFaqs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
                    <span className="text-primary">⭐</span> Most Popular Questions
                  </h2>
                  <div className="space-y-4">
                    {featuredFaqs.map((faq: any) => (
                      <Link key={faq.id} to={`/faq/${faq.slug}`}>
                        <Card className="hover:border-primary/50 transition-colors">
                          <CardContent className="p-6 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                              <p className="text-muted-foreground line-clamp-2">{faq.answer}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Grouped FAQs by Topic */}
              {Object.entries(groupedFaqs).map(([topicName, topicFaqs]: [string, any]) => (
                <section key={topicName}>
                  <h2 className="text-2xl font-display font-semibold mb-6">
                    {topicName}
                  </h2>
                  <div className="space-y-4">
                    {topicFaqs.map((faq: any) => (
                      <Link key={faq.id} to={`/faq/${faq.slug}`}>
                        <Card className="hover:border-primary/50 transition-colors">
                          <CardContent className="p-6 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                              <p className="text-muted-foreground line-clamp-2">{faq.answer}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}

              {faqs?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No FAQs available yet. Check back soon!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
