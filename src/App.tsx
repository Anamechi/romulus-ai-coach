import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import Settings from "./pages/admin/Settings";
import Authors from "./pages/admin/Authors";
import Reviewers from "./pages/admin/Reviewers";
import Categories from "./pages/admin/Categories";
import Topics from "./pages/admin/Topics";

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/articles" element={<AdminPlaceholder />} />
            <Route path="/admin/articles/new" element={<AdminPlaceholder />} />
            <Route path="/admin/articles/:id/edit" element={<AdminPlaceholder />} />
            <Route path="/admin/faqs" element={<AdminPlaceholder />} />
            <Route path="/admin/faqs/new" element={<AdminPlaceholder />} />
            <Route path="/admin/faqs/:id/edit" element={<AdminPlaceholder />} />
            <Route path="/admin/topics" element={<Topics />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/authors" element={<Authors />} />
            <Route path="/admin/reviewers" element={<Reviewers />} />
            <Route path="/admin/leads" element={<AdminPlaceholder />} />
            <Route path="/admin/applications" element={<AdminPlaceholder />} />
            <Route path="/admin/citations" element={<AdminPlaceholder />} />
            <Route path="/admin/system-check" element={<AdminPlaceholder />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/cluster-generator" element={<AdminPlaceholder />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
