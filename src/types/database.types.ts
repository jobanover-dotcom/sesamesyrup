/**
 * Hand-maintained database schema types for the Supabase client.
 *
 * Kept aligned with `supabase/migrations/00000000000001_portfolio.sql`.
 * When the local Supabase stack is available (`supabase start`), regenerate
 * the authoritative version with `npm run supabase:types`.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: number
          title: string
          issuer: string
          issue_date: string | null
          credential_id: string | null
          verification_url: string | null
          file_url: string | null
          description: string
          is_published: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          issuer?: string
          issue_date?: string | null
          credential_id?: string | null
          verification_url?: string | null
          file_url?: string | null
          description?: string
          is_published?: boolean
          display_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['certificates']['Insert']>
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string
          display_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      profile: {
        Row: {
          id: number
          full_name: string
          professional_title: string
          bio: string
          profile_image: string | null
          location: string | null
          cv_url: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          full_name?: string
          professional_title?: string
          bio?: string
          profile_image?: string | null
          location?: string | null
          cv_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['profile']['Insert']>
      }
      project_images: {
        Row: {
          id: number
          project_id: number
          image_url: string
          alt_text: string
          display_order: number
        }
        Insert: {
          id?: number
          project_id: number
          image_url: string
          alt_text?: string
          display_order?: number
        }
        Update: Partial<Database['public']['Tables']['project_images']['Insert']>
      }
      project_technologies: {
        Row: {
          project_id: number
          technology_id: number
        }
        Insert: {
          project_id: number
          technology_id: number
        }
        Update: {
          project_id?: number
          technology_id?: number
        }
      }
      projects: {
        Row: {
          id: number
          title: string
          slug: string
          short_description: string
          description: string
          category_id: number | null
          cover_image: string | null
          live_url: string | null
          github_url: string | null
          figma_url: string | null
          other_url: string | null
          project_date: string | null
          is_featured: boolean
          is_published: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug?: string
          short_description?: string
          description?: string
          category_id?: number | null
          cover_image?: string | null
          live_url?: string | null
          github_url?: string | null
          figma_url?: string | null
          other_url?: string | null
          project_date?: string | null
          is_featured?: boolean
          is_published?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      social_links: {
        Row: {
          id: number
          platform: string
          url: string
          display_order: number
          is_visible: boolean
        }
        Insert: {
          id?: number
          platform: string
          url: string
          display_order?: number
          is_visible?: boolean
        }
        Update: Partial<Database['public']['Tables']['social_links']['Insert']>
      }
      site_settings: {
        Row: {
          id: number
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          id?: number
          setting_key: string
          setting_value?: string
        }
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
      technologies: {
        Row: {
          id: number
          name: string
          icon: string
          category: string
          proficiency: number | null
          description: string
          display_order: number
          is_visible: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          icon?: string
          category?: string
          proficiency?: number | null
          description?: string
          display_order?: number
          is_visible?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['technologies']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
