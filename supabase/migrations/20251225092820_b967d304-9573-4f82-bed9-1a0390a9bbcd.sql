-- Add missing foreign keys so PostgREST embedded selects (author:authors(*), etc.) work
DO $$
BEGIN
  -- blog_posts.author_id -> authors.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_author_id_fkey'
  ) THEN
    ALTER TABLE public.blog_posts
      ADD CONSTRAINT blog_posts_author_id_fkey
      FOREIGN KEY (author_id)
      REFERENCES public.authors(id)
      ON DELETE SET NULL;
  END IF;

  -- blog_posts.reviewer_id -> reviewers.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_reviewer_id_fkey'
  ) THEN
    ALTER TABLE public.blog_posts
      ADD CONSTRAINT blog_posts_reviewer_id_fkey
      FOREIGN KEY (reviewer_id)
      REFERENCES public.reviewers(id)
      ON DELETE SET NULL;
  END IF;

  -- blog_posts.topic_id -> topics.id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_topic_id_fkey'
  ) THEN
    ALTER TABLE public.blog_posts
      ADD CONSTRAINT blog_posts_topic_id_fkey
      FOREIGN KEY (topic_id)
      REFERENCES public.topics(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_reviewer_id ON public.blog_posts(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_topic_id ON public.blog_posts(topic_id);
