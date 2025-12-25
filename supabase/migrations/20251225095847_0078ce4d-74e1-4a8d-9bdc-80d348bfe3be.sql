-- Fix blog_posts.author_id foreign key to reference public.authors (not auth.users)
DO $$
BEGIN
  -- Drop incorrect FK if present
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'blog_posts_author_id_fkey'
      AND n.nspname = 'public'
      AND t.relname = 'blog_posts'
  ) THEN
    ALTER TABLE public.blog_posts DROP CONSTRAINT blog_posts_author_id_fkey;
  END IF;

  -- Add correct FK to authors.id
  ALTER TABLE public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey
    FOREIGN KEY (author_id)
    REFERENCES public.authors(id)
    ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN
    -- already exists
    NULL;
END
$$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
