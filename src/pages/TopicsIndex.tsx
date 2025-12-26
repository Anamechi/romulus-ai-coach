import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { useTopics } from "@/hooks/useTopics";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, ArrowRight } from "lucide-react";

export default function TopicsIndex() {
  const { data: topics, isLoading } = useTopics();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Topics", url: "/topics" },
  ];

  const funnelStageColors: Record<string, string> = {
    TOFU: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    MOFU: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    BOFU: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  return (
    <Layout>
      <SEOHead
        title="Topics - Explore by Subject | Dr. Romulus MBA"
        description="Explore business coaching and consulting content organized by topic. Find articles, FAQs, and resources on your areas of interest."
        canonicalUrl="/topics"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <FolderOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Explore Topics
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our content organized by subject area. Find exactly what you need
              for your business journey.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : topics && topics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/topics/${topic.slug}`}
                  className="group relative p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  <div className="mb-4">
                    {topic.funnel_stage && (
                      <Badge
                        className={`${funnelStageColors[topic.funnel_stage] || ""} mb-2`}
                      >
                        {topic.funnel_stage}
                      </Badge>
                    )}
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {topic.name}
                    </h2>
                  </div>
                  {topic.description && (
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {topic.description}
                    </p>
                  )}
                  <div className="flex items-center text-primary text-sm font-medium">
                    Explore
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No topics available yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
