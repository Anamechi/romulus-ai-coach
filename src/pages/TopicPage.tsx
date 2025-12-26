import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { useTopics } from "@/hooks/useTopics";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useFaqs } from "@/hooks/useFaqs";
import { usePublishedQAPages } from "@/hooks/useQAPages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, FileText, HelpCircle, MessageCircleQuestion } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: topics, isLoading: topicsLoading } = useTopics();
  const { data: blogPosts, isLoading: blogLoading } = useBlogPosts();
  const { data: faqs, isLoading: faqsLoading } = useFaqs();
  const { data: qaPages, isLoading: qaLoading } = usePublishedQAPages();

  const topic = topics?.find((t) => t.slug === slug);
  const isLoading = topicsLoading || blogLoading || faqsLoading || qaLoading;

  if (topicsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-xl mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!topic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The topic you're looking for doesn't exist.
            </p>
            <Link
              to="/topics"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Topics
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Filter content by topic
  const topicBlogPosts = blogPosts?.filter((p) => p.topic_id === topic.id) || [];
  const topicFaqs = faqs?.filter((f: any) => f.topic_id === topic.id) || [];
  const topicQAs = qaPages?.filter((q) => q.topic_id === topic.id) || [];

  // Group blog posts by funnel stage
  const tofuPosts = topicBlogPosts.filter((p: any) => p.funnel_stage === "TOFU");
  const mofuPosts = topicBlogPosts.filter((p: any) => p.funnel_stage === "MOFU");
  const bofuPosts = topicBlogPosts.filter((p: any) => p.funnel_stage === "BOFU");

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Topics", url: "/topics" },
    { name: topic.name, url: `/topics/${topic.slug}` },
  ];

  // CollectionPage JSON-LD
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.name,
    description: topic.description || `Content about ${topic.name}`,
    url: `https://drromulusmba.com/topics/${topic.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: topicBlogPosts.length + topicFaqs.length + topicQAs.length,
    },
  };

  return (
    <Layout>
      <SEOHead
        title={`${topic.name} - Topic | Dr. Romulus MBA`}
        description={topic.description || `Explore all content about ${topic.name} from Dr. Romulus MBA.`}
        canonicalUrl={`/topics/${topic.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Topics
          </Link>

          {/* Topic Header */}
          <div className="mb-12">
            {topic.funnel_stage && (
              <Badge className="mb-4">{topic.funnel_stage}</Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              {topic.name}
            </h1>
            {topic.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {topic.description}
              </p>
            )}
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="h-4 w-4" />
                Articles ({topicBlogPosts.length})
              </TabsTrigger>
              <TabsTrigger value="faqs" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs ({topicFaqs.length})
              </TabsTrigger>
              <TabsTrigger value="qa" className="gap-2">
                <MessageCircleQuestion className="h-4 w-4" />
                Q&A ({topicQAs.length})
              </TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles">
              {topicBlogPosts.length > 0 ? (
                <div className="space-y-8">
                  {/* TOFU Section */}
                  {tofuPosts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          TOFU
                        </Badge>
                        Awareness Stage
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {tofuPosts.map((post: any) => (
                          <ArticleCard key={post.id} post={post} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MOFU Section */}
                  {mofuPosts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          MOFU
                        </Badge>
                        Consideration Stage
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {mofuPosts.map((post: any) => (
                          <ArticleCard key={post.id} post={post} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BOFU Section */}
                  {bofuPosts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          BOFU
                        </Badge>
                        Decision Stage
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {bofuPosts.map((post: any) => (
                          <ArticleCard key={post.id} post={post} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uncategorized */}
                  {topicBlogPosts.filter((p: any) => !p.funnel_stage).length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Other Articles</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {topicBlogPosts
                          .filter((p: any) => !p.funnel_stage)
                          .map((post: any) => (
                            <ArticleCard key={post.id} post={post} />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState message="No articles in this topic yet." />
              )}
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs">
              {topicFaqs.length > 0 ? (
                <div className="space-y-4">
                  {topicFaqs.map((faq: any) => (
                    <Link
                      key={faq.id}
                      to={`/faq/${faq.slug}`}
                      className="group block p-5 bg-card border border-border rounded-lg hover:border-primary/50 transition-all"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {faq.answer.substring(0, 150)}...
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No FAQs in this topic yet." />
              )}
            </TabsContent>

            {/* Q&A Tab */}
            <TabsContent value="qa">
              {topicQAs.length > 0 ? (
                <div className="space-y-4">
                  {topicQAs.map((qa) => (
                    <Link
                      key={qa.id}
                      to={`/qa/${qa.slug}`}
                      className="group block p-5 bg-card border border-border rounded-lg hover:border-primary/50 transition-all"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {qa.question}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {qa.answer.substring(0, 150)}...
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No Q&A pages in this topic yet." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

function ArticleCard({ post }: { post: any }) {
  return (
    <Link to={`/blog/${post.slug}`}>
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
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
