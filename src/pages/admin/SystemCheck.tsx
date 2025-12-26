import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useFaqs } from "@/hooks/useFaqs";
import { useQAPages } from "@/hooks/useQAPages";
import { useAuthors } from "@/hooks/useAuthors";
import { useReviewers } from "@/hooks/useReviewers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  HelpCircle, 
  MessageCircleQuestion,
  User,
  Shield
} from "lucide-react";

interface ValidationIssue {
  id: string;
  type: string;
  title: string;
  field: string;
  message: string;
  severity: "error" | "warning";
  link: string;
}

export default function SystemCheck() {
  const { data: blogPosts } = useBlogPosts();
  const { data: faqs } = useFaqs();
  const { data: qaPages } = useQAPages();
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();

  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  useEffect(() => {
    const newIssues: ValidationIssue[] = [];

    // Check blog posts
    blogPosts?.forEach((post: any) => {
      if (!post.author_id) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "author", message: "Missing author (E-E-A-T)", severity: "error", link: `/admin/articles` });
      }
      if (!post.reviewer_id) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "reviewer", message: "Missing reviewer", severity: "warning", link: `/admin/articles` });
      }
      if (!post.speakable_summary) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "speakable", message: "Missing speakable summary", severity: "warning", link: `/admin/articles` });
      } else {
        const wordCount = post.speakable_summary.trim().split(/\s+/).length;
        if (wordCount < 40 || wordCount > 60) {
          newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "speakable", message: `Speakable summary: ${wordCount} words (target: 40-60)`, severity: "warning", link: `/admin/articles` });
        }
      }
      if (!post.meta_title) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "meta_title", message: "Missing meta title", severity: "error", link: `/admin/articles` });
      }
      if (!post.meta_description) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "meta_description", message: "Missing meta description", severity: "error", link: `/admin/articles` });
      }
      if (!post.topic_id) {
        newIssues.push({ id: post.id, type: "blog_post", title: post.title, field: "topic", message: "No topic assigned", severity: "warning", link: `/admin/articles` });
      }
    });

    // Check FAQs
    faqs?.forEach((faq: any) => {
      if (!faq.author_id) {
        newIssues.push({ id: faq.id, type: "faq", title: faq.question, field: "author", message: "Missing author", severity: "warning", link: `/admin/faqs` });
      }
      if (!faq.speakable_answer) {
        newIssues.push({ id: faq.id, type: "faq", title: faq.question, field: "speakable", message: "Missing speakable answer", severity: "warning", link: `/admin/faqs` });
      }
      if (!faq.topic_id) {
        newIssues.push({ id: faq.id, type: "faq", title: faq.question, field: "topic", message: "No topic assigned", severity: "warning", link: `/admin/faqs` });
      }
    });

    // Check Q&A pages
    qaPages?.forEach((qa: any) => {
      if (!qa.author_id) {
        newIssues.push({ id: qa.id, type: "qa_page", title: qa.question, field: "author", message: "Missing author", severity: "warning", link: `/admin/qa-pages` });
      }
      if (!qa.speakable_answer) {
        newIssues.push({ id: qa.id, type: "qa_page", title: qa.question, field: "speakable", message: "Missing speakable answer", severity: "warning", link: `/admin/qa-pages` });
      }
    });

    // Check authors
    authors?.forEach((author: any) => {
      if (!author.credentials) {
        newIssues.push({ id: author.id, type: "author", title: author.full_name, field: "credentials", message: "Missing credentials (E-E-A-T)", severity: "warning", link: `/admin/authors` });
      }
      if (!author.bio) {
        newIssues.push({ id: author.id, type: "author", title: author.full_name, field: "bio", message: "Missing bio", severity: "warning", link: `/admin/authors` });
      }
    });

    setIssues(newIssues);
  }, [blogPosts, faqs, qaPages, authors, reviewers]);

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const totalContent = (blogPosts?.length || 0) + (faqs?.length || 0) + (qaPages?.length || 0);
  const healthScore = totalContent > 0 ? Math.round(((totalContent * 5 - errors.length * 2 - warnings.length) / (totalContent * 5)) * 100) : 100;

  const groupedIssues = {
    blog_post: issues.filter((i) => i.type === "blog_post"),
    faq: issues.filter((i) => i.type === "faq"),
    qa_page: issues.filter((i) => i.type === "qa_page"),
    author: issues.filter((i) => i.type === "author"),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            System Check
          </h1>
          <p className="text-muted-foreground">Content quality and compliance validation.</p>
        </div>

        {/* Health Score */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{healthScore}%</div>
              <Progress value={healthScore} className="mt-2" />
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

        {/* Issues by Type */}
        <Tabs defaultValue="blog_post">
          <TabsList>
            <TabsTrigger value="blog_post" className="gap-2">
              <FileText className="h-4 w-4" />
              Blog Posts ({groupedIssues.blog_post.length})
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs ({groupedIssues.faq.length})
            </TabsTrigger>
            <TabsTrigger value="qa_page" className="gap-2">
              <MessageCircleQuestion className="h-4 w-4" />
              Q&A ({groupedIssues.qa_page.length})
            </TabsTrigger>
            <TabsTrigger value="author" className="gap-2">
              <User className="h-4 w-4" />
              Authors ({groupedIssues.author.length})
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
                      </div>
                      <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>
                        {issue.field}
                      </Badge>
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
