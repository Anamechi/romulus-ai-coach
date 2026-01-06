-- Create content_clusters table for AI cluster generation jobs
CREATE TABLE public.content_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_topic TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  primary_keyword TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'review', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

-- Create cluster_items table for generated content pieces
CREATE TABLE public.cluster_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES public.content_clusters(id) ON DELETE CASCADE,
  funnel_stage TEXT NOT NULL CHECK (funnel_stage IN ('TOFU', 'MOFU', 'BOFU')),
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'explainer', 'comparison', 'decision')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  speakable_answer TEXT,
  meta_title TEXT,
  meta_description TEXT,
  faqs JSONB DEFAULT '[]',
  internal_links JSONB DEFAULT '[]',
  external_citations JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'discarded', 'published')),
  published_content_type TEXT,
  published_content_id UUID,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluster_items ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for content_clusters
CREATE POLICY "Admins can manage content_clusters"
ON public.content_clusters
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only policies for cluster_items
CREATE POLICY "Admins can manage cluster_items"
ON public.cluster_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_content_clusters_updated_at
BEFORE UPDATE ON public.content_clusters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cluster_items_updated_at
BEFORE UPDATE ON public.cluster_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();