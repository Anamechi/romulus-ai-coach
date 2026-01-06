import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/PageLoader";

// Eagerly load critical pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load public pages
const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const Apply = lazy(() => import("./pages/Apply"));
const Auth = lazy(() => import("./pages/Auth"));
const FAQ = lazy(() => import("./pages/FAQ"));
const FAQDetail = lazy(() => import("./pages/FAQDetail"));
const QA = lazy(() => import("./pages/QA"));
const QADetail = lazy(() => import("./pages/QADetail"));
const TopicsIndex = lazy(() => import("./pages/TopicsIndex"));
const TopicPage = lazy(() => import("./pages/TopicPage"));

// Lazy load admin pages (larger bundle, rarely needed by most users)
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Authors = lazy(() => import("./pages/admin/Authors"));
const Reviewers = lazy(() => import("./pages/admin/Reviewers"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Topics = lazy(() => import("./pages/admin/Topics"));
const FAQsAdmin = lazy(() => import("./pages/admin/FAQs"));
const ArticlesAdmin = lazy(() => import("./pages/admin/Articles"));
const Citations = lazy(() => import("./pages/admin/Citations"));
const InternalLinks = lazy(() => import("./pages/admin/InternalLinks"));
const ClusterGenerator = lazy(() => import("./pages/admin/ClusterGenerator"));
const Leads = lazy(() => import("./pages/admin/Leads"));
const Applications = lazy(() => import("./pages/admin/Applications"));
const AuthoritySources = lazy(() => import("./pages/admin/AuthoritySources"));
const LinkingEngine = lazy(() => import("./pages/admin/LinkingEngine"));
const QAPagesAdmin = lazy(() => import("./pages/admin/QAPages"));
const SystemCheck = lazy(() => import("./pages/admin/SystemCheck"));
const AuditLog = lazy(() => import("./pages/admin/AuditLog"));
const ChatbotConversations = lazy(() => import("./pages/admin/ChatbotConversations"));
const CitationHealth = lazy(() => import("./pages/admin/CitationHealth"));
const IndexNow = lazy(() => import("./pages/admin/IndexNow"));
const ContentClusterGenerator = lazy(() => import("./pages/admin/ContentClusterGenerator"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/faq/:slug" element={<FAQDetail />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/qa/:slug" element={<QADetail />} />
              <Route path="/topics" element={<TopicsIndex />} />
              <Route path="/topics/:slug" element={<TopicPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/articles" element={<ArticlesAdmin />} />
              <Route path="/admin/faqs" element={<FAQsAdmin />} />
              <Route path="/admin/topics" element={<Topics />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/authors" element={<Authors />} />
              <Route path="/admin/reviewers" element={<Reviewers />} />
              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/applications" element={<Applications />} />
              <Route path="/admin/citations" element={<Citations />} />
              <Route path="/admin/internal-links" element={<InternalLinks />} />
              <Route path="/admin/authority-sources" element={<AuthoritySources />} />
              <Route path="/admin/linking-engine" element={<LinkingEngine />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/cluster-generator" element={<ClusterGenerator />} />
              <Route path="/admin/qa-pages" element={<QAPagesAdmin />} />
              <Route path="/admin/system-check" element={<SystemCheck />} />
              <Route path="/admin/audit-log" element={<AuditLog />} />
              <Route path="/admin/chatbot-conversations" element={<ChatbotConversations />} />
              <Route path="/admin/citation-health" element={<CitationHealth />} />
              <Route path="/admin/indexnow" element={<IndexNow />} />
              <Route path="/admin/content-cluster-generator" element={<ContentClusterGenerator />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
