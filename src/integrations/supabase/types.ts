export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          business_name: string | null
          business_stage: string | null
          challenges: string | null
          created_at: string
          email: string
          full_name: string
          goals: string | null
          how_found_us: string | null
          id: string
          notes: string | null
          phone: string | null
          revenue_range: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          business_stage?: string | null
          challenges?: string | null
          created_at?: string
          email: string
          full_name: string
          goals?: string | null
          how_found_us?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          revenue_range?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          business_stage?: string | null
          challenges?: string | null
          created_at?: string
          email?: string
          full_name?: string
          goals?: string | null
          how_found_us?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          revenue_range?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      authority_sources: {
        Row: {
          category: Database["public"]["Enums"]["authority_source_category"]
          created_at: string
          domain: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          trust_level: Database["public"]["Enums"]["trust_level"]
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["authority_source_category"]
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          trust_level?: Database["public"]["Enums"]["trust_level"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["authority_source_category"]
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          trust_level?: Database["public"]["Enums"]["trust_level"]
          updated_at?: string
        }
        Relationships: []
      }
      authors: {
        Row: {
          bio: string | null
          created_at: string
          credentials: string | null
          full_name: string
          id: string
          is_active: boolean | null
          knows_about: string[] | null
          linkedin_url: string | null
          photo_url: string | null
          slug: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          credentials?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          knows_about?: string[] | null
          linkedin_url?: string | null
          photo_url?: string | null
          slug?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          credentials?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          knows_about?: string[] | null
          linkedin_url?: string | null
          photo_url?: string | null
          slug?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      blog_post_citations: {
        Row: {
          blog_post_id: string
          citation_id: string
          created_at: string
          id: string
          sort_order: number | null
        }
        Insert: {
          blog_post_id: string
          citation_id: string
          created_at?: string
          id?: string
          sort_order?: number | null
        }
        Update: {
          blog_post_id?: string
          citation_id?: string
          created_at?: string
          id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_citations_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_citations_citation_id_fkey"
            columns: ["citation_id"]
            isOneToOne: false
            referencedRelation: "citations"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          published_at: string | null
          reading_time_minutes: number | null
          reviewer_id: string | null
          slug: string
          speakable_summary: string | null
          title: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          reading_time_minutes?: number | null
          reviewer_id?: string | null
          slug: string
          speakable_summary?: string | null
          title: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          reading_time_minutes?: number | null
          reviewer_id?: string | null
          slug?: string
          speakable_summary?: string | null
          title?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "reviewers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_conversations: {
        Row: {
          converted_to: string | null
          created_at: string
          id: string
          lead_id: string | null
          messages: Json
          status: string
          updated_at: string
          visitor_id: string
        }
        Insert: {
          converted_to?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          messages?: Json
          status?: string
          updated_at?: string
          visitor_id: string
        }
        Update: {
          converted_to?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          messages?: Json
          status?: string
          updated_at?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      citation_health_checks: {
        Row: {
          citation_id: string
          created_at: string
          error_message: string | null
          http_status: number | null
          id: string
          last_checked_at: string | null
          redirect_url: string | null
          response_time_ms: number | null
          status: string
          updated_at: string
        }
        Insert: {
          citation_id: string
          created_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          last_checked_at?: string | null
          redirect_url?: string | null
          response_time_ms?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          citation_id?: string
          created_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          last_checked_at?: string | null
          redirect_url?: string | null
          response_time_ms?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "citation_health_checks_citation_id_fkey"
            columns: ["citation_id"]
            isOneToOne: true
            referencedRelation: "citations"
            referencedColumns: ["id"]
          },
        ]
      }
      citations: {
        Row: {
          author_name: string | null
          created_at: string
          domain_authority: number | null
          excerpt: string | null
          id: string
          is_active: boolean | null
          published_date: string | null
          source_name: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          domain_authority?: number | null
          excerpt?: string | null
          id?: string
          is_active?: boolean | null
          published_date?: string | null
          source_name?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          domain_authority?: number | null
          excerpt?: string | null
          id?: string
          is_active?: boolean | null
          published_date?: string | null
          source_name?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      cluster_items: {
        Row: {
          cluster_id: string
          content: string | null
          content_type: string
          created_at: string | null
          external_citations: Json | null
          faqs: Json | null
          funnel_stage: string
          id: string
          internal_links: Json | null
          meta_description: string | null
          meta_title: string | null
          published_content_id: string | null
          published_content_type: string | null
          slug: string
          sort_order: number | null
          speakable_answer: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cluster_id: string
          content?: string | null
          content_type: string
          created_at?: string | null
          external_citations?: Json | null
          faqs?: Json | null
          funnel_stage: string
          id?: string
          internal_links?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          published_content_id?: string | null
          published_content_type?: string | null
          slug: string
          sort_order?: number | null
          speakable_answer?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cluster_id?: string
          content?: string | null
          content_type?: string
          created_at?: string | null
          external_citations?: Json | null
          faqs?: Json | null
          funnel_stage?: string
          id?: string
          internal_links?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          published_content_id?: string | null
          published_content_type?: string | null
          slug?: string
          sort_order?: number | null
          speakable_answer?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cluster_items_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "content_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      content_clusters: {
        Row: {
          cluster_topic: string
          created_at: string | null
          created_by: string | null
          error_message: string | null
          id: string
          language: string | null
          primary_keyword: string
          status: string | null
          target_audience: string
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          cluster_topic: string
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          language?: string | null
          primary_keyword: string
          status?: string | null
          target_audience: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cluster_topic?: string
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          language?: string | null
          primary_keyword?: string
          status?: string | null
          target_audience?: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_clusters_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          change_summary: string | null
          content_snapshot: Json
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          revision_number: number
        }
        Insert: {
          change_summary?: string | null
          content_snapshot: Json
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          revision_number: number
        }
        Update: {
          change_summary?: string | null
          content_snapshot?: Json
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          revision_number?: number
        }
        Relationships: []
      }
      content_settings: {
        Row: {
          created_at: string
          feature_flags: Json | null
          id: string
          master_content_prompt: string
          min_internal_links: number | null
          min_word_count: number | null
          site_name: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_flags?: Json | null
          id?: string
          master_content_prompt?: string
          min_internal_links?: number | null
          min_word_count?: number | null
          site_name?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_flags?: Json | null
          id?: string
          master_content_prompt?: string
          min_internal_links?: number | null
          min_word_count?: number | null
          site_name?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      discovered_domains: {
        Row: {
          created_at: string
          domain: string
          first_seen_at: string
          id: string
          is_approved: boolean | null
          is_blocked: boolean | null
          notes: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          domain: string
          first_seen_at?: string
          id?: string
          is_approved?: boolean | null
          is_blocked?: boolean | null
          notes?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          domain?: string
          first_seen_at?: string
          id?: string
          is_approved?: boolean | null
          is_blocked?: boolean | null
          notes?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      faq_citations: {
        Row: {
          citation_id: string
          created_at: string
          faq_id: string
          id: string
          sort_order: number | null
        }
        Insert: {
          citation_id: string
          created_at?: string
          faq_id: string
          id?: string
          sort_order?: number | null
        }
        Update: {
          citation_id?: string
          created_at?: string
          faq_id?: string
          id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_citations_citation_id_fkey"
            columns: ["citation_id"]
            isOneToOne: false
            referencedRelation: "citations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faq_citations_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          author_id: string | null
          created_at: string
          featured: boolean | null
          id: string
          question: string
          reviewer_id: string | null
          slug: string
          sort_order: number | null
          speakable_answer: string | null
          status: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          author_id?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          question: string
          reviewer_id?: string | null
          slug: string
          sort_order?: number | null
          speakable_answer?: string | null
          status?: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          author_id?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          question?: string
          reviewer_id?: string | null
          slug?: string
          sort_order?: number | null
          speakable_answer?: string | null
          status?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "reviewers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_links: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          link_text: string | null
          sort_order: number | null
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          sort_order?: number | null
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          sort_order?: number | null
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      linking_scan_items: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          content_id: string
          content_title: string | null
          content_type: string
          created_at: string
          external_citations: Json | null
          external_links_added: number | null
          faq_suggestion: Json | null
          id: string
          internal_links_added: number | null
          links_after: number | null
          links_before: number | null
          pillar_page_suggestion: Json | null
          related_post_suggestion: Json | null
          scan_run_id: string
          status: Database["public"]["Enums"]["linking_scan_status"]
          updated_at: string
          warnings: Json | null
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          content_id: string
          content_title?: string | null
          content_type: string
          created_at?: string
          external_citations?: Json | null
          external_links_added?: number | null
          faq_suggestion?: Json | null
          id?: string
          internal_links_added?: number | null
          links_after?: number | null
          links_before?: number | null
          pillar_page_suggestion?: Json | null
          related_post_suggestion?: Json | null
          scan_run_id: string
          status?: Database["public"]["Enums"]["linking_scan_status"]
          updated_at?: string
          warnings?: Json | null
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          content_id?: string
          content_title?: string | null
          content_type?: string
          created_at?: string
          external_citations?: Json | null
          external_links_added?: number | null
          faq_suggestion?: Json | null
          id?: string
          internal_links_added?: number | null
          links_after?: number | null
          links_before?: number | null
          pillar_page_suggestion?: Json | null
          related_post_suggestion?: Json | null
          scan_run_id?: string
          status?: Database["public"]["Enums"]["linking_scan_status"]
          updated_at?: string
          warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "linking_scan_items_scan_run_id_fkey"
            columns: ["scan_run_id"]
            isOneToOne: false
            referencedRelation: "linking_scan_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      linking_scan_runs: {
        Row: {
          completed_at: string | null
          content_types: string[]
          created_at: string
          error_message: string | null
          id: string
          max_external_links: number
          mode: Database["public"]["Enums"]["linking_scan_mode"]
          processed_items: number | null
          run_by: string | null
          started_at: string
          status: Database["public"]["Enums"]["linking_scan_status"]
          topic_filter: string | null
          total_items: number | null
        }
        Insert: {
          completed_at?: string | null
          content_types?: string[]
          created_at?: string
          error_message?: string | null
          id?: string
          max_external_links?: number
          mode?: Database["public"]["Enums"]["linking_scan_mode"]
          processed_items?: number | null
          run_by?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["linking_scan_status"]
          topic_filter?: string | null
          total_items?: number | null
        }
        Update: {
          completed_at?: string | null
          content_types?: string[]
          created_at?: string
          error_message?: string | null
          id?: string
          max_external_links?: number
          mode?: Database["public"]["Enums"]["linking_scan_mode"]
          processed_items?: number | null
          run_by?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["linking_scan_status"]
          topic_filter?: string | null
          total_items?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      qa_pages: {
        Row: {
          answer: string
          author_id: string | null
          created_at: string
          featured: boolean | null
          id: string
          meta_description: string | null
          meta_title: string | null
          question: string
          reviewer_id: string | null
          slug: string
          sort_order: number | null
          speakable_answer: string | null
          status: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          author_id?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          question: string
          reviewer_id?: string | null
          slug: string
          sort_order?: number | null
          speakable_answer?: string | null
          status?: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          author_id?: string | null
          created_at?: string
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          question?: string
          reviewer_id?: string | null
          slug?: string
          sort_order?: number | null
          speakable_answer?: string | null
          status?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_pages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_pages_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "reviewers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_pages_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewers: {
        Row: {
          bio: string | null
          created_at: string
          credentials: string | null
          full_name: string
          id: string
          is_active: boolean | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          credentials?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          credentials?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_title: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_title?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_title?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          category_id: string | null
          created_at: string
          default_primary_keyword: string | null
          default_target_audience: string | null
          description: string | null
          funnel_stage: Database["public"]["Enums"]["funnel_stage"] | null
          id: string
          is_active: boolean | null
          name: string
          parent_topic_id: string | null
          slug: string
          sort_order: number | null
          speakable_summary: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          default_primary_keyword?: string | null
          default_target_audience?: string | null
          description?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_topic_id?: string | null
          slug: string
          sort_order?: number | null
          speakable_summary?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          default_primary_keyword?: string | null
          default_target_audience?: string | null
          description?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_topic_id?: string | null
          slug?: string
          sort_order?: number | null
          speakable_summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_parent_topic_id_fkey"
            columns: ["parent_topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      authority_source_category:
        | "SEO_AEO"
        | "AI_Automation"
        | "Business_Leadership"
        | "Data_Research"
        | "Tech_Security"
        | "Explainers"
      funnel_stage: "TOFU" | "MOFU" | "BOFU"
      linking_scan_mode: "report_only" | "auto_apply"
      linking_scan_status: "pending" | "running" | "completed" | "failed"
      trust_level: "Primary" | "Secondary"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      authority_source_category: [
        "SEO_AEO",
        "AI_Automation",
        "Business_Leadership",
        "Data_Research",
        "Tech_Security",
        "Explainers",
      ],
      funnel_stage: ["TOFU", "MOFU", "BOFU"],
      linking_scan_mode: ["report_only", "auto_apply"],
      linking_scan_status: ["pending", "running", "completed", "failed"],
      trust_level: ["Primary", "Secondary"],
    },
  },
} as const
