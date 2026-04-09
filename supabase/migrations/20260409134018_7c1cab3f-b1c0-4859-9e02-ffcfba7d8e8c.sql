CREATE POLICY "Allow public lead inserts"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);