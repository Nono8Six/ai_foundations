export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
          condition_params: Json | null
          condition_type: string
          cooldown_hours: number | null
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          is_repeatable: boolean | null
          sort_order: number | null
          title: string
          updated_at: string | null
          xp_reward: number
        }
        Insert: {
          achievement_key: string
          category?: string
          condition_params?: Json | null
          condition_type: string
          cooldown_hours?: number | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
          xp_reward?: number
        }
        Update: {
          achievement_key?: string
          category?: string
          condition_params?: Json | null
          condition_type?: string
          cooldown_hours?: number | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
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
          module_id: string | null
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
          module_id?: string | null
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
          module_id?: string | null
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
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          module_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          module_order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
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
          achievement_name: string
          achievement_type: string
          details: Json | null
          id: string
          unlocked_at: string | null
          user_id: string
          xp_reward: number
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          details?: Json | null
          id?: string
          unlocked_at?: string | null
          user_id: string
          xp_reward?: number
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          details?: Json | null
          id?: string
          unlocked_at?: string | null
          user_id?: string
          xp_reward?: number
        }
        Relationships: [
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          lesson_id: string | null
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
          lesson_id?: string | null
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
          lesson_id?: string | null
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
          lesson_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          level_after: number | null
          level_before: number | null
          metadata: Json | null
          reference_id: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          source_type: string
          user_id: string
          xp_after?: number
          xp_before?: number
          xp_delta: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          source_type?: string
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
          description: string | null
          id: string
          is_active: boolean | null
          is_repeatable: boolean | null
          max_per_day: number | null
          source_type: string
          xp_value: number
        }
        Insert: {
          action_type: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_per_day?: number | null
          source_type: string
          xp_value: number
        }
        Update: {
          action_type?: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_per_day?: number | null
          source_type?: string
          xp_value?: number
        }
        Relationships: []
      }
    }
    Views: {
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
      create_profile_completion_achievements: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      email_exists: {
        Args: { search_email: string }
        Returns: boolean
      }
      end_user_session: {
        Args: { session_id: string }
        Returns: boolean
      }
      get_user_course_progress: {
        Args: { user_id_param: string; course_id_param: string }
        Returns: {
          course_id: string
          total_lessons: number
          completed_lessons: number
          completion_percentage: number
        }[]
      }
      get_user_settings: {
        Args: { user_id?: string }
        Returns: {
          notification_settings: Json
          privacy_settings: Json
          learning_preferences: Json
        }[]
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      start_user_session: {
        Args: {
          target_user_id: string
          session_ip?: unknown
          session_user_agent?: string
        }
        Returns: string
      }
      update_user_profile: {
        Args: { p_user_id: string; p_profile_data: Json }
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          phone: string
          profession: string
          company: string
          level: number
          xp: number
          current_streak: number
          is_admin: boolean
          last_completed_at: string
          created_at: string
          updated_at: string
        }[]
      }
      update_user_settings: {
        Args: { settings_data: Json; user_id?: string }
        Returns: {
          notification_settings: Json
          privacy_settings: Json
          learning_preferences: Json
        }[]
      }
    }
    Enums: {
      lesson_type: "video" | "text" | "quiz" | "exercise"
      progress_status: "not_started" | "in_progress" | "completed"
      rgpd_request_status: "pending" | "processing" | "completed" | "rejected"
      rgpd_request_type: "access" | "deletion" | "rectification"
      user_role_type: "admin" | "instructor" | "student"
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
      lesson_type: ["video", "text", "quiz", "exercise"],
      progress_status: ["not_started", "in_progress", "completed"],
      rgpd_request_status: ["pending", "processing", "completed", "rejected"],
      rgpd_request_type: ["access", "deletion", "rectification"],
      user_role_type: ["admin", "instructor", "student"],
    },
  },
} as const