-- Create internal_links table for explicit content linking
CREATE TABLE public.internal_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('blog_post', 'faq')),
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('blog_post', 'faq')),
  target_id UUID NOT NULL,
  link_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_type, source_id, target_type, target_id)
);

-- Enable RLS
ALTER TABLE public.internal_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage internal_links" 
ON public.internal_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active internal_links" 
ON public.internal_links 
FOR SELECT 
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_internal_links_updated_at
BEFORE UPDATE ON public.internal_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();