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
      authors: {
        Row: {
          bio: string | null
          created_at: string
          credentials: string | null
          full_name: string
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          photo_url: string | null
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
          linkedin_url?: string | null
          photo_url?: string | null
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
          linkedin_url?: string | null
          photo_url?: string | null
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
      content_settings: {
        Row: {
          created_at: string
          feature_flags: Json | null
          id: string
          master_content_prompt: string
          site_name: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_flags?: Json | null
          id?: string
          master_content_prompt?: string
          site_name?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_flags?: Json | null
          id?: string
          master_content_prompt?: string
          site_name?: string | null
          tagline?: string | null
          updated_at?: string
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
      topics: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          funnel_stage: Database["public"]["Enums"]["funnel_stage"] | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
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
      funnel_stage: "TOFU" | "MOFU" | "BOFU"
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
      funnel_stage: ["TOFU", "MOFU", "BOFU"],
    },
  },
} as const
