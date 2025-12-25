import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import FAQDetail from "./pages/FAQDetail";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import Settings from "./pages/admin/Settings";
import Authors from "./pages/admin/Authors";
import Reviewers from "./pages/admin/Reviewers";
import Categories from "./pages/admin/Categories";
import Topics from "./pages/admin/Topics";
import FAQsAdmin from "./pages/admin/FAQs";
import ArticlesAdmin from "./pages/admin/Articles";
import Citations from "./pages/admin/Citations";
import InternalLinks from "./pages/admin/InternalLinks";
import ClusterGenerator from "./pages/admin/ClusterGenerator";
import Leads from "./pages/admin/Leads";
import Applications from "./pages/admin/Applications";
import AuthoritySources from "./pages/admin/AuthoritySources";
import LinkingEngine from "./pages/admin/LinkingEngine";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
