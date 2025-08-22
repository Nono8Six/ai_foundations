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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievement_definitions: {
        Row: {
          achievement_key: string
          category: string
          code: string
          condition_params: Json | null
          condition_type: string
          cooldown_hours: number | null
          created_at: string | null
          description: string
          effective_from: string | null
          effective_to: string | null
          icon: string
          id: string
          is_active: boolean | null
          is_repeatable: boolean | null
          scope: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
          validity: unknown | null
          version: number
          xp_reward: number
        }
        Insert: {
          achievement_key: string
          category?: string
          code: string
          condition_params?: Json | null
          condition_type: string
          cooldown_hours?: number | null
          created_at?: string | null
          description: string
          effective_from?: string | null
          effective_to?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          scope?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
          validity?: unknown | null
          version: number
          xp_reward?: number
        }
        Update: {
          achievement_key?: string
          category?: string
          code?: string
          condition_params?: Json | null
          condition_type?: string
          cooldown_hours?: number | null
          created_at?: string | null
          description?: string
          effective_from?: string | null
          effective_to?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          scope?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          validity?: unknown | null
          version?: number
          xp_reward?: number
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_activity_log_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_activity_log_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_xp"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          discount_percent: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_percent: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_percent?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_published: boolean | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json | null
          created_at: string | null
          duration: number | null
          id: string
          is_published: boolean | null
          lesson_order: number
          module_id: string
          resources: Json | null
          text_content: string | null
          title: string
          transcript: string | null
          type: Database["public"]["Enums"]["lesson_type"] | null
          updated_at: string | null
          video_url: string | null
          xp_reward: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          duration?: number | null
          id?: string
          is_published?: boolean | null
          lesson_order: number
          module_id: string
          resources?: Json | null
          text_content?: string | null
          title: string
          transcript?: string | null
          type?: Database["public"]["Enums"]["lesson_type"] | null
          updated_at?: string | null
          video_url?: string | null
          xp_reward?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          duration?: number | null
          id?: string
          is_published?: boolean | null
          lesson_order?: number
          module_id?: string
          resources?: Json | null
          text_content?: string | null
          title?: string
          transcript?: string | null
          type?: Database["public"]["Enums"]["lesson_type"] | null
          updated_at?: string | null
          video_url?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      level_definitions: {
        Row: {
          badge_color: string | null
          badge_icon: string | null
          created_at: string | null
          description: string | null
          level: number
          rewards: Json | null
          title: string
          updated_at: string | null
          xp_for_next: number
          xp_required: number
        }
        Insert: {
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string | null
          description?: string | null
          level: number
          rewards?: Json | null
          title?: string
          updated_at?: string | null
          xp_for_next: number
          xp_required: number
        }
        Update: {
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string | null
          description?: string | null
          level?: number
          rewards?: Json | null
          title?: string
          updated_at?: string | null
          xp_for_next?: number
          xp_required?: number
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          module_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          module_order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          module_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "user_course_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          current_streak: number | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          last_completed_at: string | null
          last_xp_event_at: string | null
          level: number
          phone: string | null
          profession: string | null
          profile_completion_history: Json | null
          updated_at: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          current_streak?: number | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          last_completed_at?: string | null
          last_xp_event_at?: string | null
          level?: number
          phone?: string | null
          profession?: string | null
          profile_completion_history?: Json | null
          updated_at?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          current_streak?: number | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_completed_at?: string | null
          last_xp_event_at?: string | null
          level?: number
          phone?: string | null
          profession?: string | null
          profile_completion_history?: Json | null
          updated_at?: string | null
          xp?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          achievement_name: string
          achievement_type: string
          achievement_version: number | null
          details: Json | null
          id: string
          scope: string | null
          unlocked_at: string | null
          user_id: string
          xp_reward: number
        }
        Insert: {
          achievement_id: string
          achievement_name: string
          achievement_type: string
          achievement_version?: number | null
          details?: Json | null
          id?: string
          scope?: string | null
          unlocked_at?: string | null
          user_id: string
          xp_reward?: number
        }
        Update: {
          achievement_id?: string
          achievement_name?: string
          achievement_type?: string
          achievement_version?: number | null
          details?: Json | null
          id?: string
          scope?: string | null
          unlocked_at?: string | null
          user_id?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_xp"
            referencedColumns: ["id"]
          },
        ]
      }
      user_login_sessions: {
        Row: {
          actions_performed: number | null
          created_at: string | null
          device_info: Json | null
          id: string
          ip_address: unknown | null
          pages_visited: string[] | null
          session_end: string | null
          session_start: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
          xp_gained_in_session: number | null
        }
        Insert: {
          actions_performed?: number | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          pages_visited?: string[] | null
          session_end?: string | null
          session_start?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
          xp_gained_in_session?: number | null
        }
        Update: {
          actions_performed?: number | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          pages_visited?: string[] | null
          session_end?: string | null
          session_start?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
          xp_gained_in_session?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_login_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_login_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_xp"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          lesson_id: string
          position: Json | null
          selected_text: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          lesson_id: string
          position?: Json | null
          selected_text?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          lesson_id?: string
          position?: Json | null
          selected_text?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_progress_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_progress_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_xp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          device_info: Json | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          pages_visited: string[] | null
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          device_info?: Json | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          pages_visited?: string[] | null
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          device_info?: Json | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          pages_visited?: string[] | null
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          cookie_preferences: Json | null
          created_at: string | null
          id: string
          learning_preferences: Json | null
          notification_settings: Json | null
          privacy_settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cookie_preferences?: Json | null
          created_at?: string | null
          id?: string
          learning_preferences?: Json | null
          notification_settings?: Json | null
          privacy_settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cookie_preferences?: Json | null
          created_at?: string | null
          id?: string
          learning_preferences?: Json | null
          notification_settings?: Json | null
          privacy_settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_settings_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_settings_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles_with_xp"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          action_type: string
          created_at: string
          id: string
          idempotency_key: string
          level_after: number | null
          level_before: number | null
          metadata: Json | null
          reference_id: string | null
          source_id: string | null
          source_type: string
          source_version: string | null
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          idempotency_key: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          source_id?: string | null
          source_type: string
          source_version?: string | null
          user_id: string
          xp_after?: number
          xp_before?: number
          xp_delta: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          idempotency_key?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          source_id?: string | null
          source_type?: string
          source_version?: string | null
          user_id?: string
          xp_after?: number
          xp_before?: number
          xp_delta?: number
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_xp"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_sources: {
        Row: {
          action_type: string
          cooldown_minutes: number | null
          created_at: string | null
          deprecated_reason: string | null
          description: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_active: boolean | null
          is_repeatable: boolean | null
          max_per_day: number | null
          source_type: string
          title: string | null
          validity: unknown | null
          version: number
          xp_value: number
        }
        Insert: {
          action_type: string
          cooldown_minutes?: number | null
          created_at?: string | null
          deprecated_reason?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_per_day?: number | null
          source_type: string
          title?: string | null
          validity?: unknown | null
          version: number
          xp_value: number
        }
        Update: {
          action_type?: string
          cooldown_minutes?: number | null
          created_at?: string | null
          deprecated_reason?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_per_day?: number | null
          source_type?: string
          title?: string | null
          validity?: unknown | null
          version?: number
          xp_value?: number
        }
        Relationships: []
      }
    }
    Views: {
      admin_xp_management: {
        Row: {
          action_type: string | null
          cooldown_minutes: number | null
          full_key: string | null
          is_active: boolean | null
          is_repeatable: boolean | null
          last_used_at: string | null
          max_per_day: number | null
          source_type: string | null
          title: string | null
          type: string | null
          usage_count: number | null
          xp_value: number | null
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          category: string | null
          completed_lessons: number | null
          completion_percentage: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string | null
          is_published: boolean | null
          last_activity_at: string | null
          progress: Json | null
          slug: string | null
          thumbnail_url: string | null
          title: string | null
          total_lessons: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_profiles_with_xp: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          current_streak: number | null
          email: string | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          last_completed_at: string | null
          last_xp_event_at: string | null
          level: number | null
          level_title: string | null
          phone: string | null
          profession: string | null
          profile_completion_history: Json | null
          updated_at: string | null
          xp: number | null
          xp_for_next_level: number | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          current_streak?: number | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: boolean | null
          last_completed_at?: string | null
          last_xp_event_at?: string | null
          level?: number | null
          level_title?: never
          phone?: string | null
          profession?: string | null
          profile_completion_history?: Json | null
          updated_at?: string | null
          xp?: number | null
          xp_for_next_level?: never
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          current_streak?: number | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: boolean | null
          last_completed_at?: string | null
          last_xp_event_at?: string | null
          level?: number | null
          level_title?: never
          phone?: string | null
          profession?: string | null
          profile_completion_history?: Json | null
          updated_at?: string | null
          xp?: number | null
          xp_for_next_level?: never
        }
        Relationships: []
      }
    }
    Functions: {
      admin_compensate_achievement: {
        Args: {
          p_code: string
          p_idempotency_key: string
          p_reason: string
          p_version: number
        }
        Returns: {
          affected_users: number
          total_events: number
          total_xp_reverted: number
        }[]
      }
      compute_level: {
        Args: { xp_total: number }
        Returns: number
      }
      compute_level_info: {
        Args: { p_xp_total: number }
        Returns: {
          level: number
          xp_threshold: number
          xp_to_next: number
        }[]
      }
      create_profile_completion_achievements: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      credit_xp: {
        Args: {
          p_idempotency_key: string
          p_metadata?: Json
          p_reference_id?: string
          p_source_ref: string
          p_source_version?: string
          p_user_id: string
          p_xp_delta: number
        }
        Returns: Json
      }
      credit_xp_safe: {
        Args: {
          p_idempotency_key: string
          p_metadata?: Json
          p_reference_id?: string
          p_source_ref: string
          p_source_version?: string
          p_user_id: string
          p_xp_delta: number
        }
        Returns: Json
      }
      email_exists: {
        Args: { search_email: string }
        Returns: boolean
      }
      end_user_session: {
        Args: { session_id: string }
        Returns: boolean
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      get_active_xp_sources: {
        Args: { p_at?: string }
        Returns: {
          action_type: string
          cooldown_minutes: number
          description: string
          effective_from: string
          effective_to: string
          is_repeatable: boolean
          max_per_day: number
          source_id: string
          source_type: string
          title: string
          version: number
          xp_value: number
        }[]
      }
      get_user_course_progress: {
        Args: { course_id_param: string; user_id_param: string }
        Returns: {
          completed_lessons: number
          completion_percentage: number
          course_id: string
          total_lessons: number
        }[]
      }
      get_user_lesson_lock_keys: {
        Args: { p_lesson_id: string; p_user_id: string }
        Returns: {
          h1: number
          h2: number
        }[]
      }
      get_user_lock_keys: {
        Args: { p_user_id: string }
        Returns: {
          h1: number
          h2: number
        }[]
      }
      get_user_settings: {
        Args: { user_id?: string }
        Returns: {
          learning_preferences: Json
          notification_settings: Json
          privacy_settings: Json
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      recalculate_user_xp_after_achievement_removal: {
        Args: { p_achievement_key: string; p_reason?: string }
        Returns: {
          new_level: number
          new_total_xp: number
          user_id: string
          xp_removed: number
        }[]
      }
      recalculate_user_xp_after_source_removal: {
        Args: {
          p_action_type: string
          p_reason?: string
          p_source_type: string
        }
        Returns: {
          new_level: number
          new_total_xp: number
          user_id: string
          xp_removed: number
        }[]
      }
      simple_test: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      start_user_session: {
        Args: {
          session_ip?: unknown
          session_user_agent?: string
          target_user_id: string
        }
        Returns: string
      }
      sync_achievement_xp: {
        Args: { target_user_id?: string }
        Returns: {
          achievement_key: string
          sync_status: string
          user_id: string
          xp_corrected: number
        }[]
      }
      test_concurrent_credit_xp: {
        Args: Record<PropertyKey, never>
        Returns: {
          error_message: string
          event_id: string
          operation_order: number
          session_id: number
          success: boolean
          xp_after: number
          xp_before: number
        }[]
      }
      test_function: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      unlock_achievement: {
        Args: {
          p_code: string
          p_idempotency_key: string
          p_reference_id?: string
          p_scope?: string
          p_user_id: string
          p_version: number
        }
        Returns: {
          event_id: string
          level_after: number
          level_before: number
          ua_id: string
          xp_after: number
          xp_before: number
        }[]
      }
      unlock_achievement_safe: {
        Args: {
          p_code: string
          p_idempotency_key: string
          p_reference_id?: string
          p_scope?: string
          p_user_id: string
          p_version: number
        }
        Returns: {
          event_id: string
          level_after: number
          level_before: number
          ua_id: string
          xp_after: number
          xp_before: number
        }[]
      }
      update_user_profile: {
        Args: { p_profile_data: Json; p_user_id: string }
        Returns: {
          avatar_url: string
          company: string
          created_at: string
          current_streak: number
          email: string
          full_name: string
          id: string
          is_admin: boolean
          last_completed_at: string
          level: number
          phone: string
          profession: string
          updated_at: string
          xp: number
        }[]
      }
      update_user_settings: {
        Args: { settings_data: Json; user_id?: string }
        Returns: {
          learning_preferences: Json
          notification_settings: Json
          privacy_settings: Json
        }[]
      }
    }
    Enums: {
      lesson_type: "video" | "text" | "quiz" | "exercise"
    }
    CompositeTypes: {
      credit_xp_result: {
        event_id: string | null
        xp_before: number | null
        xp_after: number | null
        level_before: number | null
        level_after: number | null
        xp_delta_applied: number | null
        gap: number | null
      }
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
      lesson_type: ["video", "text", "quiz", "exercise"],
    },
  },
} as const
