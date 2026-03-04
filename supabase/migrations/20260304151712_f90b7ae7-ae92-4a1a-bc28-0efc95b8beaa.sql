-- =============================================
-- Phase 1: Client Portal Database Migration
-- =============================================

-- 1. Enums
CREATE TYPE public.client_tier AS ENUM ('self_directed', 'strategic_coaching', 'private_consulting');
CREATE TYPE public.program_phase AS ENUM ('clarity', 'systems', 'expansion');

-- 2. portal_clients
CREATE TABLE public.portal_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  tier client_tier DEFAULT 'self_directed',
  program_phase program_phase DEFAULT 'clarity',
  onboarding_status text DEFAULT 'pending',
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage portal_clients" ON public.portal_clients FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own portal_clients" ON public.portal_clients FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER update_portal_clients_updated_at BEFORE UPDATE ON public.portal_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. client_sessions
CREATE TABLE public.client_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  session_date timestamptz,
  recording_link text,
  recording_file_url text,
  session_notes text,
  action_items jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_sessions" ON public.client_sessions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_sessions" ON public.client_sessions FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

-- 4. client_worksheets
CREATE TABLE public.client_worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  worksheet_name text,
  responses_json jsonb DEFAULT '{}'::jsonb,
  completion_date timestamptz,
  pdf_download_link text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_worksheets" ON public.client_worksheets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_worksheets" ON public.client_worksheets FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can update own client_worksheets" ON public.client_worksheets FOR UPDATE TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

-- 5. client_wins
CREATE TABLE public.client_wins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  reflection_text text,
  application_text text,
  video_link text,
  video_file_url text,
  testimonial_permission boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_wins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_wins" ON public.client_wins FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_wins" ON public.client_wins FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can insert own client_wins" ON public.client_wins FOR INSERT TO authenticated WITH CHECK (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

-- 6. client_milestones
CREATE TABLE public.client_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  milestone_type text,
  description text,
  date date,
  video_link text,
  video_file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_milestones" ON public.client_milestones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_milestones" ON public.client_milestones FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can insert own client_milestones" ON public.client_milestones FOR INSERT TO authenticated WITH CHECK (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

-- 7. portal_resources
CREATE TABLE public.portal_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  category text,
  resource_link text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage portal_resources" ON public.portal_resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view portal_resources" ON public.portal_resources FOR SELECT TO authenticated USING (true);

-- 8. client_resource_access
CREATE TABLE public.client_resource_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.portal_resources(id) ON DELETE CASCADE,
  access_status text DEFAULT 'granted'
);
ALTER TABLE public.client_resource_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_resource_access" ON public.client_resource_access FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_resource_access" ON public.client_resource_access FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

-- 9. client_messages (realtime)
CREATE TABLE public.client_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  sender text NOT NULL,
  message_text text NOT NULL,
  attachment_file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_messages" ON public.client_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_messages" ON public.client_messages FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can insert own client_messages" ON public.client_messages FOR INSERT TO authenticated WITH CHECK (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages;

-- 10. portal_offers
CREATE TABLE public.portal_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  price numeric,
  link text,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage portal_offers" ON public.portal_offers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view portal_offers" ON public.portal_offers FOR SELECT TO authenticated USING (true);

-- 11. client_progress
CREATE TABLE public.client_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  authority_score integer DEFAULT 0,
  automation_score integer DEFAULT 0,
  revenue_score integer DEFAULT 0,
  acquisition_score integer DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_progress" ON public.client_progress FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_progress" ON public.client_progress FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

CREATE TRIGGER update_client_progress_updated_at BEFORE UPDATE ON public.client_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. client_onboarding
CREATE TABLE public.client_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.portal_clients(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz
);
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client_onboarding" ON public.client_onboarding FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own client_onboarding" ON public.client_onboarding FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can update own client_onboarding" ON public.client_onboarding FOR UPDATE TO authenticated USING (client_id IN (SELECT id FROM public.portal_clients WHERE user_id = auth.uid()));

-- 13. portal_integrations
CREATE TABLE public.portal_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL UNIQUE,
  api_key text,
  webhook_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage portal_integrations" ON public.portal_integrations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_portal_integrations_updated_at BEFORE UPDATE ON public.portal_integrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Storage bucket: client-files (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('client-files', 'client-files', false);

-- Storage RLS policies
CREATE POLICY "Admins full access to client-files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'client-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can read own files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Clients can upload own files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'client-files' AND (storage.foldername(name))[1] = auth.uid()::text);