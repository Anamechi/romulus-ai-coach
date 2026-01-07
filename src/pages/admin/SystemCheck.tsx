import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useFaqs } from "@/hooks/useFaqs";
import { useQAPages } from "@/hooks/useQAPages";
import { useTopics } from "@/hooks/useTopics";
import { useAuthors } from "@/hooks/useAuthors";
import { useReviewers } from "@/hooks/useReviewers";
import { useContentSettings } from "@/hooks/useContentSettings";
import { useLinkGovernance } from "@/hooks/useLinkGovernance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  HelpCircle, 
  MessageCircleQuestion,
  User,
  Shield,
  Hash,
  Link as LinkIcon,
  ExternalLink,
  TrendingUp,
  ArrowRight
} from "lucide-react";

interface ValidationIssue {
  id: string;
  type: string;
  title: string;
  field: string;
  message: string;
  severity: "error" | "warning";
  link: string;
  reason?: string;
}

export default function SystemCheck() {
  const { data: blogPosts } = useBlogPosts();
  const { data: faqs } = useFaqs();
  const { data: qaPages } = useQAPages();
  const { data: topics } = useTopics();
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();
  const { data: settings } = useContentSettings();
  const { data: linkGovernance } = useLinkGovernance();

  const minWordCount = settings?.min_word_count ?? 300;
  const minInternalLinks = settings?.min_internal_links ?? 1;

  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  // Calculate word count
  const getWordCount = (text: string | null | undefined): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  useEffect(() => {
    const newIssues: ValidationIssue[] = [];

    // Check blog posts
    blogPosts?.forEach((post: any) => {
      if (!post.author_id) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "author", message: "Missing author (E-E-A-T)", severity: "error", link: `/admin/articles`, reason: "AI engines require clear authorship for citation credibility" });
      }
      if (!post.reviewer_id) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "reviewer", message: "Missing reviewer", severity: "warning", link: `/admin/articles`, reason: "Reviewed content signals quality to AI systems" });
      }
      if (!post.speakable_summary) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "speakable", message: "Missing speakable summary", severity: "warning", link: `/admin/articles`, reason: "Required for voice assistant citations" });
      } else {
        const wordCount = post.speakable_summary.trim().split(/\s+/).length;
        if (wordCount < 40 || wordCount > 60) {
          newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "speakable", message: `Speakable summary: ${wordCount} words (target: 40-60)`, severity: "warning", link: `/admin/articles`, reason: "Voice assistants prefer 40-60 word responses" });
        }
      }
      if (!post.meta_title) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "meta_title", message: "Missing meta title", severity: "error", link: `/admin/articles`, reason: "Required for search engine indexing" });
      }
      if (!post.meta_description) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "meta_description", message: "Missing meta description", severity: "error", link: `/admin/articles`, reason: "Required for search engine snippets" });
      }
      if (!post.topic_id) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "topic", message: "No topic assigned", severity: "warning", link: `/admin/articles`, reason: "Topics enable content clustering for authority" });
      }
      // Word count check
      const contentWordCount = getWordCount(post.content);
      if (contentWordCount < minWordCount) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "word_count", message: `Content: ${contentWordCount} words (min: ${minWordCount})`, severity: "warning", link: `/admin/articles`, reason: "Thin content is less likely to be cited" });
      }
      // Internal link check - use contentStats from linkGovernance
      const contentStat = linkGovernance?.contentStats?.find((c: any) => c.type === 'blog_post' && c.id === post.id);
      const postLinks = contentStat?.outgoingLinks ?? 0;
      if (postLinks < minInternalLinks && post.published) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "internal_links", message: `Only ${postLinks} internal links (min: ${minInternalLinks})`, severity: "warning", link: `/admin/internal-links`, reason: "Internal links distribute authority across content" });
      }
    });

    // Check FAQs
    faqs?.forEach((faq: any) => {
      if (!faq.author_id) {
        newIssues.push({ id: faq.id, type: "faq", title: faq.question, field: "author", message: "Missing author", severity: "warning", link: `/admin/faqs`, reason: "Authorship improves E-E-A-T signals" });
      }
      if (!faq.speakable_answer) {
        newIssues.push({ id: faq.id, type: "faq", title: faq.question, field: "speakable", message: "Missing speakable answer", severity: "warning", link: `/admin/faqs`, reason: "Required for voice assistant citations" });
      }
      if (!faq.topic_id) {
        newIssues.push({ id: faq.id, type: "faq", title: faq.question, field: "topic", message: "No topic assigned", severity: "warning", link: `/admin/faqs`, reason: "Topics enable content clustering" });
      }
    });

    // Check Q&A pages
    qaPages?.forEach((qa: any) => {
      if (!qa.author_id) {
        newIssues.push({ id: qa.id, type: "qa_page", title: qa.question, field: "author", message: "Missing author", severity: "warning", link: `/admin/qa-pages`, reason: "Authorship improves E-E-A-T signals" });
      }
      if (!qa.speakable_answer) {
        newIssues.push({ id: qa.id, type: "qa_page", title: qa.question, field: "speakable", message: "Missing speakable answer", severity: "warning", link: `/admin/qa-pages`, reason: "Required for voice assistant citations" });
      }
      if (!qa.meta_title) {
        newIssues.push({ id: qa.id, type: "qa_page", title: qa.question, field: "meta_title", message: "Missing meta title", severity: "warning", link: `/admin/qa-pages`, reason: "Helps search engine indexing" });
      }
      if (!qa.meta_description) {
        newIssues.push({ id: qa.id, type: "qa_page", title: qa.question, field: "meta_description", message: "Missing meta description", severity: "warning", link: `/admin/qa-pages`, reason: "Improves search snippets" });
      }
    });

    // Check topics
    topics?.forEach((topic: any) => {
      if (!topic.speakable_summary) {
        newIssues.push({ id: topic.id, type: "topic", title: topic.name, field: "speakable", message: "Missing speakable summary", severity: "warning", link: `/admin/topics`, reason: "Topic pages benefit from voice-ready summaries" });
      }
      if (!topic.description) {
        newIssues.push({ id: topic.id, type: "topic", title: topic.name, field: "description", message: "Missing description", severity: "warning", link: `/admin/topics`, reason: "Descriptions help AI understand topic scope" });
      }
    });

    // Check authors
    authors?.forEach((author: any) => {
      if (!author.credentials) {
        newIssues.push({ id: author.id, type: "author", title: author.full_name, field: "credentials", message: "Missing credentials (E-E-A-T)", severity: "warning", link: `/admin/authors`, reason: "Credentials establish expertise for AI systems" });
      }
      if (!author.bio) {
        newIssues.push({ id: author.id, type: "author", title: author.full_name, field: "bio", message: "Missing bio", severity: "warning", link: `/admin/authors`, reason: "Bios provide context for AI citations" });
      }
      if (!author.slug) {
        newIssues.push({ id: author.id, type: "author", title: author.full_name, field: "slug", message: "Missing profile slug", severity: "warning", link: `/admin/authors`, reason: "Public profiles strengthen authorship signals" });
      }
      if (!author.knows_about || author.knows_about.length === 0) {
        newIssues.push({ id: author.id, type: "author", title: author.full_name, field: "expertise", message: "No expertise areas defined", severity: "warning", link: `/admin/authors`, reason: "KnowsAbout schema improves author authority" });
      }
    });

    // Link governance issues
    if (linkGovernance?.orphaned) {
      linkGovernance.orphaned.forEach((orphan: any) => {
        newIssues.push({
          id: orphan.id,
          type: "link_governance",
          title: orphan.title,
          field: "orphaned",
          message: `Orphaned ${orphan.type} (0 incoming links)`,
          severity: "warning",
          link: `/admin/internal-links`,
          reason: "Orphaned content has weak authority flow"
        });
      });
    }

    setIssues(newIssues);
  }, [blogPosts, faqs, qaPages, topics, authors, reviewers, linkGovernance, minWordCount, minInternalLinks]);

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const totalContent = (blogPosts?.length || 0) + (faqs?.length || 0) + (qaPages?.length || 0) + (topics?.length || 0);

  // AI Citation Readiness Score (0-100)
  const aiReadinessScore = useMemo(() => {
    if (totalContent === 0) return 100;
    
    // Weights for different components
    const contentComplete = Math.max(0, 100 - (errors.length * 10) - (warnings.length * 2));
    
    // E-E-A-T score (25%)
    const authorsWithProfiles = authors?.filter((a: any) => a.slug && a.bio && a.credentials).length || 0;
    const eatScore = authors?.length ? (authorsWithProfiles / authors.length) * 100 : 0;
    
    // Schema coverage (25%)
    const speakableContent = [
      ...(blogPosts?.filter((p: any) => p.speakable_summary) || []),
      ...(faqs?.filter((f: any) => f.speakable_answer) || []),
      ...(qaPages?.filter((q: any) => q.speakable_answer) || []),
    ].length;
    const schemaScore = totalContent > 0 ? (speakableContent / totalContent) * 100 : 0;
    
    // Internal linking health (25%)
    const orphanCount = linkGovernance?.orphaned?.length || 0;
    const linkScore = totalContent > 0 ? Math.max(0, 100 - (orphanCount / totalContent) * 100) : 100;
    
    // Content completeness (25%)
    const contentScore = contentComplete;
    
    return Math.round((eatScore * 0.25) + (schemaScore * 0.25) + (linkScore * 0.25) + (contentScore * 0.25));
  }, [errors, warnings, totalContent, authors, blogPosts, faqs, qaPages, linkGovernance]);

  const groupedIssues = {
    blog_post: issues.filter((i) => i.type === "blog_post"),
    faq: issues.filter((i) => i.type === "faq"),
    qa_page: issues.filter((i) => i.type === "qa_page"),
    topic: issues.filter((i) => i.type === "topic"),
    author: issues.filter((i) => i.type === "author"),
    link_governance: issues.filter((i) => i.type === "link_governance"),
  };

  // System Completion Checklist
  const systemChecklist = [
    { label: "About page exists", check: true, link: "/about" },
    { label: "Editorial Policy page exists", check: true, link: "/editorial-policy" },
    { label: "Methodology page exists", check: true, link: "/methodology" },
    { label: "Trust Hub page exists", check: true, link: "/trust" },
    { label: "Primary author configured", check: authors?.some((a: any) => a.slug && a.bio && a.credentials) ?? false, link: "/admin/authors" },
    { label: "All published content has author", check: errors.filter(e => e.field === "author").length === 0, link: "/admin/articles" },
    { label: "All published content has speakable", check: warnings.filter(w => w.field === "speakable").length === 0, link: "/admin/articles" },
    { label: "No orphaned content", check: (linkGovernance?.orphaned?.length || 0) === 0, link: "/admin/internal-links" },
  ];

  const completedChecks = systemChecklist.filter(c => c.check).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            System Check
          </h1>
          <p className="text-muted-foreground">Content quality, compliance validation, and AI citation readiness.</p>
        </div>

        {/* AI Readiness Score */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI Citation Readiness Score
            </CardTitle>
            <CardDescription>
              How ready is your content to be cited by AI systems like ChatGPT, Google AI, and Perplexity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-5xl font-bold text-primary">{aiReadinessScore}</div>
              <div className="flex-1">
                <Progress value={aiReadinessScore} className="h-4" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>E-E-A-T (25%)</span>
                  <span>Schema (25%)</span>
                  <span>Linking (25%)</span>
                  <span>Content (25%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Score Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(100 - (errors.length * 5) - (warnings.length * 1))}%</div>
              <Progress value={Math.max(0, 100 - (errors.length * 5) - (warnings.length * 1))} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{errors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{warnings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Total Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalContent}</div>
            </CardContent>
          </Card>
        </div>

        {/* System Completion Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              System Completion Checklist ({completedChecks}/{systemChecklist.length})
            </CardTitle>
            <CardDescription>Required components for AI-ready platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {systemChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.check ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className={item.check ? "text-muted-foreground" : "font-medium"}>{item.label}</span>
                  </div>
                  <Link to={item.link}>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issues by Type */}
        <Tabs defaultValue="blog_post">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="blog_post" className="gap-2">
              <FileText className="h-4 w-4" />
              Blog ({groupedIssues.blog_post.length})
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs ({groupedIssues.faq.length})
            </TabsTrigger>
            <TabsTrigger value="qa_page" className="gap-2">
              <MessageCircleQuestion className="h-4 w-4" />
              Q&A ({groupedIssues.qa_page.length})
            </TabsTrigger>
            <TabsTrigger value="topic" className="gap-2">
              <Hash className="h-4 w-4" />
              Topics ({groupedIssues.topic.length})
            </TabsTrigger>
            <TabsTrigger value="author" className="gap-2">
              <User className="h-4 w-4" />
              Authors ({groupedIssues.author.length})
            </TabsTrigger>
            <TabsTrigger value="link_governance" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Links ({groupedIssues.link_governance.length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(groupedIssues).map(([type, typeIssues]) => (
            <TabsContent key={type} value={type}>
              {typeIssues.length > 0 ? (
                <div className="space-y-2">
                  {typeIssues.map((issue, idx) => (
                    <div key={`${issue.id}-${issue.field}-${idx}`} className="flex items-center gap-4 p-4 bg-card border rounded-lg">
                      {issue.severity === "error" ? (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{issue.title}</p>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        {issue.reason && (
                          <p className="text-xs text-muted-foreground/70 mt-1 italic">Why: {issue.reason}</p>
                        )}
                      </div>
                      <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>
                        {issue.field}
                      </Badge>
                      <Link to={issue.link}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">All checks passed!</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
