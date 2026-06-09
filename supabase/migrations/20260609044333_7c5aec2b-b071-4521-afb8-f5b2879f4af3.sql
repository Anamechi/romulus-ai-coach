
-- Restrict portal_resources to clients with explicit access (via client_resource_access) or admins
DROP POLICY IF EXISTS "Authenticated can view portal_resources" ON public.portal_resources;
CREATE POLICY "Clients with access can view portal_resources"
ON public.portal_resources
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1
    FROM public.client_resource_access cra
    JOIN public.portal_clients pc ON pc.id = cra.client_id
    WHERE cra.resource_id = portal_resources.id
      AND pc.user_id = auth.uid()
  )
);

-- Restrict portal_offers to active portal clients or admins
DROP POLICY IF EXISTS "Authenticated can view portal_offers" ON public.portal_offers;
CREATE POLICY "Active clients can view portal_offers"
ON public.portal_offers
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.portal_clients pc
    WHERE pc.user_id = auth.uid()
  )
);

-- Restrict citation_health_checks to admins only (internal operational data)
DROP POLICY IF EXISTS "Anyone can view citation_health_checks" ON public.citation_health_checks;
