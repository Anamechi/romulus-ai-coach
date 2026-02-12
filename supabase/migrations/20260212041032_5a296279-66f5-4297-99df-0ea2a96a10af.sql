
-- Content translations table for multi-language support
CREATE TABLE public.content_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL,
  source_type TEXT NOT NULL, -- 'blog_post', 'qa_page', 'faq'
  language TEXT NOT NULL DEFAULT 'es',
  group_id UUID, -- links back to cluster_id for cluster-generated content
  title TEXT,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  speakable_summary TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  hreflang_tag TEXT, -- e.g. 'es', 'fr'
  canonical_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_id, source_type, language)
);

-- Enable RLS
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admins can manage content_translations"
ON public.content_translations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can view published translations
CREATE POLICY "Anyone can view published translations"
ON public.content_translations
FOR SELECT
USING (status = 'published');

-- Add updated_at trigger
CREATE TRIGGER update_content_translations_updated_at
BEFORE UPDATE ON public.content_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Image health tracking table
CREATE TABLE public.image_health_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  has_json_ld BOOLEAN DEFAULT false,
  is_duplicate BOOLEAN DEFAULT false,
  duplicate_of TEXT,
  status TEXT DEFAULT 'pending', -- 'healthy', 'missing_alt', 'broken', 'duplicate'
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.image_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage image_health_checks"
ON public.image_health_checks
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_image_health_checks_updated_at
BEFORE UPDATE ON public.image_health_checks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
