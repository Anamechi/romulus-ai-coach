
-- 1. Storage: restrict blog-images writes to admins; drop broad SELECT (listing) policy
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2. user_roles: explicit restrictive policies to prevent self-escalation
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Revoke execute on internal trigger helper functions from API roles
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
