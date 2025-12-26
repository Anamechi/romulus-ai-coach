import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { usePublishedQAPages } from "@/hooks/useQAPages";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";

export default function QA() {
  const { data: qaPages, isLoading } = usePublishedQAPages();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Q&A", url: "/qa" },
  ];

  return (
    <Layout>
      <SEOHead
        title="Q&A - Quick Answers | Dr. Romulus MBA"
        description="Get quick, direct answers to common business coaching and consulting questions from Dr. Romulus MBA."
        canonicalUrl="/qa"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <MessageCircleQuestion className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Quick Answers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Direct answers to your most pressing business and coaching questions.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : qaPages && qaPages.length > 0 ? (
            <div className="space-y-4">
              {qaPages.map((qa) => (
                <Link
                  key={qa.id}
                  to={`/qa/${qa.slug}`}
                  className="group block p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {qa.question}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2">
                        {qa.answer.substring(0, 150)}...
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No Q&A pages available yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
