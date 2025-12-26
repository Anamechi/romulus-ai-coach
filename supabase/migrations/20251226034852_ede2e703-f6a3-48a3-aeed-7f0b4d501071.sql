-- Phase A: Q&A Pages + Additional tables for Priority 4-8

-- Create qa_pages table for Q&A system
CREATE TABLE public.qa_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  speakable_answer TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES public.reviewers(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on qa_pages
ALTER TABLE public.qa_pages ENABLE ROW LEVEL SECURITY;

-- RLS policies for qa_pages
CREATE POLICY "Admins can manage qa_pages"
ON public.qa_pages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view published qa_pages"
ON public.qa_pages
FOR SELECT
USING (status = 'published');

-- Create system_audit_logs table
CREATE TABLE public.system_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system_audit_logs
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for system_audit_logs
CREATE POLICY "Admins can view audit_logs"
ON public.system_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert audit_logs"
ON public.system_audit_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create content_revisions table
CREATE TABLE public.content_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  revision_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_summary TEXT,
  UNIQUE(entity_type, entity_id, revision_number)
);

-- Enable RLS on content_revisions
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_revisions
CREATE POLICY "Admins can manage content_revisions"
ON public.content_revisions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create chatbot_conversations table
CREATE TABLE public.chatbot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  converted_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chatbot_conversations
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- RLS policies for chatbot_conversations
CREATE POLICY "Admins can manage chatbot_conversations"
ON public.chatbot_conversations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert chatbot_conversations"
ON public.chatbot_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update own chatbot_conversations"
ON public.chatbot_conversations
FOR UPDATE
USING (true);

-- Create citation_health_checks table
CREATE TABLE public.citation_health_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citation_id UUID REFERENCES public.citations(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  http_status INTEGER,
  response_time_ms INTEGER,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  redirect_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(citation_id)
);

-- Enable RLS on citation_health_checks
ALTER TABLE public.citation_health_checks ENABLE ROW LEVEL SECURITY;

-- RLS policies for citation_health_checks
CREATE POLICY "Admins can manage citation_health_checks"
ON public.citation_health_checks
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view citation_health_checks"
ON public.citation_health_checks
FOR SELECT
USING (true);

-- Create discovered_domains table
CREATE TABLE public.discovered_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usage_count INTEGER DEFAULT 1,
  is_approved BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on discovered_domains
ALTER TABLE public.discovered_domains ENABLE ROW LEVEL SECURITY;

-- RLS policies for discovered_domains
CREATE POLICY "Admins can manage discovered_domains"
ON public.discovered_domains
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add update trigger for qa_pages
CREATE TRIGGER update_qa_pages_updated_at
BEFORE UPDATE ON public.qa_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for chatbot_conversations
CREATE TRIGGER update_chatbot_conversations_updated_at
BEFORE UPDATE ON public.chatbot_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for citation_health_checks
CREATE TRIGGER update_citation_health_checks_updated_at
BEFORE UPDATE ON public.citation_health_checks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for discovered_domains
CREATE TRIGGER update_discovered_domains_updated_at
BEFORE UPDATE ON public.discovered_domains
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_qa_pages_status ON public.qa_pages(status);
CREATE INDEX idx_qa_pages_topic_id ON public.qa_pages(topic_id);
CREATE INDEX idx_qa_pages_slug ON public.qa_pages(slug);
CREATE INDEX idx_system_audit_logs_entity ON public.system_audit_logs(entity_type, entity_id);
CREATE INDEX idx_system_audit_logs_created_at ON public.system_audit_logs(created_at DESC);
CREATE INDEX idx_content_revisions_entity ON public.content_revisions(entity_type, entity_id);
CREATE INDEX idx_chatbot_conversations_visitor ON public.chatbot_conversations(visitor_id);
CREATE INDEX idx_citation_health_checks_status ON public.citation_health_checks(status);