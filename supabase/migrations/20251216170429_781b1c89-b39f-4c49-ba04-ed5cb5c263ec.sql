-- Create citations table for E-E-A-T credibility
CREATE TABLE public.citations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  source_name TEXT,
  author_name TEXT,
  published_date DATE,
  domain_authority INTEGER,
  excerpt TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for blog post citations
CREATE TABLE public.blog_post_citations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  citation_id UUID NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(blog_post_id, citation_id)
);

-- Create junction table for FAQ citations
CREATE TABLE public.faq_citations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
  citation_id UUID NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faq_id, citation_id)
);

-- Enable RLS on all tables
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_citations ENABLE ROW LEVEL SECURITY;

-- Citations policies
CREATE POLICY "Admins can manage citations" ON public.citations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active citations" ON public.citations
  FOR SELECT USING (is_active = true);

-- Blog post citations policies
CREATE POLICY "Admins can manage blog_post_citations" ON public.blog_post_citations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view blog_post_citations" ON public.blog_post_citations
  FOR SELECT USING (true);

-- FAQ citations policies
CREATE POLICY "Admins can manage faq_citations" ON public.faq_citations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view faq_citations" ON public.faq_citations
  FOR SELECT USING (true);

-- Add updated_at trigger for citations
CREATE TRIGGER update_citations_updated_at
  BEFORE UPDATE ON public.citations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_blog_post_citations_post ON public.blog_post_citations(blog_post_id);
CREATE INDEX idx_blog_post_citations_citation ON public.blog_post_citations(citation_id);
CREATE INDEX idx_faq_citations_faq ON public.faq_citations(faq_id);
CREATE INDEX idx_faq_citations_citation ON public.faq_citations(citation_id);
CREATE INDEX idx_citations_domain_authority ON public.citations(domain_authority DESC);