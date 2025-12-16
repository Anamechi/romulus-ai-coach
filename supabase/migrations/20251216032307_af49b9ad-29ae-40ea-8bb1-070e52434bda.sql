-- Create funnel_stage enum
CREATE TYPE public.funnel_stage AS ENUM ('TOFU', 'MOFU', 'BOFU');

-- Content Settings table (single row for master prompt)
CREATE TABLE public.content_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  master_content_prompt text NOT NULL DEFAULT '',
  site_name text DEFAULT 'Dr. Romulus MBA',
  tagline text DEFAULT '',
  feature_flags jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Authors table
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  credentials text,
  bio text,
  photo_url text,
  linkedin_url text,
  years_experience integer,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Reviewers table
CREATE TABLE public.reviewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  credentials text,
  bio text,
  photo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Categories table (with self-referencing for hierarchy)
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Topics table
CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  funnel_stage funnel_stage DEFAULT 'TOFU',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.content_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Content Settings policies (admin only)
CREATE POLICY "Admins can manage content_settings"
ON public.content_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authors policies
CREATE POLICY "Admins can manage authors"
ON public.authors FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active authors"
ON public.authors FOR SELECT
USING (is_active = true);

-- Reviewers policies
CREATE POLICY "Admins can manage reviewers"
ON public.reviewers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active reviewers"
ON public.reviewers FOR SELECT
USING (is_active = true);

-- Categories policies
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

-- Topics policies
CREATE POLICY "Admins can manage topics"
ON public.topics FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active topics"
ON public.topics FOR SELECT
USING (is_active = true);

-- Add updated_at triggers
CREATE TRIGGER update_content_settings_updated_at
BEFORE UPDATE ON public.content_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviewers_updated_at
BEFORE UPDATE ON public.reviewers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
BEFORE UPDATE ON public.topics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content_settings row
INSERT INTO public.content_settings (master_content_prompt, site_name, tagline)
VALUES (
  'You are Dr. Romulus, an MBA-level business coach specializing in automation and business growth. Write with authority, clarity, and actionable insights. Always demonstrate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). Structure content for both human readers and search engines.',
  'Dr. Romulus MBA',
  'Business Coaching & Automation Authority'
);