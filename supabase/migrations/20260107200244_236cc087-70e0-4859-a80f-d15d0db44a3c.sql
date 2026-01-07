-- Phase 1: Content Settings for validation thresholds
ALTER TABLE content_settings ADD COLUMN IF NOT EXISTS min_word_count INTEGER DEFAULT 300;
ALTER TABLE content_settings ADD COLUMN IF NOT EXISTS min_internal_links INTEGER DEFAULT 1;

-- Phase 3: Author Authority System - add slug and expertise fields
ALTER TABLE authors ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE authors ADD COLUMN IF NOT EXISTS knows_about TEXT[];

-- Phase 5: Topic-Cluster Binding - add speakable summary and parent topic
ALTER TABLE topics ADD COLUMN IF NOT EXISTS speakable_summary TEXT;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS parent_topic_id UUID REFERENCES topics(id);

-- Phase 5: Content Clusters - bind to topics
ALTER TABLE content_clusters ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES topics(id);

-- Seed Dr. Romulus slug if author exists
UPDATE authors SET slug = 'dr-deanna-romulus' WHERE full_name ILIKE '%romulus%' AND slug IS NULL;