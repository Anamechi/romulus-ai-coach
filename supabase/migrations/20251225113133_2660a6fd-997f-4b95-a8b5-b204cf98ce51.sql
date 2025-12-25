-- Create enum for authority source categories
CREATE TYPE public.authority_source_category AS ENUM (
  'SEO_AEO',
  'AI_Automation',
  'Business_Leadership',
  'Data_Research',
  'Tech_Security',
  'Explainers'
);

-- Create enum for trust level
CREATE TYPE public.trust_level AS ENUM ('Primary', 'Secondary');

-- Create authority_sources table
CREATE TABLE public.authority_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  category authority_source_category NOT NULL,
  trust_level trust_level NOT NULL DEFAULT 'Secondary',
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.authority_sources ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage authority_sources" 
ON public.authority_sources 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active authority_sources" 
ON public.authority_sources 
FOR SELECT 
USING (is_active = true);

-- Update trigger
CREATE TRIGGER update_authority_sources_updated_at
BEFORE UPDATE ON public.authority_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data: SEO/AEO
INSERT INTO public.authority_sources (name, domain, category, trust_level, notes) VALUES
('Google Search Central', 'developers.google.com', 'SEO_AEO', 'Primary', 'Official Google documentation'),
('Search Engine Journal', 'searchenginejournal.com', 'SEO_AEO', 'Secondary', 'Industry news and guides'),
('Search Engine Land', 'searchengineland.com', 'SEO_AEO', 'Secondary', 'Industry news'),
('Moz', 'moz.com', 'SEO_AEO', 'Secondary', 'SEO tools and education'),
('Ahrefs', 'ahrefs.com', 'SEO_AEO', 'Secondary', 'SEO tools and research'),
('Semrush', 'semrush.com', 'SEO_AEO', 'Secondary', 'SEO tools and guides');

-- Seed data: AI/Automation
INSERT INTO public.authority_sources (name, domain, category, trust_level, notes) VALUES
('OpenAI', 'openai.com', 'AI_Automation', 'Primary', 'Official OpenAI documentation'),
('Google AI Blog', 'blog.google', 'AI_Automation', 'Primary', 'Official Google AI announcements'),
('MIT Technology Review', 'technologyreview.com', 'AI_Automation', 'Secondary', 'Tech journalism'),
('McKinsey', 'mckinsey.com', 'AI_Automation', 'Secondary', 'Business consulting research'),
('Harvard Business Review', 'hbr.org', 'AI_Automation', 'Secondary', 'Business research'),
('Zapier', 'zapier.com', 'AI_Automation', 'Secondary', 'Automation guides');

-- Seed data: Business/Leadership
INSERT INTO public.authority_sources (name, domain, category, trust_level, notes) VALUES
('U.S. Small Business Administration', 'sba.gov', 'Business_Leadership', 'Primary', 'Official government resource'),
('IRS', 'irs.gov', 'Business_Leadership', 'Primary', 'Official tax information'),
('Inc.', 'inc.com', 'Business_Leadership', 'Secondary', 'Business magazine'),
('Entrepreneur', 'entrepreneur.com', 'Business_Leadership', 'Secondary', 'Business magazine'),
('Forbes', 'forbes.com', 'Business_Leadership', 'Secondary', 'Editorial articles only');

-- Seed data: Data/Research
INSERT INTO public.authority_sources (name, domain, category, trust_level, notes) VALUES
('Pew Research Center', 'pewresearch.org', 'Data_Research', 'Primary', 'Non-partisan research'),
('Bureau of Labor Statistics', 'bls.gov', 'Data_Research', 'Primary', 'Official US statistics'),
('World Economic Forum', 'weforum.org', 'Data_Research', 'Primary', 'Global research'),
('OECD', 'oecd.org', 'Data_Research', 'Primary', 'International research'),
('Statista', 'statista.com', 'Data_Research', 'Secondary', 'Statistics portal');

-- Seed data: Tech/Security
INSERT INTO public.authority_sources (name, domain, category, trust_level, notes) VALUES
('Cloudflare', 'cloudflare.com', 'Tech_Security', 'Primary', 'Security and CDN provider'),
('Microsoft Learn', 'learn.microsoft.com', 'Tech_Security', 'Primary', 'Official Microsoft docs'),
('AWS', 'aws.amazon.com', 'Tech_Security', 'Primary', 'Official AWS docs');

-- Seed data: Explainers
INSERT INTO public.authority_sources (name, domain, category, trust_level, notes) VALUES
('Investopedia', 'investopedia.com', 'Explainers', 'Secondary', 'Financial definitions only'),
('TechTarget', 'techtarget.com', 'Explainers', 'Secondary', 'Tech definitions only'),
('Wikipedia', 'wikipedia.org', 'Explainers', 'Secondary', 'Definitions only, use sparingly');