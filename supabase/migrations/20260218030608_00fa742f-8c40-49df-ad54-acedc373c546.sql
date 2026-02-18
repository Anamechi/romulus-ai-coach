
-- Create qa_page_citations join table (mirrors blog_post_citations and faq_citations)
CREATE TABLE public.qa_page_citations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qa_page_id UUID NOT NULL REFERENCES public.qa_pages(id) ON DELETE CASCADE,
  citation_id UUID NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(qa_page_id, citation_id)
);

-- Enable RLS
ALTER TABLE public.qa_page_citations ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage qa_page_citations"
ON public.qa_page_citations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read
CREATE POLICY "Anyone can view qa_page_citations"
ON public.qa_page_citations
FOR SELECT
USING (true);
