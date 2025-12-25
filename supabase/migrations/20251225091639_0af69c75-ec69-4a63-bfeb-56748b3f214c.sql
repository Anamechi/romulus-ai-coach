-- Drop existing restrictive policies on blog_posts
DROP POLICY IF EXISTS "Admins can manage posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;

-- Create PERMISSIVE policies (default behavior, using PERMISSIVE keyword for clarity)
CREATE POLICY "Admins can manage posts" 
ON blog_posts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view published posts" 
ON blog_posts 
FOR SELECT 
USING (published = true);

-- Fix FAQs policies the same way
DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;
DROP POLICY IF EXISTS "Anyone can view published faqs" ON faqs;

CREATE POLICY "Admins can manage faqs" 
ON faqs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view published faqs" 
ON faqs 
FOR SELECT 
USING (status = 'published');