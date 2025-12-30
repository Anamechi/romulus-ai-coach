import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { useQAPage, usePublishedQAPages } from "@/hooks/useQAPages";
import { LinkedContent } from "@/components/content/LinkedContent";
import { AuthorCard } from "@/components/content/AuthorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function QADetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: qa, isLoading, error } = useQAPage(slug || "");
  const { data: allQAs } = usePublishedQAPages();

  // Get related Q&As from same topic
  const relatedQAs = allQAs?.filter((q: any) => 
    q.topic_id === qa?.topic_id && q.id !== qa?.id
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-12 w-full mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !qa) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Q&A Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The Q&A page you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/qa"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Q&A
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Q&A", url: "/qa" },
    { name: qa.question.substring(0, 50), url: `/qa/${qa.slug}` },
  ];

  // QAPage JSON-LD Schema
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: qa.question,
      text: qa.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
        ...(qa.author && {
          author: {
            "@type": "Person",
            name: qa.author.full_name,
            ...(qa.author.credentials && { jobTitle: qa.author.credentials }),
          },
        }),
      },
    },
  };

  // Speakable schema if speakable_answer exists
  const speakableSchema = qa.speakable_answer
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#speakable-answer"],
        },
      }
    : null;

  return (
    <Layout>
      <SEOHead
        title={qa.meta_title || `${qa.question} | Dr. Romulus MBA`}
        description={
          qa.meta_description || qa.answer.substring(0, 160)
        }
        canonicalUrl={`/qa/${qa.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(qaSchema)}</script>
        {speakableSchema && (
          <script type="application/ld+json">
            {JSON.stringify(speakableSchema)}
          </script>
        )}
      </Helmet>

      <article className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/qa"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Q&A
          </Link>

          {/* Topic badge */}
          {qa.topic && (
            <Badge variant="secondary" className="mb-4">
              {qa.topic.name}
            </Badge>
          )}

          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
            {qa.question}
          </h1>

          {/* Speakable Answer Block */}
          {qa.speakable_answer && (
            <div
              id="speakable-answer"
              className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg mb-8"
            >
              <p className="text-lg font-medium text-foreground">
                {qa.speakable_answer}
              </p>
            </div>
          )}

          {/* Full Answer */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-foreground whitespace-pre-wrap">{qa.answer}</p>
          </div>

          {/* Author/Reviewer Attribution - E-E-A-T Compliant */}
          {(qa.author || qa.reviewer) && (
            <div className="border-t border-border pt-8">
              <AuthorCard
                author={qa.author as any}
                reviewer={qa.reviewer as any}
                authorLabel="Answered by"
              />
            </div>
          )}

          {/* Linked Content */}
          <LinkedContent sourceType="faq" sourceId={qa.id} title="Related Resources" />

          {/* Related Q&As from Same Topic */}
          {relatedQAs.length > 0 && (
            <section className="mt-12 pt-12 border-t border-border">
              <h2 className="text-2xl font-display font-semibold mb-6">Related Questions</h2>
              <div className="space-y-4">
                {relatedQAs.map((relatedQA: any) => (
                  <Link key={relatedQA.id} to={`/qa/${relatedQA.slug}`}>
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-medium">{relatedQA.question}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-12 pt-12 border-t border-border text-center">
            <h2 className="text-xl font-display font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Get in touch and we'll help you out.
            </p>
            <Link to="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </section>
        </div>
      </article>
    </Layout>
  );
}
