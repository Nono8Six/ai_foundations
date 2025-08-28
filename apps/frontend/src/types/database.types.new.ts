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
  access: {
    Tables: {
      course_access_rules: {
        Row: {
          course_id: string
          created_at: string
          grace_period_hours: number
          id: string
          is_active: boolean
          override_reason: string | null
          required_product_id: string | null
          required_tier_id: string | null
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          grace_period_hours?: number
          id?: string
          is_active?: boolean
          override_reason?: string | null
          required_product_id?: string | null
          required_tier_id?: string | null
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          grace_period_hours?: number
          id?: string
          is_active?: boolean
          override_reason?: string | null
          required_product_id?: string | null
          required_tier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_access_rules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "my_course_access"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_access_rules_required_tier_id_fkey"
            columns: ["required_tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_access_overrides: {
        Row: {
          access_type: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          lesson_id: string
          reason: string
          required_tier_id: string | null
          updated_at: string
        }
        Insert: {
          access_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          lesson_id: string
          reason: string
          required_tier_id?: string | null
          updated_at?: string
        }
        Update: {
          access_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          lesson_id?: string
          reason?: string
          required_tier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_access_overrides_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "my_lesson_access"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "lesson_access_overrides_required_tier_id_fkey"
            columns: ["required_tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      tiers: {
        Row: {
          annual_price_cents: number | null
          created_at: string
          description: string
          features: Json
          id: string
          is_active: boolean
          max_concurrent_sessions: number | null
          max_downloads_per_month: number | null
          monthly_price_cents: number
          sort_order: number
          support_level: string
          tier_key: string
          tier_name: string
          updated_at: string
        }
        Insert: {
          annual_price_cents?: number | null
          created_at?: string
          description: string
          features?: Json
          id?: string
          is_active?: boolean
          max_concurrent_sessions?: number | null
          max_downloads_per_month?: number | null
          monthly_price_cents?: number
          sort_order?: number
          support_level?: string
          tier_key: string
          tier_name: string
          updated_at?: string
        }
        Update: {
          annual_price_cents?: number | null
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          max_concurrent_sessions?: number | null
          max_downloads_per_month?: number | null
          monthly_price_cents?: number
          sort_order?: number
          support_level?: string
          tier_key?: string
          tier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_entitlements: {
        Row: {
          created_at: string
          entitlement_ref: string
          entitlement_type: Database["access"]["Enums"]["entitlement_type"]
          expires_at: string | null
          granted_at: string
          granted_by_id: string | null
          granted_by_type: string
          id: string
          last_verified_at: string | null
          metadata: Json
          source_reference: string | null
          status: Database["access"]["Enums"]["entitlement_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entitlement_ref: string
          entitlement_type: Database["access"]["Enums"]["entitlement_type"]
          expires_at?: string | null
          granted_at?: string
          granted_by_id?: string | null
          granted_by_type?: string
          id?: string
          last_verified_at?: string | null
          metadata?: Json
          source_reference?: string | null
          status?: Database["access"]["Enums"]["entitlement_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entitlement_ref?: string
          entitlement_type?: Database["access"]["Enums"]["entitlement_type"]
          expires_at?: string | null
          granted_at?: string
          granted_by_id?: string | null
          granted_by_type?: string
          id?: string
          last_verified_at?: string | null
          metadata?: Json
          source_reference?: string | null
          status?: Database["access"]["Enums"]["entitlement_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      my_course_access: {
        Row: {
          can_read: boolean | null
          category: string | null
          course_id: string | null
          difficulty: Database["content"]["Enums"]["course_difficulty"] | null
          required_tier: string | null
          required_tier_name: string | null
          slug: string | null
          title: string | null
        }
        Relationships: []
      }
      my_lesson_access: {
        Row: {
          can_read: boolean | null
          course_id: string | null
          course_title: string | null
          duration_seconds: number | null
          is_free_preview: boolean | null
          lesson_id: string | null
          title: string | null
          type: Database["content"]["Enums"]["lesson_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "my_course_access"
            referencedColumns: ["course_id"]
          },
        ]
      }
    }
    Functions: {
      can_read_course: {
        Args: { p_course_id: string; p_user_id: string }
        Returns: boolean
      }
      can_read_lesson: {
        Args: { p_lesson_id: string; p_user_id: string }
        Returns: boolean
      }
      user_can_access: {
        Args: {
          resource_id: string
          resource_type: string
          target_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      entitlement_status: "active" | "expired" | "suspended" | "revoked"
      entitlement_type:
        | "tier"
        | "course_specific"
        | "time_limited"
        | "special_grant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  assessments: {
    Tables: {
      assessment_items: {
        Row: {
          assessment_id: string
          created_at: string
          display_order: number
          id: string
          is_required: boolean
          points_override: number | null
          question_id: string
          updated_at: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          display_order?: number
          id?: string
          is_required?: boolean
          points_override?: number | null
          question_id: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          display_order?: number
          id?: string
          is_required?: boolean
          points_override?: number | null
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_items_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_items_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "dashboard_attempt_stats"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "assessment_items_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "item_difficulty_stats"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "assessment_items_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "item_difficulty_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "assessment_items_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          attempt_limit: number | null
          course_id: string | null
          created_at: string
          created_by: string
          description: string | null
          grading_mode: string
          id: string
          is_published: boolean
          lesson_id: string | null
          passing_score: number
          rubric_json: Json | null
          scope: string
          show_correct_answers: boolean
          show_score_immediately: boolean
          shuffle_answers: boolean
          shuffle_questions: boolean
          time_limit_sec: number | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          attempt_limit?: number | null
          course_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          grading_mode?: string
          id?: string
          is_published?: boolean
          lesson_id?: string | null
          passing_score?: number
          rubric_json?: Json | null
          scope: string
          show_correct_answers?: boolean
          show_score_immediately?: boolean
          shuffle_answers?: boolean
          shuffle_questions?: boolean
          time_limit_sec?: number | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          attempt_limit?: number | null
          course_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          grading_mode?: string
          id?: string
          is_published?: boolean
          lesson_id?: string | null
          passing_score?: number
          rubric_json?: Json | null
          scope?: string
          show_correct_answers?: boolean
          show_score_immediately?: boolean
          shuffle_answers?: boolean
          shuffle_questions?: boolean
          time_limit_sec?: number | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      attempts: {
        Row: {
          assessment_id: string
          attempt_no: number
          attempt_seed: number
          content_snapshot: Json
          content_snapshot_hash: string
          created_at: string
          deadline: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          max_score: number | null
          meta: Json | null
          needs_review: boolean
          responses: Json | null
          review_feedback: Json | null
          score: number | null
          started_at: string
          status: Database["assessments"]["Enums"]["attempt_status"]
          submitted_at: string | null
          time_spent_sec: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id: string
          attempt_no: number
          attempt_seed?: number
          content_snapshot: Json
          content_snapshot_hash: string
          created_at?: string
          deadline?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number | null
          meta?: Json | null
          needs_review?: boolean
          responses?: Json | null
          review_feedback?: Json | null
          score?: number | null
          started_at?: string
          status?: Database["assessments"]["Enums"]["attempt_status"]
          submitted_at?: string | null
          time_spent_sec?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string
          attempt_no?: number
          attempt_seed?: number
          content_snapshot?: Json
          content_snapshot_hash?: string
          created_at?: string
          deadline?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number | null
          meta?: Json | null
          needs_review?: boolean
          responses?: Json | null
          review_feedback?: Json | null
          score?: number | null
          started_at?: string
          status?: Database["assessments"]["Enums"]["attempt_status"]
          submitted_at?: string | null
          time_spent_sec?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "dashboard_attempt_stats"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "item_difficulty_stats"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      certificate_revocations: {
        Row: {
          certificate_id: string
          id: string
          metadata: Json
          reason: string
          revoked_at: string
          revoked_by: string
        }
        Insert: {
          certificate_id: string
          id?: string
          metadata?: Json
          reason: string
          revoked_at?: string
          revoked_by: string
        }
        Update: {
          certificate_id?: string
          id?: string
          metadata?: Json
          reason?: string
          revoked_at?: string
          revoked_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_revocations_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          assessment_id: string
          certificate_data: Json | null
          course_id: string
          expires_at: string | null
          id: string
          issued_at: string
          lesson_id: string | null
          max_score: number
          passed: boolean
          score: number
          serial_number: string
          user_id: string
          verify_hash: string
        }
        Insert: {
          assessment_id: string
          certificate_data?: Json | null
          course_id: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          lesson_id?: string | null
          max_score: number
          passed: boolean
          score: number
          serial_number: string
          user_id: string
          verify_hash: string
        }
        Update: {
          assessment_id?: string
          certificate_data?: Json | null
          course_id?: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          lesson_id?: string | null
          max_score?: number
          passed?: boolean
          score?: number
          serial_number?: string
          user_id?: string
          verify_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "dashboard_attempt_stats"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "certificates_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "item_difficulty_stats"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      grading_audit: {
        Row: {
          action_type: string
          attempt_id: string
          id: string
          metadata: Json | null
          new_state: Json
          performed_at: string
          performed_by: string
          previous_state: Json
          reason: string | null
        }
        Insert: {
          action_type: string
          attempt_id: string
          id?: string
          metadata?: Json | null
          new_state?: Json
          performed_at?: string
          performed_by: string
          previous_state?: Json
          reason?: string | null
        }
        Update: {
          action_type?: string
          attempt_id?: string
          id?: string
          metadata?: Json | null
          new_state?: Json
          performed_at?: string
          performed_by?: string
          previous_state?: Json
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grading_audit_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          assessment_id: string | null
          body: string
          category: string | null
          choices: Json | null
          correct_answers: Json | null
          created_at: string
          created_by: string | null
          difficulty_level: number | null
          display_order: number
          estimated_time_sec: number | null
          explanation: string | null
          id: string
          is_reusable: boolean | null
          points: number
          question_version: number
          tags: string[] | null
          type: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          assessment_id?: string | null
          body: string
          category?: string | null
          choices?: Json | null
          correct_answers?: Json | null
          created_at?: string
          created_by?: string | null
          difficulty_level?: number | null
          display_order?: number
          estimated_time_sec?: number | null
          explanation?: string | null
          id?: string
          is_reusable?: boolean | null
          points?: number
          question_version?: number
          tags?: string[] | null
          type: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          assessment_id?: string | null
          body?: string
          category?: string | null
          choices?: Json | null
          correct_answers?: Json | null
          created_at?: string
          created_by?: string | null
          difficulty_level?: number | null
          display_order?: number
          estimated_time_sec?: number | null
          explanation?: string | null
          id?: string
          is_reusable?: boolean | null
          points?: number
          question_version?: number
          tags?: string[] | null
          type?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      assessment_analytics_compat: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          device_info: Json | null
          event_data: Json | null
          event_timestamp: string | null
          event_type: string | null
          id: string | null
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: never
          created_at?: string | null
          device_info?: Json | null
          event_data?: Json | null
          event_timestamp?: string | null
          event_type?: never
          id?: never
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: never
          created_at?: string | null
          device_info?: Json | null
          event_data?: Json | null
          event_timestamp?: string | null
          event_type?: never
          id?: never
          ip_address?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      attempt_lifecycle_dashboard: {
        Row: {
          avg_duration_minutes: number | null
          avg_score_percent: number | null
          newest_attempt: string | null
          oldest_attempt: string | null
          p95_duration_minutes: number | null
          status: Database["assessments"]["Enums"]["attempt_status"] | null
          today_count: number | null
          total_attempts: number | null
          unique_assessments: number | null
          unique_users: number | null
          yesterday_count: number | null
        }
        Relationships: []
      }
      dashboard_attempt_stats: {
        Row: {
          assessment_id: string | null
          avg_duration_minutes: number | null
          avg_score_percent: number | null
          pass_rate_percent: number | null
          passed_attempts: number | null
          passing_score: number | null
          title: string | null
          total_attempts: number | null
          type: string | null
          unique_users: number | null
        }
        Relationships: []
      }
      idempotence_collision_alerts: {
        Row: {
          alert_type: string | null
          assessment_id: string | null
          attempt_count: number | null
          attempt_ids: string[] | null
          attempt_times: string[] | null
          collision_window: unknown | null
          detected_at: string | null
          severity: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "dashboard_attempt_stats"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "item_difficulty_stats"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      item_difficulty_stats: {
        Row: {
          answered_count: number | null
          assessment_id: string | null
          assessment_title: string | null
          points: number | null
          question_id: string | null
          question_text: string | null
          response_rate_percent: number | null
          sample_reliability: string | null
          total_responses: number | null
        }
        Relationships: []
      }
      real_time_monitoring: {
        Row: {
          metric: string | null
          unit: string | null
          value: number | null
        }
        Relationships: []
      }
      rpc_latency_alerts: {
        Row: {
          alert_type: string | null
          assessment_id: string | null
          latency_seconds: number | null
          severity: string | null
          started_at: string | null
          status: Database["assessments"]["Enums"]["attempt_status"] | null
          user_agent: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_xp_for_attempt_event: {
        Args: {
          p_assessment_type: string
          p_attempt_id?: string
          p_event_type: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: Json
      }
      backfill_certificate_hashes: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      calculate_content_snapshot_hash: {
        Args: { content_snapshot: Json }
        Returns: string
      }
      detect_content_corruption: {
        Args: { check_all?: boolean; limit_count?: number }
        Returns: {
          assessment_id: string
          attempt_id: string
          calculated_hash: string
          content_size_bytes: number
          created_at: string
          is_corrupted: boolean
          stored_hash: string
          user_id: string
        }[]
      }
      enqueue_for_manual_review: {
        Args: { p_attempt_id: string }
        Returns: Json
      }
      final_validation_checks: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_certificate_serial: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_verify_hash: {
        Args: {
          p_course_id: string
          p_issued_at: string
          p_serial_number: string
          p_user_id: string
        }
        Returns: string
      }
      grade_attempt_manual: {
        Args: { p_attempt_id: string; p_feedback_json?: Json; p_score: number }
        Returns: Json
      }
      issue_certificate: {
        Args: { p_attempt_id?: string; p_course_id: string }
        Returns: Json
      }
      recalculate_question_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      resume_attempt: {
        Args: { p_attempt_id: string }
        Returns: Json
      }
      revoke_certificate: {
        Args: { p_certificate_id: string; p_reason: string }
        Returns: Json
      }
      start_attempt: {
        Args: { p_assessment_id: string }
        Returns: Json
      }
      submit_attempt: {
        Args:
          | { p_attempt_id: string; p_responses: Json }
          | { p_attempt_id: string; p_responses: Json; p_session_id?: string }
        Returns: Json
      }
      system_health_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_certificate_scope_constraints: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_content_snapshot_integrity: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_revocation_reissuance_cycle: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_xp_reversal_idempotence: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      trigger_alert: {
        Args: {
          alert_type: string
          message: string
          metadata?: Json
          severity: string
        }
        Returns: boolean
      }
      verify_content_snapshot_integrity: {
        Args: { p_attempt_id: string }
        Returns: Json
      }
    }
    Enums: {
      attempt_status:
        | "in_progress"
        | "submitted"
        | "abandoned"
        | "graded"
        | "needs_review"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  content: {
    Tables: {
      course_tags: {
        Row: {
          course_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_tags_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_tags_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          cover_image_url: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          difficulty: Database["content"]["Enums"]["course_difficulty"]
          estimated_duration_minutes: number | null
          id: string
          instructor_id: string | null
          is_published: boolean
          published_at: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          workflow_status: string | null
        }
        Insert: {
          category: string
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: Database["content"]["Enums"]["course_difficulty"]
          estimated_duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean
          published_at?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          workflow_status?: string | null
        }
        Update: {
          category?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: Database["content"]["Enums"]["course_difficulty"]
          estimated_duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          workflow_status?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json
          created_at: string
          duration_seconds: number | null
          id: string
          is_free_preview: boolean
          is_published: boolean
          learning_objectives: string[] | null
          lesson_order: number
          module_id: string
          prerequisites: string[] | null
          primary_media_id: string | null
          project_instructions: Json | null
          quiz_config: Json | null
          resources: Json | null
          text_content: string | null
          title: string
          transcript: string | null
          type: Database["content"]["Enums"]["lesson_type"]
          updated_at: string
          video_url: string | null
          workflow_status: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          learning_objectives?: string[] | null
          lesson_order: number
          module_id: string
          prerequisites?: string[] | null
          primary_media_id?: string | null
          project_instructions?: Json | null
          quiz_config?: Json | null
          resources?: Json | null
          text_content?: string | null
          title: string
          transcript?: string | null
          type?: Database["content"]["Enums"]["lesson_type"]
          updated_at?: string
          video_url?: string | null
          workflow_status?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          learning_objectives?: string[] | null
          lesson_order?: number
          module_id?: string
          prerequisites?: string[] | null
          primary_media_id?: string | null
          project_instructions?: Json | null
          quiz_config?: Json | null
          resources?: Json | null
          text_content?: string | null
          title?: string
          transcript?: string | null
          type?: Database["content"]["Enums"]["lesson_type"]
          updated_at?: string
          video_url?: string | null
          workflow_status?: string | null
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
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          learning_objectives: string[] | null
          module_order: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          learning_objectives?: string[] | null
          module_order: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          learning_objectives?: string[] | null
          module_order?: number
          title?: string
          updated_at?: string
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
            referencedRelation: "courses_published"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color_hex: string
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          tag_category: string
          tag_name: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          tag_category?: string
          tag_name: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          tag_category?: string
          tag_name?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      courses_published: {
        Row: {
          category: string | null
          computed_is_published: boolean | null
          cover_image_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: Database["content"]["Enums"]["course_difficulty"] | null
          estimated_duration_minutes: number | null
          id: string | null
          instructor_id: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          workflow_status: string | null
        }
        Insert: {
          category?: string | null
          computed_is_published?: never
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: Database["content"]["Enums"]["course_difficulty"] | null
          estimated_duration_minutes?: number | null
          id?: string | null
          instructor_id?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          workflow_status?: string | null
        }
        Update: {
          category?: string | null
          computed_is_published?: never
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: Database["content"]["Enums"]["course_difficulty"] | null
          estimated_duration_minutes?: number | null
          id?: string | null
          instructor_id?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          workflow_status?: string | null
        }
        Relationships: []
      }
      lessons_published: {
        Row: {
          computed_is_published: boolean | null
          content: Json | null
          created_at: string | null
          duration_seconds: number | null
          id: string | null
          is_free_preview: boolean | null
          is_published: boolean | null
          learning_objectives: string[] | null
          lesson_order: number | null
          module_id: string | null
          prerequisites: string[] | null
          primary_media_id: string | null
          project_instructions: Json | null
          quiz_config: Json | null
          resources: Json | null
          text_content: string | null
          title: string | null
          transcript: string | null
          type: Database["content"]["Enums"]["lesson_type"] | null
          updated_at: string | null
          video_url: string | null
          workflow_status: string | null
        }
        Insert: {
          computed_is_published?: never
          content?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string | null
          is_free_preview?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          lesson_order?: number | null
          module_id?: string | null
          prerequisites?: string[] | null
          primary_media_id?: string | null
          project_instructions?: Json | null
          quiz_config?: Json | null
          resources?: Json | null
          text_content?: string | null
          title?: string | null
          transcript?: string | null
          type?: Database["content"]["Enums"]["lesson_type"] | null
          updated_at?: string | null
          video_url?: string | null
          workflow_status?: string | null
        }
        Update: {
          computed_is_published?: never
          content?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string | null
          is_free_preview?: boolean | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          lesson_order?: number | null
          module_id?: string | null
          prerequisites?: string[] | null
          primary_media_id?: string | null
          project_instructions?: Json | null
          quiz_config?: Json | null
          resources?: Json | null
          text_content?: string | null
          title?: string | null
          transcript?: string | null
          type?: Database["content"]["Enums"]["lesson_type"] | null
          updated_at?: string | null
          video_url?: string | null
          workflow_status?: string | null
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
      workflow_dashboard: {
        Row: {
          created_at: string | null
          created_by: string | null
          creator_name: string | null
          lesson_count: number | null
          published_lessons: number | null
          resource_id: string | null
          resource_type: string | null
          title: string | null
          updated_at: string | null
          workflow_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_content: {
        Args: {
          p_comment?: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: Json
      }
      archive_content: {
        Args: {
          p_comment?: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: Json
      }
      archive_course: {
        Args: { p_archived_by?: string; p_course_id: string; p_reason?: string }
        Returns: Json
      }
      reject_content: {
        Args: {
          p_reason?: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: Json
      }
      submit_for_review: {
        Args: {
          p_comment?: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: Json
      }
      transition_workflow_status: {
        Args: {
          p_comment?: string
          p_new_status: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: Json
      }
    }
    Enums: {
      course_difficulty: "beginner" | "intermediate" | "advanced" | "expert"
      lesson_type: "video" | "article" | "quiz" | "project" | "interactive"
      publication_status: "draft" | "review" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  gamification: {
    Tables: {
      idempotency_ledger: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          source_type: string
          user_id: string
          xp_event_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key: string
          source_type: string
          user_id: string
          xp_event_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          source_type?: string
          user_id?: string
          xp_event_id?: string | null
        }
        Relationships: []
      }
      level_definitions: {
        Row: {
          badge_color: string | null
          badge_icon: string | null
          created_at: string | null
          description: string | null
          level: number
          perks: Json | null
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
          perks?: Json | null
          title: string
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
          perks?: Json | null
          title?: string
          updated_at?: string | null
          xp_for_next?: number
          xp_required?: number
        }
        Relationships: []
      }
      maintenance_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          operation: string
          success: boolean | null
          table_name: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation: string
          success?: boolean | null
          table_name?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation?: string
          success?: boolean | null
          table_name?: string | null
        }
        Relationships: []
      }
      notification_outbox: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          max_attempts: number | null
          next_retry_at: string | null
          notification_type: string
          payload: Json
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          max_attempts?: number | null
          next_retry_at?: string | null
          notification_type: string
          payload?: Json
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          max_attempts?: number | null
          next_retry_at?: string | null
          notification_type?: string
          payload?: Json
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      seasonal_limits: {
        Row: {
          created_at: string | null
          daily_xp_limit: number
          end_date: string | null
          id: string
          is_active: boolean | null
          level_xp_curve_multiplier: number | null
          season_key: string
          start_date: string
          updated_at: string | null
          weekly_xp_limit: number | null
        }
        Insert: {
          created_at?: string | null
          daily_xp_limit: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          level_xp_curve_multiplier?: number | null
          season_key: string
          start_date: string
          updated_at?: string | null
          weekly_xp_limit?: number | null
        }
        Update: {
          created_at?: string | null
          daily_xp_limit?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          level_xp_curve_multiplier?: number | null
          season_key?: string
          start_date?: string
          updated_at?: string | null
          weekly_xp_limit?: number | null
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          created_at: string | null
          current_level: number
          daily_xp_today: number
          last_daily_reset_at: string | null
          last_xp_event_at: string | null
          total_xp: number
          updated_at: string | null
          user_id: string
          xp_in_current_level: number
        }
        Insert: {
          created_at?: string | null
          current_level?: number
          daily_xp_today?: number
          last_daily_reset_at?: string | null
          last_xp_event_at?: string | null
          total_xp?: number
          updated_at?: string | null
          user_id: string
          xp_in_current_level?: number
        }
        Update: {
          created_at?: string | null
          current_level?: number
          daily_xp_today?: number
          last_daily_reset_at?: string | null
          last_xp_event_at?: string | null
          total_xp?: number
          updated_at?: string | null
          user_id?: string
          xp_in_current_level?: number
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          action_type: string
          created_at: string
          id: string | null
          idempotency_key: string
          level_after: number | null
          level_before: number | null
          metadata: Json | null
          reference_id: string | null
          session_id: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string | null
          idempotency_key: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string | null
          idempotency_key?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type?: string
          user_id?: string
          xp_after?: number
          xp_before?: number
          xp_delta?: number
        }
        Relationships: []
      }
      xp_events_2025_01: {
        Row: {
          action_type: string
          created_at: string
          id: string | null
          idempotency_key: string
          level_after: number | null
          level_before: number | null
          metadata: Json | null
          reference_id: string | null
          session_id: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string | null
          idempotency_key: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string | null
          idempotency_key?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type?: string
          user_id?: string
          xp_after?: number
          xp_before?: number
          xp_delta?: number
        }
        Relationships: []
      }
      xp_events_2025_02: {
        Row: {
          action_type: string
          created_at: string
          id: string | null
          idempotency_key: string
          level_after: number | null
          level_before: number | null
          metadata: Json | null
          reference_id: string | null
          session_id: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string | null
          idempotency_key: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string | null
          idempotency_key?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type?: string
          user_id?: string
          xp_after?: number
          xp_before?: number
          xp_delta?: number
        }
        Relationships: []
      }
      xp_events_2025_03: {
        Row: {
          action_type: string
          created_at: string
          id: string | null
          idempotency_key: string
          level_after: number | null
          level_before: number | null
          metadata: Json | null
          reference_id: string | null
          session_id: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string | null
          idempotency_key: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type: string
          user_id: string
          xp_after: number
          xp_before: number
          xp_delta: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string | null
          idempotency_key?: string
          level_after?: number | null
          level_before?: number | null
          metadata?: Json | null
          reference_id?: string | null
          session_id?: string | null
          source_type?: string
          user_id?: string
          xp_after?: number
          xp_before?: number
          xp_delta?: number
        }
        Relationships: []
      }
      xp_sources: {
        Row: {
          action_type: string
          base_xp: number
          cooldown_minutes: number | null
          created_at: string | null
          description: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_active: boolean | null
          is_repeatable: boolean | null
          max_per_day: number | null
          max_variance_percent: number
          min_variance_percent: number
          source_type: string
          updated_at: string | null
          version: number
        }
        Insert: {
          action_type: string
          base_xp: number
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_per_day?: number | null
          max_variance_percent?: number
          min_variance_percent?: number
          source_type: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          action_type?: string
          base_xp?: number
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_per_day?: number | null
          max_variance_percent?: number
          min_variance_percent?: number
          source_type?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      clean_leaderboard: {
        Row: {
          avatar_url: string | null
          clean_xp: number | null
          current_level: number | null
          display_name: string | null
          last_xp_event_at: string | null
          ranking: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
      dashboard_alerts: {
        Row: {
          alert_check_time: string | null
          alerts: Json | null
          orphaned_xp_sources: number | null
          oversized_partitions: number | null
          recent_maintenance_errors: number | null
          users_near_daily_limit: number | null
        }
        Relationships: []
      }
      dashboard_leaderboards: {
        Row: {
          active_today: boolean | null
          current_level: number | null
          email: string | null
          global_rank: number | null
          last_xp_event_at: string | null
          level_progress_pct: number | null
          total_xp: number | null
          user_id: string | null
          username: string | null
          weekly_rank: number | null
          weekly_xp: number | null
        }
        Relationships: []
      }
      dashboard_system_health: {
        Row: {
          anomaly_detection: Json | null
          health_check_time: string | null
          largest_partition: Json | null
          maintenance_health: Json | null
          total_partitions: number | null
          total_storage_bytes: number | null
          total_storage_pretty: string | null
        }
        Relationships: []
      }
      dashboard_xp_metrics: {
        Row: {
          active_sources_today: number | null
          active_users_today: number | null
          avg_xp_per_event: number | null
          growth_vs_yesterday_pct: number | null
          max_xp_single_event: number | null
          snapshot_date: string | null
          top_sources_today: Json | null
          total_events_today: number | null
          total_xp_distributed_today: number | null
        }
        Relationships: []
      }
      integrity_dashboard: {
        Row: {
          active_partitions: number | null
          active_users: number | null
          avg_xp_per_event: number | null
          avg_xp_per_user: number | null
          coherence_violations: number | null
          dashboard_generated_at: string | null
          health_issues: string | null
          integrity_status: string | null
          max_xp_user: number | null
          negative_xp_events: number | null
          sync_violations: number | null
          total_events: number | null
          total_xp_distributed: number | null
          total_xp_in_system: number | null
          users_over_daily_limit: number | null
          users_with_xp: number | null
        }
        Relationships: []
      }
      leaderboard_top10: {
        Row: {
          avatar_url: string | null
          current_level: number | null
          display_name: string | null
          last_xp_event_at: string | null
          level_title: string | null
          rank: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          avg_daily_xp: number | null
          calls_24h: number | null
          current_daily_limit: number | null
          function_name: string | null
          idempotent_calls: number | null
          max_daily_xp: number | null
          metrics_generated_at: string | null
          success_rate_percent: number | null
          successful_calls: number | null
          users_active_today: number | null
          users_at_limit: number | null
          users_near_limit: number | null
        }
        Relationships: []
      }
      public_levels: {
        Row: {
          badge_color: string | null
          level: number | null
          title: string | null
          xp_required: number | null
          xp_to_next: number | null
        }
        Relationships: []
      }
      top_xp_sources_24h: {
        Row: {
          action_type: string | null
          avg_xp_per_event: number | null
          event_count: number | null
          percentage_of_total_xp: number | null
          source_type: string | null
          total_xp_distributed: number | null
          unique_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_xp_atomic: {
        Args: {
          p_action_type: string
          p_idempotency_key?: string
          p_metadata?: Json
          p_source_type: string
          p_user_id: string
          p_xp_amount: number
        }
        Returns: Json
      }
      calculate_deterministic_xp: {
        Args: {
          base_xp: number
          p_date?: string
          p_source_type: string
          p_user_id: string
        }
        Returns: number
      }
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: number
      }
      calculate_xp_simple: {
        Args: { p_base_xp: number }
        Returns: number
      }
      calculate_xp_variance: {
        Args: {
          p_base_xp: number
          p_max_variance_percent?: number
          p_min_variance_percent?: number
          p_source_type?: string
          p_user_id: string
        }
        Returns: Json
      }
      check_integrity_alerts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_partition_if_not_exists: {
        Args: { partition_date: string; partition_name: string }
        Returns: boolean
      }
      credit_xp: {
        Args: {
          p_action_type: string
          p_idempotency_key: string
          p_metadata?: Json
          p_reference_id?: string
          p_session_id?: string
          p_source_type: string
          p_user_id: string
        }
        Returns: Json
      }
      credit_xp_v2: {
        Args: {
          p_action_type: string
          p_idempotency_key?: string
          p_metadata?: Json
          p_source_type: string
          p_user_id: string
        }
        Returns: Json
      }
      get_daily_xp_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_level_info: {
        Args: { total_xp: number }
        Returns: {
          current_level: number
          level_title: string
          xp_for_next_level: number
          xp_in_current_level: number
        }[]
      }
      maintain_partitions: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      validate_xp_eligibility: {
        Args: {
          p_action_type: string
          p_idempotency_key?: string
          p_source_type: string
          p_user_id: string
        }
        Returns: Json
      }
      verify_partition_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          issues: string[]
          partition_name: string
          record_count: number
          size_bytes: number
          status: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  learn: {
    Tables: {
      assessment_analytics: {
        Row: {
          assessment_id: string
          attempt_id: string | null
          created_at: string
          device_info: Json | null
          event_data: Json
          event_timestamp: string
          event_type: Database["learn"]["Enums"]["analytics_event_type"]
          id: string
          ip_address: unknown | null
          session_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          assessment_id: string
          attempt_id?: string | null
          created_at?: string
          device_info?: Json | null
          event_data?: Json
          event_timestamp?: string
          event_type: Database["learn"]["Enums"]["analytics_event_type"]
          id?: string
          ip_address?: unknown | null
          session_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          assessment_id?: string
          attempt_id?: string | null
          created_at?: string
          device_info?: Json | null
          event_data?: Json
          event_timestamp?: string
          event_type?: Database["learn"]["Enums"]["analytics_event_type"]
          id?: string
          ip_address?: unknown | null
          session_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_analytics_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_score_distribution"
            referencedColumns: ["assessment_id"]
          },
          {
            foreignKeyName: "assessment_analytics_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_success_rates"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      lesson_analytics: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json
          event_timestamp: string
          event_type: Database["learn"]["Enums"]["analytics_event_type"]
          id: string
          ip_address: unknown | null
          lesson_id: string
          position_seconds: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json
          event_timestamp?: string
          event_type: Database["learn"]["Enums"]["analytics_event_type"]
          id?: string
          ip_address?: unknown | null
          lesson_id: string
          position_seconds?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json
          event_timestamp?: string
          event_type?: Database["learn"]["Enums"]["analytics_event_type"]
          id?: string
          ip_address?: unknown | null
          lesson_id?: string
          position_seconds?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          attempts_count: number
          best_score: number | null
          bookmarks: Json
          completed_at: string | null
          completion_percentage: number
          created_at: string
          id: string
          last_accessed_at: string
          last_position_seconds: number | null
          lesson_id: string
          notes: string | null
          started_at: string | null
          status: Database["learn"]["Enums"]["progress_status"]
          time_spent_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts_count?: number
          best_score?: number | null
          bookmarks?: Json
          completed_at?: string | null
          completion_percentage?: number
          created_at?: string
          id?: string
          last_accessed_at?: string
          last_position_seconds?: number | null
          lesson_id: string
          notes?: string | null
          started_at?: string | null
          status?: Database["learn"]["Enums"]["progress_status"]
          time_spent_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts_count?: number
          best_score?: number | null
          bookmarks?: Json
          completed_at?: string | null
          completion_percentage?: number
          created_at?: string
          id?: string
          last_accessed_at?: string
          last_position_seconds?: number | null
          lesson_id?: string
          notes?: string | null
          started_at?: string | null
          status?: Database["learn"]["Enums"]["progress_status"]
          time_spent_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      analytics_volume_stats: {
        Row: {
          date: string | null
          event_count: number | null
          event_type: Database["learn"]["Enums"]["analytics_event_type"] | null
          unique_lessons: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      assessment_analytics_compat: {
        Row: {
          assessment_id: string | null
          attempt_id: string | null
          created_at: string | null
          device_info: Json | null
          event_data: Json | null
          event_timestamp: string | null
          event_type: string | null
          id: string | null
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          attempt_id?: never
          created_at?: string | null
          device_info?: Json | null
          event_data?: Json | null
          event_timestamp?: string | null
          event_type?: never
          id?: string | null
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          attempt_id?: never
          created_at?: string | null
          device_info?: Json | null
          event_data?: Json | null
          event_timestamp?: string | null
          event_type?: never
          id?: string | null
          ip_address?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      assessment_score_distribution: {
        Row: {
          assessment_id: string | null
          attempts_count: number | null
          grade_range: string | null
          percentage: number | null
          title: string | null
          type: string | null
        }
        Relationships: []
      }
      assessment_success_rates: {
        Row: {
          assessment_id: string | null
          average_duration_minutes: number | null
          average_score_percent: number | null
          passing_score: number | null
          success_rate_percent: number | null
          successful_attempts: number | null
          title: string | null
          total_attempts: number | null
          type: string | null
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          avg_lesson_completion: number | null
          avg_score: number | null
          completion_percentage: number | null
          course_id: string | null
          course_slug: string | null
          course_status: string | null
          course_title: string | null
          first_started_at: string | null
          last_activity_at: string | null
          last_completed_at: string | null
          lessons_completed: number | null
          lessons_started: number | null
          total_lessons: number | null
          total_time_spent_seconds: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_deprecated_analytics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_old_analytics: {
        Args: { retention_months?: number }
        Returns: number
      }
      prepare_analytics_partitioning: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      track_assessment_event: {
        Args: {
          p_assessment_id: string
          p_attempt_id: string
          p_device_info?: Json
          p_event_data?: Json
          p_event_type: Database["learn"]["Enums"]["analytics_event_type"]
          p_ip_address?: unknown
          p_session_id: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      analytics_event_type:
        | "start"
        | "progress"
        | "pause"
        | "resume"
        | "complete"
        | "skip"
        | "bookmark"
        | "note"
        | "replay"
        | "video_quality_change"
        | "video_seek"
        | "video_buffer"
        | "quiz_start"
        | "quiz_submit"
        | "quiz_graded"
        | "exam_start"
        | "exam_submit"
        | "exam_graded"
        | "cert_start"
        | "cert_submit"
        | "cert_graded"
        | "cert_issued"
        | "assessment_start"
        | "assessment_submit"
        | "assessment_graded"
        | "certificate_issued"
      progress_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "paused"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  media: {
    Tables: {
      asset_variants: {
        Row: {
          asset_id: string
          bitrate_kbps: number | null
          created_at: string | null
          external_url: string
          file_size_bytes: number | null
          height: number | null
          id: string
          quality_label: string | null
          status: string | null
          variant_type: string
          width: number | null
        }
        Insert: {
          asset_id: string
          bitrate_kbps?: number | null
          created_at?: string | null
          external_url: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          quality_label?: string | null
          status?: string | null
          variant_type: string
          width?: number | null
        }
        Update: {
          asset_id?: string
          bitrate_kbps?: number | null
          created_at?: string | null
          external_url?: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          quality_label?: string | null
          status?: string | null
          variant_type?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_variants_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "admin_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_variants_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_variants_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "video_engagement_stats"
            referencedColumns: ["asset_id"]
          },
        ]
      }
      assets: {
        Row: {
          access_level: string | null
          asset_type: string
          bitrate_kbps: number | null
          category: string | null
          completion_count: number | null
          created_at: string | null
          description: string | null
          download_allowed: boolean | null
          duration_seconds: number | null
          external_id: string
          external_provider: string
          external_url: string
          file_size_bytes: number | null
          filename: string | null
          height: number | null
          id: string
          last_accessed_at: string | null
          mime_type: string | null
          preview_gif_url: string | null
          processing_error: string | null
          processing_progress: number | null
          thumbnail_url: string | null
          title: string
          total_watch_time_seconds: number | null
          updated_at: string | null
          upload_status: string | null
          uploaded_by: string
          view_count: number | null
          watermark_enabled: boolean | null
          width: number | null
        }
        Insert: {
          access_level?: string | null
          asset_type: string
          bitrate_kbps?: number | null
          category?: string | null
          completion_count?: number | null
          created_at?: string | null
          description?: string | null
          download_allowed?: boolean | null
          duration_seconds?: number | null
          external_id: string
          external_provider: string
          external_url: string
          file_size_bytes?: number | null
          filename?: string | null
          height?: number | null
          id?: string
          last_accessed_at?: string | null
          mime_type?: string | null
          preview_gif_url?: string | null
          processing_error?: string | null
          processing_progress?: number | null
          thumbnail_url?: string | null
          title: string
          total_watch_time_seconds?: number | null
          updated_at?: string | null
          upload_status?: string | null
          uploaded_by: string
          view_count?: number | null
          watermark_enabled?: boolean | null
          width?: number | null
        }
        Update: {
          access_level?: string | null
          asset_type?: string
          bitrate_kbps?: number | null
          category?: string | null
          completion_count?: number | null
          created_at?: string | null
          description?: string | null
          download_allowed?: boolean | null
          duration_seconds?: number | null
          external_id?: string
          external_provider?: string
          external_url?: string
          file_size_bytes?: number | null
          filename?: string | null
          height?: number | null
          id?: string
          last_accessed_at?: string | null
          mime_type?: string | null
          preview_gif_url?: string | null
          processing_error?: string | null
          processing_progress?: number | null
          thumbnail_url?: string | null
          title?: string
          total_watch_time_seconds?: number | null
          updated_at?: string | null
          upload_status?: string | null
          uploaded_by?: string
          view_count?: number | null
          watermark_enabled?: boolean | null
          width?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_dashboard: {
        Row: {
          asset_type: string | null
          available_qualities: string[] | null
          avg_watch_percent: number | null
          completion_count: number | null
          completion_rate_percent: number | null
          created_at: string | null
          duration_seconds: number | null
          external_provider: string | null
          id: string | null
          last_accessed_at: string | null
          processing_progress: number | null
          resolution: string | null
          size_mb: number | null
          title: string | null
          total_watch_time_seconds: number | null
          upload_status: string | null
          uploaded_by_name: string | null
          used_in_lessons: number | null
          variants_ready: number | null
          view_count: number | null
        }
        Relationships: []
      }
      video_engagement_stats: {
        Row: {
          asset_id: string | null
          avg_position_seconds: number | null
          avg_watch_duration_seconds: number | null
          bookmark_count: number | null
          completion_count: number | null
          completion_rate_percent: number | null
          engagement_score: number | null
          last_viewed: string | null
          lesson_id: string | null
          lesson_title: string | null
          max_position_reached: number | null
          pause_count: number | null
          play_count: number | null
          quality_change_count: number | null
          recent_interactions: number | null
          replay_count: number | null
          seek_count: number | null
          unique_viewers: number | null
          video_title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      certificate_verification_logs: {
        Row: {
          certificate_hash: string | null
          client_ip: unknown
          created_at: string
          error_message: string | null
          id: string
          response_time_ms: number | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          certificate_hash?: string | null
          client_ip: unknown
          created_at?: string
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          certificate_hash?: string | null
          client_ip?: unknown
          created_at?: string
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      profile_links: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          link_type: string
          sort_order: number
          title: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean
          link_type: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          link_type?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          display_name: string | null
          email: string
          email_verified: boolean
          id: string
          is_admin: boolean
          is_public: boolean
          last_seen_at: string | null
          locale: string
          onboarding_completed: boolean
          time_zone: string
          updated_at: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email: string
          email_verified?: boolean
          id: string
          is_admin?: boolean
          is_public?: boolean
          last_seen_at?: string | null
          locale?: string
          onboarding_completed?: boolean
          time_zone?: string
          updated_at?: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          is_admin?: boolean
          is_public?: boolean
          last_seen_at?: string | null
          locale?: string
          onboarding_completed?: boolean
          time_zone?: string
          updated_at?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_key: string
          granted: boolean
          granted_at: string
          id: string
          ip_address: unknown | null
          revoked_at: string | null
          source: string
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_key: string
          granted: boolean
          granted_at?: string
          id?: string
          ip_address?: unknown | null
          revoked_at?: string | null
          source?: string
          user_agent?: string | null
          user_id: string
          version?: string
        }
        Update: {
          consent_key?: string
          granted?: boolean
          granted_at?: string
          id?: string
          ip_address?: unknown | null
          revoked_at?: string | null
          source?: string
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          learning_preferences: Json
          notification_settings: Json
          privacy_settings: Json
          ui_preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_preferences?: Json
          notification_settings?: Json
          privacy_settings?: Json
          ui_preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_preferences?: Json
          notification_settings?: Json
          privacy_settings?: Json
          ui_preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      certificate_verification_rate_limit: {
        Row: {
          client_ip: unknown | null
          is_rate_limited: boolean | null
          last_request_at: string | null
          requests_last_hour: number | null
        }
        Relationships: []
      }
      index_usage_analytics: {
        Row: {
          analyzed_at: string | null
          index_size: string | null
          indexname: unknown | null
          schemaname: unknown | null
          size_bytes: number | null
          tablename: unknown | null
          times_used: number | null
          tuples_fetched: number | null
          tuples_read: number | null
          usage_category: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      remind_generate_types: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      soft_delete_profile: {
        Args: { p_requester_id?: string; p_user_id: string }
        Returns: Json
      }
      verify_certificate_public: {
        Args: { certificate_hash: string }
        Returns: Json
      }
    }
    Enums: {
      audit_operation:
        | "INSERT"
        | "UPDATE"
        | "DELETE"
        | "SELECT"
        | "GRANT"
        | "REVOKE"
      event_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  rbac: {
    Tables: {
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string
          domain: string
          id: string
          is_dangerous: boolean
          permission_key: string
          resource_type: string | null
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          domain: string
          id?: string
          is_dangerous?: boolean
          permission_key: string
          resource_type?: string | null
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          domain?: string
          id?: string
          is_dangerous?: boolean
          permission_key?: string
          resource_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      role_grants_log: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          operation: Database["public"]["Enums"]["audit_operation"]
          performed_by: string
          reason: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          operation: Database["public"]["Enums"]["audit_operation"]
          performed_by: string
          reason: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          operation?: Database["public"]["Enums"]["audit_operation"]
          performed_by?: string
          reason?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_grants_log_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          permission_id: string
          reason: string | null
          role_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_id: string
          reason?: string | null
          role_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_id?: string
          reason?: string | null
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string
          id: string
          is_system: boolean
          role_name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_system?: boolean
          role_name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_system?: boolean
          role_name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          reason: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          reason?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: { target_user_id: string }
        Returns: {
          action: string
          domain: string
          is_dangerous: boolean
          permission_key: string
          role_name: string
        }[]
      }
      grant_role: {
        Args: {
          expires_at_param?: string
          grant_reason: string
          target_role_name: string
          target_user_id: string
        }
        Returns: Json
      }
      has_permission: {
        Args: { target_permission_key: string; target_user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: { target_role_name: string; target_user_id: string }
        Returns: boolean
      }
      revoke_role: {
        Args: {
          revoke_reason: string
          target_role_name: string
          target_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  referrals: {
    Tables: {
      attribution_rules: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          priority: number
          rule_config: Json
          rule_name: string
          rule_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          rule_config?: Json
          rule_name: string
          rule_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          rule_config?: Json
          rule_name?: string
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_payout_items: {
        Row: {
          calculated_at: string
          commission_amount_cents: number
          commission_rate: number
          id: string
          metadata: Json | null
          order_amount_cents: number
          payout_id: string
          referral_id: string
        }
        Insert: {
          calculated_at?: string
          commission_amount_cents: number
          commission_rate: number
          id?: string
          metadata?: Json | null
          order_amount_cents: number
          payout_id: string
          referral_id: string
        }
        Update: {
          calculated_at?: string
          commission_amount_cents?: number
          commission_rate?: number
          id?: string
          metadata?: Json | null
          order_amount_cents?: number
          payout_id?: string
          referral_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payout_items_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "commission_payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payout_items_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payouts: {
        Row: {
          calculated_at: string
          calculation_details: Json | null
          created_at: string
          currency: string
          failed_at: string | null
          failure_reason: string | null
          id: string
          max_retries: number
          metadata: Json | null
          net_amount_cents: number
          next_retry_at: string | null
          notes: string | null
          paid_at: string | null
          payment_fee_cents: number
          payment_method: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          processed_at: string | null
          referral_code_id: string
          retry_count: number
          status: Database["referrals"]["Enums"]["commission_status"]
          tax_amount_cents: number
          total_amount_cents: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          calculated_at?: string
          calculation_details?: Json | null
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          max_retries?: number
          metadata?: Json | null
          net_amount_cents: number
          next_retry_at?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_fee_cents?: number
          payment_method?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          processed_at?: string | null
          referral_code_id: string
          retry_count?: number
          status?: Database["referrals"]["Enums"]["commission_status"]
          tax_amount_cents?: number
          total_amount_cents?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          calculated_at?: string
          calculation_details?: Json | null
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          max_retries?: number
          metadata?: Json | null
          net_amount_cents?: number
          next_retry_at?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_fee_cents?: number
          payment_method?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          processed_at?: string | null
          referral_code_id?: string
          retry_count?: number
          status?: Database["referrals"]["Enums"]["commission_status"]
          tax_amount_cents?: number
          total_amount_cents?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payouts_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      dpia_test_results: {
        Row: {
          column_name: string | null
          compliance_level: string
          created_at: string
          id: string
          remediation_notes: string | null
          remediation_required: boolean
          risk_level: string
          table_name: string | null
          test_category: string
          test_description: string
          test_execution_time: unknown | null
          test_name: string
          test_result: Json
          test_status: string
          updated_at: string
        }
        Insert: {
          column_name?: string | null
          compliance_level: string
          created_at?: string
          id?: string
          remediation_notes?: string | null
          remediation_required?: boolean
          risk_level: string
          table_name?: string | null
          test_category: string
          test_description: string
          test_execution_time?: unknown | null
          test_name: string
          test_result?: Json
          test_status: string
          updated_at?: string
        }
        Update: {
          column_name?: string | null
          compliance_level?: string
          created_at?: string
          id?: string
          remediation_notes?: string | null
          remediation_required?: boolean
          risk_level?: string
          table_name?: string | null
          test_category?: string
          test_description?: string
          test_execution_time?: unknown | null
          test_name?: string
          test_result?: Json
          test_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      drift_prevention_rules: {
        Row: {
          constraint_config: Json
          constraint_type: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          priority: number
          rule_name: string
          updated_at: string
        }
        Insert: {
          constraint_config?: Json
          constraint_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          rule_name: string
          updated_at?: string
        }
        Update: {
          constraint_config?: Json
          constraint_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          priority?: number
          rule_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      edge_case_test_configs: {
        Row: {
          created_at: string
          expected_behavior: string
          id: string
          is_active: boolean
          test_category: string
          test_config: Json
          test_description: string
          test_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_behavior: string
          id?: string
          is_active?: boolean
          test_category: string
          test_config?: Json
          test_description: string
          test_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_behavior?: string
          id?: string
          is_active?: boolean
          test_category?: string
          test_config?: Json
          test_description?: string
          test_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      edge_case_test_results: {
        Row: {
          actual_behavior: string | null
          consistency_violations: Json | null
          created_at: string
          edge_case_triggered: boolean | null
          error_details: Json | null
          id: string
          partition_issues: Json | null
          race_condition_detected: boolean | null
          salt_rotation_issues: Json | null
          test_config_id: string | null
          test_end_timestamp: string | null
          test_execution_id: string
          test_metrics: Json | null
          test_start_timestamp: string
          test_status: string
        }
        Insert: {
          actual_behavior?: string | null
          consistency_violations?: Json | null
          created_at?: string
          edge_case_triggered?: boolean | null
          error_details?: Json | null
          id?: string
          partition_issues?: Json | null
          race_condition_detected?: boolean | null
          salt_rotation_issues?: Json | null
          test_config_id?: string | null
          test_end_timestamp?: string | null
          test_execution_id: string
          test_metrics?: Json | null
          test_start_timestamp: string
          test_status?: string
        }
        Update: {
          actual_behavior?: string | null
          consistency_violations?: Json | null
          created_at?: string
          edge_case_triggered?: boolean | null
          error_details?: Json | null
          id?: string
          partition_issues?: Json | null
          race_condition_detected?: boolean | null
          salt_rotation_issues?: Json | null
          test_config_id?: string | null
          test_end_timestamp?: string | null
          test_execution_id?: string
          test_metrics?: Json | null
          test_start_timestamp?: string
          test_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "edge_case_test_results_test_config_id_fkey"
            columns: ["test_config_id"]
            isOneToOne: false
            referencedRelation: "edge_case_test_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      error_budget_tracking: {
        Row: {
          budget_consumed_percent: number
          budget_id: number
          budget_remaining_percent: number | null
          created_at: string
          error_rate_percent: number | null
          failed_requests: number
          rollback_reason: string | null
          rollback_triggered: boolean
          service_name: string
          slow_rate_percent: number | null
          slow_requests: number
          time_window: string
          total_requests: number
          window_end: string
          window_start: string
        }
        Insert: {
          budget_consumed_percent?: number
          budget_id?: number
          budget_remaining_percent?: number | null
          created_at?: string
          error_rate_percent?: number | null
          failed_requests?: number
          rollback_reason?: string | null
          rollback_triggered?: boolean
          service_name: string
          slow_rate_percent?: number | null
          slow_requests?: number
          time_window: string
          total_requests?: number
          window_end: string
          window_start: string
        }
        Update: {
          budget_consumed_percent?: number
          budget_id?: number
          budget_remaining_percent?: number | null
          created_at?: string
          error_rate_percent?: number | null
          failed_requests?: number
          rollback_reason?: string | null
          rollback_triggered?: boolean
          service_name?: string
          slow_rate_percent?: number | null
          slow_requests?: number
          time_window?: string
          total_requests?: number
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          flag_key: string
          flag_name: string
          id: string
          is_enabled: boolean
          metadata: Json | null
          rollout_percentage: number
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          flag_key: string
          flag_name: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          rollout_percentage?: number
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          flag_key?: string
          flag_name?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          rollout_percentage?: number
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      geo_region_mapping: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          gdpr_applicable: boolean
          id: string
          is_eu: boolean
          region_code: string
          region_name: string
          updated_at: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          gdpr_applicable?: boolean
          id?: string
          is_eu?: boolean
          region_code: string
          region_name: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          gdpr_applicable?: boolean
          id?: string
          is_eu?: boolean
          region_code?: string
          region_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      load_test_configurations: {
        Row: {
          created_at: string
          created_by: string | null
          duration_seconds: number
          id: string
          is_active: boolean
          target_operations_per_second: number
          test_config: Json
          test_name: string
          test_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_seconds: number
          id?: string
          is_active?: boolean
          target_operations_per_second: number
          test_config?: Json
          test_name: string
          test_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_seconds?: number
          id?: string
          is_active?: boolean
          target_operations_per_second?: number
          test_config?: Json
          test_name?: string
          test_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      load_test_results: {
        Row: {
          actual_ops_achieved: number | null
          avg_response_time_ms: number | null
          created_at: string
          end_timestamp: string | null
          error_count: number
          error_details: Json | null
          id: string
          max_response_time_ms: number | null
          operation_type: string
          p95_response_time_ms: number | null
          p99_response_time_ms: number | null
          start_timestamp: string
          success_count: number
          system_metrics: Json | null
          target_ops_per_second: number
          test_configuration_id: string | null
          test_execution_id: string
          test_status: string
          throughput_achieved: number | null
          timeout_count: number
        }
        Insert: {
          actual_ops_achieved?: number | null
          avg_response_time_ms?: number | null
          created_at?: string
          end_timestamp?: string | null
          error_count?: number
          error_details?: Json | null
          id?: string
          max_response_time_ms?: number | null
          operation_type: string
          p95_response_time_ms?: number | null
          p99_response_time_ms?: number | null
          start_timestamp: string
          success_count?: number
          system_metrics?: Json | null
          target_ops_per_second: number
          test_configuration_id?: string | null
          test_execution_id: string
          test_status?: string
          throughput_achieved?: number | null
          timeout_count?: number
        }
        Update: {
          actual_ops_achieved?: number | null
          avg_response_time_ms?: number | null
          created_at?: string
          end_timestamp?: string | null
          error_count?: number
          error_details?: Json | null
          id?: string
          max_response_time_ms?: number | null
          operation_type?: string
          p95_response_time_ms?: number | null
          p99_response_time_ms?: number | null
          start_timestamp?: string
          success_count?: number
          system_metrics?: Json | null
          target_ops_per_second?: number
          test_configuration_id?: string | null
          test_execution_id?: string
          test_status?: string
          throughput_achieved?: number | null
          timeout_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "load_test_results_test_configuration_id_fkey"
            columns: ["test_configuration_id"]
            isOneToOne: false
            referencedRelation: "load_test_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_monitoring_config: {
        Row: {
          alert_webhook_url: string | null
          config_id: number
          created_at: string
          is_active: boolean
          metric_name: string
          monitoring_interval_seconds: number
          rollback_trigger: boolean
          severity_level: string
          threshold_unit: string
          threshold_value: number
          updated_at: string
        }
        Insert: {
          alert_webhook_url?: string | null
          config_id?: number
          created_at?: string
          is_active?: boolean
          metric_name: string
          monitoring_interval_seconds?: number
          rollback_trigger?: boolean
          severity_level: string
          threshold_unit: string
          threshold_value: number
          updated_at?: string
        }
        Update: {
          alert_webhook_url?: string | null
          config_id?: number
          created_at?: string
          is_active?: boolean
          metric_name?: string
          monitoring_interval_seconds?: number
          rollback_trigger?: boolean
          severity_level?: string
          threshold_unit?: string
          threshold_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          commission_currency: string
          commission_type: string
          commission_value: number
          conversion_timeout_days: number
          created_at: string
          created_by: string
          description: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          is_public: boolean
          max_referrals_per_user: number | null
          metadata: Json | null
          min_payout_amount: number
          program_key: string
          program_name: string
          program_type: Database["referrals"]["Enums"]["program_type"]
          promotional_materials: Json | null
          referral_validity_days: number
          starts_at: string | null
          target_tiers: Json | null
          terms_conditions_url: string | null
          tracking_params: Json | null
          updated_at: string
        }
        Insert: {
          commission_currency?: string
          commission_type: string
          commission_value: number
          conversion_timeout_days?: number
          created_at?: string
          created_by: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          max_referrals_per_user?: number | null
          metadata?: Json | null
          min_payout_amount?: number
          program_key: string
          program_name: string
          program_type?: Database["referrals"]["Enums"]["program_type"]
          promotional_materials?: Json | null
          referral_validity_days?: number
          starts_at?: string | null
          target_tiers?: Json | null
          terms_conditions_url?: string | null
          tracking_params?: Json | null
          updated_at?: string
        }
        Update: {
          commission_currency?: string
          commission_type?: string
          commission_value?: number
          conversion_timeout_days?: number
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          max_referrals_per_user?: number | null
          metadata?: Json | null
          min_payout_amount?: number
          program_key?: string
          program_name?: string
          program_type?: Database["referrals"]["Enums"]["program_type"]
          promotional_materials?: Json | null
          referral_validity_days?: number
          starts_at?: string | null
          target_tiers?: Json | null
          terms_conditions_url?: string | null
          tracking_params?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          code_type: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          landing_page_url: string | null
          last_used_at: string | null
          max_uses: number | null
          metadata: Json | null
          notes: string | null
          paid_earnings_cents: number
          pending_earnings_cents: number
          program_id: string
          total_clicks: number
          total_conversions: number
          total_earnings_cents: number
          updated_at: string
          user_id: string
          uses_count: number
          utm_campaign: string | null
          utm_medium: string
          utm_source: string
        }
        Insert: {
          code: string
          code_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          landing_page_url?: string | null
          last_used_at?: string | null
          max_uses?: number | null
          metadata?: Json | null
          notes?: string | null
          paid_earnings_cents?: number
          pending_earnings_cents?: number
          program_id: string
          total_clicks?: number
          total_conversions?: number
          total_earnings_cents?: number
          updated_at?: string
          user_id: string
          uses_count?: number
          utm_campaign?: string | null
          utm_medium?: string
          utm_source?: string
        }
        Update: {
          code?: string
          code_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          landing_page_url?: string | null
          last_used_at?: string | null
          max_uses?: number | null
          metadata?: Json | null
          notes?: string | null
          paid_earnings_cents?: number
          pending_earnings_cents?: number
          program_id?: string
          total_clicks?: number
          total_conversions?: number
          total_earnings_cents?: number
          updated_at?: string
          user_id?: string
          uses_count?: number
          utm_campaign?: string | null
          utm_medium?: string
          utm_source?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          clicked_at: string
          commission_amount_cents: number | null
          confirmed_at: string | null
          converted_at: string | null
          created_at: string
          entitlement_id: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          landing_page: string | null
          metadata: Json | null
          notes: string | null
          order_amount_cents: number | null
          referral_code_id: string
          referred_id: string | null
          referrer_id: string
          referrer_url: string | null
          registered_at: string | null
          session_id: string | null
          status: Database["referrals"]["Enums"]["referral_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier_purchased: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          clicked_at?: string
          commission_amount_cents?: number | null
          confirmed_at?: string | null
          converted_at?: string | null
          created_at?: string
          entitlement_id?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          metadata?: Json | null
          notes?: string | null
          order_amount_cents?: number | null
          referral_code_id: string
          referred_id?: string | null
          referrer_id: string
          referrer_url?: string | null
          registered_at?: string | null
          session_id?: string | null
          status?: Database["referrals"]["Enums"]["referral_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_purchased?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          clicked_at?: string
          commission_amount_cents?: number | null
          confirmed_at?: string | null
          converted_at?: string | null
          created_at?: string
          entitlement_id?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          metadata?: Json | null
          notes?: string | null
          order_amount_cents?: number | null
          referral_code_id?: string
          referred_id?: string | null
          referrer_id?: string
          referrer_url?: string | null
          registered_at?: string | null
          session_id?: string | null
          status?: Database["referrals"]["Enums"]["referral_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_purchased?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      rollback_execution_log: {
        Row: {
          completed_at: string | null
          execution_status: string
          execution_time_ms: number | null
          impact_assessment: Json
          initiated_at: string
          initiated_by: string
          notes: string | null
          recovery_actions: string[] | null
          reverted_at: string | null
          rollback_actions_taken: string[]
          rollback_config: Json
          rollback_id: number
          rollback_type: string
          trigger_metric: string
          trigger_threshold: number
          trigger_value: number
        }
        Insert: {
          completed_at?: string | null
          execution_status: string
          execution_time_ms?: number | null
          impact_assessment?: Json
          initiated_at?: string
          initiated_by?: string
          notes?: string | null
          recovery_actions?: string[] | null
          reverted_at?: string | null
          rollback_actions_taken?: string[]
          rollback_config?: Json
          rollback_id?: number
          rollback_type: string
          trigger_metric: string
          trigger_threshold: number
          trigger_value: number
        }
        Update: {
          completed_at?: string | null
          execution_status?: string
          execution_time_ms?: number | null
          impact_assessment?: Json
          initiated_at?: string
          initiated_by?: string
          notes?: string | null
          recovery_actions?: string[] | null
          reverted_at?: string | null
          rollback_actions_taken?: string[]
          rollback_config?: Json
          rollback_id?: number
          rollback_type?: string
          trigger_metric?: string
          trigger_threshold?: number
          trigger_value?: number
        }
        Relationships: []
      }
      system_anomalies: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          affected_entity_id: string | null
          affected_entity_type: string | null
          anomaly_type: string
          created_at: string
          description: string
          detection_timestamp: string
          id: string
          metric_values: Json
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          threshold_values: Json
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_entity_id?: string | null
          affected_entity_type?: string | null
          anomaly_type: string
          created_at?: string
          description: string
          detection_timestamp?: string
          id?: string
          metric_values?: Json
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          threshold_values?: Json
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_entity_id?: string | null
          affected_entity_type?: string | null
          anomaly_type?: string
          created_at?: string
          description?: string
          detection_timestamp?: string
          id?: string
          metric_values?: Json
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          threshold_values?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracking_clicks: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          conversion_delay_hours: number | null
          converted: boolean
          country_code: string | null
          device_type: string | null
          id: string | null
          ip_address: string | null
          landing_page: string
          metadata: Json | null
          referral_code_id: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page: string
          metadata?: Json | null
          referral_code_id: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page?: string
          metadata?: Json | null
          referral_code_id?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_clicks_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_clicks_2025_01: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          conversion_delay_hours: number | null
          converted: boolean
          country_code: string | null
          device_type: string | null
          id: string | null
          ip_address: string | null
          landing_page: string
          metadata: Json | null
          referral_code_id: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page: string
          metadata?: Json | null
          referral_code_id: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page?: string
          metadata?: Json | null
          referral_code_id?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      tracking_clicks_2025_02: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          conversion_delay_hours: number | null
          converted: boolean
          country_code: string | null
          device_type: string | null
          id: string | null
          ip_address: string | null
          landing_page: string
          metadata: Json | null
          referral_code_id: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page: string
          metadata?: Json | null
          referral_code_id: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page?: string
          metadata?: Json | null
          referral_code_id?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      tracking_clicks_2025_03: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          conversion_delay_hours: number | null
          converted: boolean
          country_code: string | null
          device_type: string | null
          id: string | null
          ip_address: string | null
          landing_page: string
          metadata: Json | null
          referral_code_id: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page: string
          metadata?: Json | null
          referral_code_id: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page?: string
          metadata?: Json | null
          referral_code_id?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      tracking_clicks_default: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string
          conversion_delay_hours: number | null
          converted: boolean
          country_code: string | null
          device_type: string | null
          id: string | null
          ip_address: string | null
          landing_page: string
          metadata: Json | null
          referral_code_id: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page: string
          metadata?: Json | null
          referral_code_id: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string
          conversion_delay_hours?: number | null
          converted?: boolean
          country_code?: string | null
          device_type?: string | null
          id?: string | null
          ip_address?: string | null
          landing_page?: string
          metadata?: Json | null
          referral_code_id?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_anomalies_dashboard: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by_name: string | null
          affected_entity_type: string | null
          anomaly_type: string | null
          description: string | null
          detection_timestamp: string | null
          id: string | null
          metric_values: Json | null
          minutes_since_detection: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by_name: string | null
          severity: string | null
          severity_score: number | null
          status: string | null
          threshold_values: Json | null
          title: string | null
          urgency_score: number | null
        }
        Relationships: []
      }
      business_rules_summary: {
        Row: {
          attribution_model: string | null
          attribution_model_rules: number | null
          attribution_window_days: string | null
          check_timestamp: string | null
          compliance_status: string | null
          eligibility_rules: number | null
          primary_tie_break_method: string | null
          summary_type: string | null
          tie_break_rules: number | null
          time_window_rules: number | null
          total_active_rules: number | null
        }
        Relationships: []
      }
      drift_prevention_monitor: {
        Row: {
          active_drift_rules: number | null
          check_timestamp: string | null
          compliance_status: string | null
          drift_prevention_trigger_active: boolean | null
          monitor_type: string | null
          total_confirmed_conversions: number | null
          unique_converted_visitors: number | null
          validation_function_active: boolean | null
          visitors_with_multiple_conversions_same_program: number | null
        }
        Relationships: []
      }
      edge_case_testing_dashboard: {
        Row: {
          actual_behavior: string | null
          config_created_at: string | null
          consistency_violations: Json | null
          edge_case_triggered: boolean | null
          expected_behavior: string | null
          latest_execution_id: string | null
          latest_status: string | null
          latest_test_start: string | null
          race_condition_detected: boolean | null
          result_created_at: string | null
          risk_level: string | null
          test_category: string | null
          test_description: string | null
          test_metrics: Json | null
          test_name: string | null
          test_outcome: string | null
        }
        Relationships: []
      }
      system_health_summary: {
        Row: {
          active_programs: number | null
          active_referral_codes: number | null
          check_timestamp: string | null
          clicks_last_hour: number | null
          confirmed_referrals: number | null
          conversions_last_hour: number | null
          converted_clicks: number | null
          critical_anomalies: number | null
          disabled_features: number | null
          enabled_features: number | null
          high_anomalies: number | null
          low_anomalies: number | null
          medium_anomalies: number | null
          overall_status: string | null
          paid_referrals: number | null
          partition_count: number | null
          pending_referrals: number | null
          referrals_last_hour: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      anonymize_user_referral_data: {
        Args: { p_requester_id?: string; p_user_id: string }
        Returns: Json
      }
      check_business_rules_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_active: boolean
          rule_config: Json
          rule_name: string
          rule_type: string
          status: string
        }[]
      }
      check_default_partition: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      check_dpia_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          compliance_notes: string
          findings_count: number
          risk_level: string
          test_name: string
          test_status: string
        }[]
      }
      check_flag_enabled: {
        Args: { flag_key: string }
        Returns: boolean
      }
      check_performance_thresholds: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      delete_user_referral_data: {
        Args: {
          p_preserve_financial_records?: boolean
          p_requester_id?: string
          p_user_id: string
        }
        Returns: Json
      }
      execute_automatic_rollback: {
        Args: {
          current_value: number
          threshold_value: number
          trigger_metric: string
        }
        Returns: Json
      }
      export_user_referral_data: {
        Args: { p_request_type?: string; p_user_id: string }
        Returns: Json
      }
      generate_referral_code: {
        Args: {
          p_preferred_code?: string
          p_program_key: string
          p_user_id: string
        }
        Returns: Json
      }
      get_error_budget_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_region_from_country: {
        Args: { country_code: string }
        Returns: Json
      }
      get_user_referral_stats: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      hash_ip_daily_salt: {
        Args: { ip_address: unknown }
        Returns: string
      }
      maintain_tracking_partitions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      minimize_geo_data: {
        Args: { city: string; country_code: string }
        Returns: Json
      }
      normalize_code: {
        Args: { input_code: string }
        Returns: string
      }
      process_referral_conversion: {
        Args: {
          p_entitlement_id?: string
          p_order_amount_cents: number
          p_referred_user_id: string
          p_stripe_subscription_id?: string
          p_tier_purchased: string
        }
        Returns: Json
      }
      scan_for_anomalies: {
        Args: Record<PropertyKey, never>
        Returns: {
          anomaly_type: string
          description: string
          metric_value: number
          severity: string
          threshold_value: number
        }[]
      }
      truncate_ip_to_network: {
        Args: { ip_address: unknown }
        Returns: unknown
      }
      validate_edge_cases_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          edge_case_covered: boolean
          system_resilience: string
          test_category: string
          test_name: string
          validation_status: string
        }[]
      }
      validate_referral_code_stable: {
        Args: { code_input: string }
        Returns: Json
      }
    }
    Enums: {
      commission_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "disputed"
        | "cancelled"
      program_type:
        | "standard"
        | "ambassador"
        | "influencer"
        | "affiliate"
        | "special"
      referral_status:
        | "pending"
        | "confirmed"
        | "paid"
        | "cancelled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  util: {
    Tables: {
      analytics_retention_policies: {
        Row: {
          archive_after_months: number | null
          auto_archive: boolean
          created_at: string
          data_type: string
          gdpr_compliant: boolean
          id: string
          include_pii: boolean
          retention_months: number
          updated_at: string
        }
        Insert: {
          archive_after_months?: number | null
          auto_archive?: boolean
          created_at?: string
          data_type: string
          gdpr_compliant?: boolean
          id?: string
          include_pii?: boolean
          retention_months?: number
          updated_at?: string
        }
        Update: {
          archive_after_months?: number | null
          auto_archive?: boolean
          created_at?: string
          data_type?: string
          gdpr_compliant?: boolean
          id?: string
          include_pii?: boolean
          retention_months?: number
          updated_at?: string
        }
        Relationships: []
      }
      deprecation_timeline: {
        Row: {
          breaking_changes: Json
          created_at: string
          current_phase: string
          deprecation_date: string | null
          feature_name: string
          id: string
          migration_guide_url: string | null
          removal_date: string | null
          replacement_info: Json
          sunset_date: string | null
          updated_at: string
        }
        Insert: {
          breaking_changes?: Json
          created_at?: string
          current_phase: string
          deprecation_date?: string | null
          feature_name: string
          id?: string
          migration_guide_url?: string | null
          removal_date?: string | null
          replacement_info?: Json
          sunset_date?: string | null
          updated_at?: string
        }
        Update: {
          breaking_changes?: Json
          created_at?: string
          current_phase?: string
          deprecation_date?: string | null
          feature_name?: string
          id?: string
          migration_guide_url?: string | null
          removal_date?: string | null
          replacement_info?: Json
          sunset_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          flag_key: string
          id: string
          is_enabled: boolean
          rollout_percentage: number
          target_conditions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          flag_key: string
          id?: string
          is_enabled?: boolean
          rollout_percentage?: number
          target_conditions?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          flag_key?: string
          id?: string
          is_enabled?: boolean
          rollout_percentage?: number
          target_conditions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      function_decomposition_strategy: {
        Row: {
          concurrency_improvement: string
          created_at: string | null
          decomposed_functions: string[]
          decomposition_reason: string
          expected_performance_gain: string
          id: string
          implementation_status: string | null
          original_function: string
        }
        Insert: {
          concurrency_improvement: string
          created_at?: string | null
          decomposed_functions: string[]
          decomposition_reason: string
          expected_performance_gain: string
          id?: string
          implementation_status?: string | null
          original_function: string
        }
        Update: {
          concurrency_improvement?: string
          created_at?: string | null
          decomposed_functions?: string[]
          decomposition_reason?: string
          expected_performance_gain?: string
          id?: string
          implementation_status?: string | null
          original_function?: string
        }
        Relationships: []
      }
      function_performance_log: {
        Row: {
          batch_size: number | null
          completed_at: string | null
          concurrent_executions: number | null
          error_message: string | null
          execution_time_ms: number
          function_name: string
          function_schema: string
          id: string
          metadata: Json | null
          session_hash: string | null
          started_at: string
          success: boolean
          user_id: string | null
        }
        Insert: {
          batch_size?: number | null
          completed_at?: string | null
          concurrent_executions?: number | null
          error_message?: string | null
          execution_time_ms: number
          function_name: string
          function_schema: string
          id?: string
          metadata?: Json | null
          session_hash?: string | null
          started_at: string
          success?: boolean
          user_id?: string | null
        }
        Update: {
          batch_size?: number | null
          completed_at?: string | null
          concurrent_executions?: number | null
          error_message?: string | null
          execution_time_ms?: number
          function_name?: string
          function_schema?: string
          id?: string
          metadata?: Json | null
          session_hash?: string | null
          started_at?: string
          success?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      function_performance_metrics: {
        Row: {
          concurrent_executions: number | null
          connection_id: string | null
          error_message: string | null
          executed_at: string | null
          execution_time_ms: number
          function_name: string
          function_schema: string
          id: string
          lock_wait_time_ms: number | null
          memory_used_kb: number | null
          parameters_hash: string | null
          rows_affected: number | null
          session_context: Json | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          concurrent_executions?: number | null
          connection_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          execution_time_ms: number
          function_name: string
          function_schema: string
          id?: string
          lock_wait_time_ms?: number | null
          memory_used_kb?: number | null
          parameters_hash?: string | null
          rows_affected?: number | null
          session_context?: Json | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          concurrent_executions?: number | null
          connection_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          execution_time_ms?: number
          function_name?: string
          function_schema?: string
          id?: string
          lock_wait_time_ms?: number | null
          memory_used_kb?: number | null
          parameters_hash?: string | null
          rows_affected?: number | null
          session_context?: Json | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          details: Json
          fulfillment_data: Json | null
          id: string
          legal_basis: string | null
          processed_by: string | null
          request_type: string
          requested_at: string
          retention_override_reason: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          details?: Json
          fulfillment_data?: Json | null
          id?: string
          legal_basis?: string | null
          processed_by?: string | null
          request_type: string
          requested_at?: string
          retention_override_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          details?: Json
          fulfillment_data?: Json | null
          id?: string
          legal_basis?: string | null
          processed_by?: string | null
          request_type?: string
          requested_at?: string
          retention_override_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      index_usage_history: {
        Row: {
          id: string
          index_name: string
          scan_count: number
          schema_name: string
          size_bytes: number
          snapshot_date: string
          table_name: string
          tuples_fetched: number
          tuples_read: number
          usage_category: string
        }
        Insert: {
          id?: string
          index_name: string
          scan_count?: number
          schema_name: string
          size_bytes?: number
          snapshot_date?: string
          table_name: string
          tuples_fetched?: number
          tuples_read?: number
          usage_category: string
        }
        Update: {
          id?: string
          index_name?: string
          scan_count?: number
          schema_name?: string
          size_bytes?: number
          snapshot_date?: string
          table_name?: string
          tuples_fetched?: number
          tuples_read?: number
          usage_category?: string
        }
        Relationships: []
      }
      job_queue: {
        Row: {
          attempts: number
          completed_at: string | null
          created_at: string
          error_details: Json | null
          id: string
          job_payload: Json
          job_type: string
          max_attempts: number
          scheduled_at: string
          started_at: string | null
          status: Database["public"]["Enums"]["event_status"]
          updated_at: string
        }
        Insert: {
          attempts?: number
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          id?: string
          job_payload?: Json
          job_type: string
          max_attempts?: number
          scheduled_at?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Update: {
          attempts?: number
          completed_at?: string | null
          created_at?: string
          error_details?: Json | null
          id?: string
          job_payload?: Json
          job_type?: string
          max_attempts?: number
          scheduled_at?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Relationships: []
      }
      migration_status: {
        Row: {
          affected_components: string[] | null
          completed_at: string | null
          created_at: string
          id: string
          migration_key: string
          migration_notes: Json | null
          removal_date: string | null
          rollback_deadline: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affected_components?: string[] | null
          completed_at?: string | null
          created_at?: string
          id?: string
          migration_key: string
          migration_notes?: Json | null
          removal_date?: string | null
          rollback_deadline?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affected_components?: string[] | null
          completed_at?: string | null
          created_at?: string
          id?: string
          migration_key?: string
          migration_notes?: Json | null
          removal_date?: string | null
          rollback_deadline?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      migrations_meta: {
        Row: {
          applied_at: string
          checksum: string
          id: string
          migration_name: string
          migration_type: string
          rollback_sql: string | null
        }
        Insert: {
          applied_at?: string
          checksum: string
          id?: string
          migration_name: string
          migration_type?: string
          rollback_sql?: string | null
        }
        Update: {
          applied_at?: string
          checksum?: string
          id?: string
          migration_name?: string
          migration_type?: string
          rollback_sql?: string | null
        }
        Relationships: []
      }
      optimization_migration_log: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          constraint_name: string | null
          id: string
          is_rolled_back: boolean | null
          new_definition: string | null
          notes: string | null
          old_definition: string | null
          operation_type: string
          phase_name: string
          rollback_at: string | null
          rollback_sql: string | null
          table_name: string | null
          table_schema: string | null
          task_name: string
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          constraint_name?: string | null
          id?: string
          is_rolled_back?: boolean | null
          new_definition?: string | null
          notes?: string | null
          old_definition?: string | null
          operation_type: string
          phase_name: string
          rollback_at?: string | null
          rollback_sql?: string | null
          table_name?: string | null
          table_schema?: string | null
          task_name: string
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          constraint_name?: string | null
          id?: string
          is_rolled_back?: boolean | null
          new_definition?: string | null
          notes?: string | null
          old_definition?: string | null
          operation_type?: string
          phase_name?: string
          rollback_at?: string | null
          rollback_sql?: string | null
          table_name?: string | null
          table_schema?: string | null
          task_name?: string
        }
        Relationships: []
      }
      scale_readiness_guide: {
        Row: {
          action_category: string
          action_description: string
          action_title: string
          created_at: string | null
          id: string
          implementation_notes: string | null
          phase_reference: string | null
          priority_level: string
          trigger_condition: string
        }
        Insert: {
          action_category: string
          action_description: string
          action_title: string
          created_at?: string | null
          id?: string
          implementation_notes?: string | null
          phase_reference?: string | null
          priority_level: string
          trigger_condition: string
        }
        Update: {
          action_category?: string
          action_description?: string
          action_title?: string
          created_at?: string | null
          id?: string
          implementation_notes?: string | null
          phase_reference?: string | null
          priority_level?: string
          trigger_condition?: string
        }
        Relationships: []
      }
      slo_alerts: {
        Row: {
          alert_level: string
          alert_message: string
          alert_metadata: Json | null
          created_at: string
          id: string
          resolved_at: string | null
          resolved_by: string | null
          slo_key: string
          triggered_at: string
        }
        Insert: {
          alert_level: string
          alert_message: string
          alert_metadata?: Json | null
          created_at?: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          slo_key: string
          triggered_at?: string
        }
        Update: {
          alert_level?: string
          alert_message?: string
          alert_metadata?: Json | null
          created_at?: string
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          slo_key?: string
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slo_alerts_slo_key_fkey"
            columns: ["slo_key"]
            isOneToOne: false
            referencedRelation: "slo_dashboard"
            referencedColumns: ["slo_key"]
          },
          {
            foreignKeyName: "slo_alerts_slo_key_fkey"
            columns: ["slo_key"]
            isOneToOne: false
            referencedRelation: "slo_definitions"
            referencedColumns: ["slo_key"]
          },
        ]
      }
      slo_definitions: {
        Row: {
          alert_threshold: number
          created_at: string
          critical_threshold: number
          id: string
          is_active: boolean
          measurement_window: unknown
          metric_type: string
          service_component: string
          slo_key: string
          slo_name: string
          target_unit: string
          target_value: number
          updated_at: string
        }
        Insert: {
          alert_threshold: number
          created_at?: string
          critical_threshold: number
          id?: string
          is_active?: boolean
          measurement_window?: unknown
          metric_type: string
          service_component: string
          slo_key: string
          slo_name: string
          target_unit: string
          target_value: number
          updated_at?: string
        }
        Update: {
          alert_threshold?: number
          created_at?: string
          critical_threshold?: number
          id?: string
          is_active?: boolean
          measurement_window?: unknown
          metric_type?: string
          service_component?: string
          slo_key?: string
          slo_name?: string
          target_unit?: string
          target_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      slo_measurements: {
        Row: {
          alert_triggered: boolean | null
          created_at: string
          id: string
          measured_at: string
          measured_value: number
          measurement_metadata: Json | null
          slo_key: string
        }
        Insert: {
          alert_triggered?: boolean | null
          created_at?: string
          id?: string
          measured_at?: string
          measured_value: number
          measurement_metadata?: Json | null
          slo_key: string
        }
        Update: {
          alert_triggered?: boolean | null
          created_at?: string
          id?: string
          measured_at?: string
          measured_value?: number
          measurement_metadata?: Json | null
          slo_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "slo_measurements_slo_key_fkey"
            columns: ["slo_key"]
            isOneToOne: false
            referencedRelation: "slo_dashboard"
            referencedColumns: ["slo_key"]
          },
          {
            foreignKeyName: "slo_measurements_slo_key_fkey"
            columns: ["slo_key"]
            isOneToOne: false
            referencedRelation: "slo_definitions"
            referencedColumns: ["slo_key"]
          },
        ]
      }
      slow_function_alerts: {
        Row: {
          acknowledged_at: string | null
          execution_time_ms: number
          function_name: string
          id: string
          metadata: Json | null
          occurred_at: string | null
          user_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          execution_time_ms: number
          function_name: string
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          user_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          execution_time_ms?: number
          function_name?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      storage_metrics_history: {
        Row: {
          daily_growth_bytes: number | null
          id: string
          index_size_bytes: number | null
          is_business_critical: boolean | null
          measured_at: string | null
          measurement_date: string | null
          row_count: number | null
          schema_name: string
          size_bytes: number
          table_category: string | null
          table_name: string
          total_size_bytes: number | null
        }
        Insert: {
          daily_growth_bytes?: number | null
          id?: string
          index_size_bytes?: number | null
          is_business_critical?: boolean | null
          measured_at?: string | null
          measurement_date?: string | null
          row_count?: number | null
          schema_name: string
          size_bytes: number
          table_category?: string | null
          table_name: string
          total_size_bytes?: number | null
        }
        Update: {
          daily_growth_bytes?: number | null
          id?: string
          index_size_bytes?: number | null
          is_business_critical?: boolean | null
          measured_at?: string | null
          measurement_date?: string | null
          row_count?: number | null
          schema_name?: string
          size_bytes?: number
          table_category?: string | null
          table_name?: string
          total_size_bytes?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      concurrency_improvement_analysis: {
        Row: {
          avg_latency_ms: number | null
          calls_count: number | null
          function_name: string | null
          max_concurrent_seen: number | null
          p95_latency_ms: number | null
          scale_1000_projection: string | null
          slow_calls_count: number | null
        }
        Relationships: []
      }
      function_decomposition_progress: {
        Row: {
          concurrency_improvement: string | null
          created_at: string | null
          expected_performance_gain: string | null
          implementation_status: string | null
          original_function: string | null
          planned_functions_count: number | null
        }
        Insert: {
          concurrency_improvement?: string | null
          created_at?: string | null
          expected_performance_gain?: string | null
          implementation_status?: string | null
          original_function?: string | null
          planned_functions_count?: never
        }
        Update: {
          concurrency_improvement?: string | null
          created_at?: string | null
          expected_performance_gain?: string | null
          implementation_status?: string | null
          original_function?: string | null
          planned_functions_count?: never
        }
        Relationships: []
      }
      function_performance_dashboard: {
        Row: {
          avg_latency_ms: number | null
          avg_lock_wait_ms: number | null
          error_count: number | null
          function_name: string | null
          function_schema: string | null
          max_concurrent: number | null
          p95_latency_ms: number | null
          p99_latency_ms: number | null
          slow_queries_count: number | null
          total_calls_24h: number | null
        }
        Relationships: []
      }
      index_usage_baseline: {
        Row: {
          idx_scan: number | null
          idx_tup_fetch: number | null
          idx_tup_read: number | null
          index_name: unknown | null
          index_size: string | null
          schemaname: unknown | null
          size_bytes: number | null
          snapshot_time: string | null
          table_name: unknown | null
          usage_category: string | null
        }
        Relationships: []
      }
      optimization_migration_status: {
        Row: {
          active_operations: number | null
          first_operation: string | null
          last_operation: string | null
          phase_name: string | null
          rolled_back_operations: number | null
          task_name: string | null
          total_operations: number | null
        }
        Relationships: []
      }
      phase2_monitoring_summary: {
        Row: {
          component: string | null
          description: string | null
          status: string | null
        }
        Relationships: []
      }
      slo_dashboard: {
        Row: {
          active_critical: number | null
          active_warnings: number | null
          alerts_last_24h: number | null
          current_measurement: string | null
          data_freshness: string | null
          health_status: string | null
          last_measured: string | null
          metric_type: string | null
          service_component: string | null
          slo_key: string | null
          slo_name: string | null
          status_icon: string | null
          target: string | null
        }
        Relationships: []
      }
      storage_analysis_by_category: {
        Row: {
          category: string | null
          daily_growth: string | null
          table_count: number | null
          total_bytes: number | null
          total_rows: number | null
          total_size: string | null
        }
        Relationships: []
      }
      when_real_users_arrive: {
        Row: {
          action_category: string | null
          action_description: string | null
          action_title: string | null
          implementation_notes: string | null
          phase_reference: string | null
          priority_level: string | null
          priority_order: number | null
          trigger_condition: string | null
        }
        Insert: {
          action_category?: string | null
          action_description?: string | null
          action_title?: string | null
          implementation_notes?: string | null
          phase_reference?: string | null
          priority_level?: string | null
          priority_order?: never
          trigger_condition?: string | null
        }
        Update: {
          action_category?: string | null
          action_description?: string | null
          action_title?: string | null
          implementation_notes?: string | null
          phase_reference?: string | null
          priority_level?: string | null
          priority_order?: never
          trigger_condition?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      capture_index_usage_snapshot: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_assessment_analytics_compat_view: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_typescript_types_post_hardening: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_uuid_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      log_function_performance: {
        Args: {
          p_batch_size?: number
          p_error_message?: string
          p_function_name: string
          p_function_schema: string
          p_metadata?: Json
          p_session_hash?: string
          p_started_at: string
          p_success?: boolean
          p_user_id?: string
        }
        Returns: string
      }
      start_performance_timer: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  access: {
    Enums: {
      entitlement_status: ["active", "expired", "suspended", "revoked"],
      entitlement_type: [
        "tier",
        "course_specific",
        "time_limited",
        "special_grant",
      ],
    },
  },
  assessments: {
    Enums: {
      attempt_status: [
        "in_progress",
        "submitted",
        "abandoned",
        "graded",
        "needs_review",
        "expired",
      ],
    },
  },
  content: {
    Enums: {
      course_difficulty: ["beginner", "intermediate", "advanced", "expert"],
      lesson_type: ["video", "article", "quiz", "project", "interactive"],
      publication_status: ["draft", "review", "published", "archived"],
    },
  },
  gamification: {
    Enums: {},
  },
  learn: {
    Enums: {
      analytics_event_type: [
        "start",
        "progress",
        "pause",
        "resume",
        "complete",
        "skip",
        "bookmark",
        "note",
        "replay",
        "video_quality_change",
        "video_seek",
        "video_buffer",
        "quiz_start",
        "quiz_submit",
        "quiz_graded",
        "exam_start",
        "exam_submit",
        "exam_graded",
        "cert_start",
        "cert_submit",
        "cert_graded",
        "cert_issued",
        "assessment_start",
        "assessment_submit",
        "assessment_graded",
        "certificate_issued",
      ],
      progress_status: [
        "not_started",
        "in_progress",
        "completed",
        "paused",
        "failed",
      ],
    },
  },
  media: {
    Enums: {},
  },
  public: {
    Enums: {
      audit_operation: [
        "INSERT",
        "UPDATE",
        "DELETE",
        "SELECT",
        "GRANT",
        "REVOKE",
      ],
      event_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
    },
  },
  rbac: {
    Enums: {},
  },
  referrals: {
    Enums: {
      commission_status: [
        "pending",
        "processing",
        "paid",
        "failed",
        "disputed",
        "cancelled",
      ],
      program_type: [
        "standard",
        "ambassador",
        "influencer",
        "affiliate",
        "special",
      ],
      referral_status: ["pending", "confirmed", "paid", "cancelled", "expired"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
  util: {
    Enums: {},
  },
} as const
