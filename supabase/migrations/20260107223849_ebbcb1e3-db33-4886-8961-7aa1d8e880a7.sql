-- Add default audience and keyword columns to topics table for cluster generator auto-population
ALTER TABLE public.topics
ADD COLUMN default_target_audience TEXT,
ADD COLUMN default_primary_keyword TEXT;