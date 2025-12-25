-- Create enum for scan status
CREATE TYPE public.linking_scan_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Create enum for scan mode
CREATE TYPE public.linking_scan_mode AS ENUM ('report_only', 'auto_apply');

-- Create linking_scan_runs table (audit trail)
CREATE TABLE public.linking_scan_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status linking_scan_status NOT NULL DEFAULT 'pending',
  mode linking_scan_mode NOT NULL DEFAULT 'report_only',
  content_types TEXT[] NOT NULL DEFAULT ARRAY['blog_post'],
  topic_filter UUID,
  max_external_links INTEGER NOT NULL DEFAULT 2 CHECK (max_external_links >= 1 AND max_external_links <= 3),
  total_items INTEGER DEFAULT 0,
  processed_items INTEGER DEFAULT 0,
  error_message TEXT,
  run_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create linking_scan_items table (per-content results)
CREATE TABLE public.linking_scan_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_run_id UUID NOT NULL REFERENCES public.linking_scan_runs(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  content_title TEXT,
  status linking_scan_status NOT NULL DEFAULT 'pending',
  
  -- Suggested/applied links
  pillar_page_suggestion JSONB,
  related_post_suggestion JSONB,
  faq_suggestion JSONB,
  external_citations JSONB DEFAULT '[]'::jsonb,
  
  -- Results
  links_before INTEGER DEFAULT 0,
  links_after INTEGER DEFAULT 0,
  internal_links_added INTEGER DEFAULT 0,
  external_links_added INTEGER DEFAULT 0,
  
  -- Warnings
  warnings JSONB DEFAULT '[]'::jsonb,
  
  -- Applied flag
  applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.linking_scan_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linking_scan_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for scan runs
CREATE POLICY "Admins can manage linking_scan_runs" 
ON public.linking_scan_runs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for scan items
CREATE POLICY "Admins can manage linking_scan_items" 
ON public.linking_scan_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for scan items
CREATE TRIGGER update_linking_scan_items_updated_at
BEFORE UPDATE ON public.linking_scan_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_linking_scan_items_run_id ON public.linking_scan_items(scan_run_id);
CREATE INDEX idx_linking_scan_items_content ON public.linking_scan_items(content_type, content_id);