import type { Database } from '../types/database.types';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", {
    Tables: {
        achievements: {
            Row: {
                created_at: string | null;
                description: string | null;
                earned: boolean | null;
                icon: string | null;
                id: string;
                rarity: string | null;
                title: string;
                user_id: string | null;
                xp_reward: number | null;
            };
            Insert: {
                created_at?: string | null;
                description?: string | null;
                earned?: boolean | null;
                icon?: string | null;
                id?: string;
                rarity?: string | null;
                title: string;
                user_id?: string | null;
                xp_reward?: number | null;
            };
            Update: {
                created_at?: string | null;
                description?: string | null;
                earned?: boolean | null;
                icon?: string | null;
                id?: string;
                rarity?: string | null;
                title?: string;
                user_id?: string | null;
                xp_reward?: number | null;
            };
            Relationships: [];
        };
        activity_log: {
            Row: {
                action: string;
                created_at: string | null;
                details: import("../types/database.types").Json | null;
                id: string;
                type: string;
                user_id: string;
            };
            Insert: {
                action: string;
                created_at?: string | null;
                details?: import("../types/database.types").Json | null;
                id?: string;
                type: string;
                user_id: string;
            };
            Update: {
                action?: string;
                created_at?: string | null;
                details?: import("../types/database.types").Json | null;
                id?: string;
                type?: string;
                user_id?: string;
            };
            Relationships: [];
        };
        coupons: {
            Row: {
                code: string;
                created_at: string | null;
                current_uses: number | null;
                discount_percent: number;
                id: string;
                is_active: boolean | null;
                max_uses: number | null;
                valid_from: string | null;
                valid_to: string | null;
            };
            Insert: {
                code: string;
                created_at?: string | null;
                current_uses?: number | null;
                discount_percent: number;
                id?: string;
                is_active?: boolean | null;
                max_uses?: number | null;
                valid_from?: string | null;
                valid_to?: string | null;
            };
            Update: {
                code?: string;
                created_at?: string | null;
                current_uses?: number | null;
                discount_percent?: number;
                id?: string;
                is_active?: boolean | null;
                max_uses?: number | null;
                valid_from?: string | null;
                valid_to?: string | null;
            };
            Relationships: [];
        };
        courses: {
            Row: {
                category: string | null;
                cover_image_url: string | null;
                created_at: string | null;
                description: string | null;
                difficulty: string | null;
                id: string;
                is_published: boolean | null;
                slug: string;
                thumbnail_url: string | null;
                title: string;
                updated_at: string | null;
            };
            Insert: {
                category?: string | null;
                cover_image_url?: string | null;
                created_at?: string | null;
                description?: string | null;
                difficulty?: string | null;
                id?: string;
                is_published?: boolean | null;
                slug: string;
                thumbnail_url?: string | null;
                title: string;
                updated_at?: string | null;
            };
            Update: {
                category?: string | null;
                cover_image_url?: string | null;
                created_at?: string | null;
                description?: string | null;
                difficulty?: string | null;
                id?: string;
                is_published?: boolean | null;
                slug?: string;
                thumbnail_url?: string | null;
                title?: string;
                updated_at?: string | null;
            };
            Relationships: [];
        };
        lesson_analytics: {
            Row: {
                completed_at: string | null;
                completion_percentage: number | null;
                id: string;
                interactions: import("../types/database.types").Json | null;
                lesson_id: string | null;
                started_at: string | null;
                time_spent_minutes: number | null;
                user_id: string | null;
            };
            Insert: {
                completed_at?: string | null;
                completion_percentage?: number | null;
                id?: string;
                interactions?: import("../types/database.types").Json | null;
                lesson_id?: string | null;
                started_at?: string | null;
                time_spent_minutes?: number | null;
                user_id?: string | null;
            };
            Update: {
                completed_at?: string | null;
                completion_percentage?: number | null;
                id?: string;
                interactions?: import("../types/database.types").Json | null;
                lesson_id?: string | null;
                started_at?: string | null;
                time_spent_minutes?: number | null;
                user_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "lesson_analytics_lesson_id_fkey";
                columns: ["lesson_id"];
                isOneToOne: false;
                referencedRelation: "lessons";
                referencedColumns: ["id"];
            }];
        };
        lessons: {
            Row: {
                content: import("../types/database.types").Json | null;
                created_at: string | null;
                duration: number | null;
                id: string;
                is_published: boolean | null;
                lesson_order: number;
                module_id: string | null;
                title: string;
                updated_at: string | null;
            };
            Insert: {
                content?: import("../types/database.types").Json | null;
                created_at?: string | null;
                duration?: number | null;
                id?: string;
                is_published?: boolean | null;
                lesson_order: number;
                module_id?: string | null;
                title: string;
                updated_at?: string | null;
            };
            Update: {
                content?: import("../types/database.types").Json | null;
                created_at?: string | null;
                duration?: number | null;
                id?: string;
                is_published?: boolean | null;
                lesson_order?: number;
                module_id?: string | null;
                title?: string;
                updated_at?: string | null;
            };
            Relationships: [{
                foreignKeyName: "lessons_module_id_fkey";
                columns: ["module_id"];
                isOneToOne: false;
                referencedRelation: "modules";
                referencedColumns: ["id"];
            }];
        };
        media_files: {
            Row: {
                created_at: string | null;
                file_size: number;
                file_type: string;
                filename: string;
                id: string;
                is_public: boolean | null;
                metadata: import("../types/database.types").Json | null;
                original_name: string;
                storage_path: string;
                user_id: string | null;
            };
            Insert: {
                created_at?: string | null;
                file_size: number;
                file_type: string;
                filename: string;
                id?: string;
                is_public?: boolean | null;
                metadata?: import("../types/database.types").Json | null;
                original_name: string;
                storage_path: string;
                user_id?: string | null;
            };
            Update: {
                created_at?: string | null;
                file_size?: number;
                file_type?: string;
                filename?: string;
                id?: string;
                is_public?: boolean | null;
                metadata?: import("../types/database.types").Json | null;
                original_name?: string;
                storage_path?: string;
                user_id?: string | null;
            };
            Relationships: [];
        };
        modules: {
            Row: {
                course_id: string | null;
                created_at: string | null;
                description: string | null;
                id: string;
                is_published: boolean | null;
                module_order: number;
                title: string;
                updated_at: string | null;
            };
            Insert: {
                course_id?: string | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                is_published?: boolean | null;
                module_order: number;
                title: string;
                updated_at?: string | null;
            };
            Update: {
                course_id?: string | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                is_published?: boolean | null;
                module_order?: number;
                title?: string;
                updated_at?: string | null;
            };
            Relationships: [{
                foreignKeyName: "modules_course_id_fkey";
                columns: ["course_id"];
                isOneToOne: false;
                referencedRelation: "courses";
                referencedColumns: ["id"];
            }];
        };
        profiles: {
            Row: {
                avatar_url: string | null;
                company: string | null;
                created_at: string | null;
                current_streak: number | null;
                email: string;
                full_name: string | null;
                id: string;
                is_admin: boolean | null;
                last_completed_at: string | null;
                level: number | null;
                phone: string | null;
                profession: string | null;
                updated_at: string | null;
                xp: number | null;
            };
            Insert: {
                avatar_url?: string | null;
                company?: string | null;
                created_at?: string | null;
                current_streak?: number | null;
                email: string;
                full_name?: string | null;
                id: string;
                is_admin?: boolean | null;
                last_completed_at?: string | null;
                level?: number | null;
                phone?: string | null;
                profession?: string | null;
                updated_at?: string | null;
                xp?: number | null;
            };
            Update: {
                avatar_url?: string | null;
                company?: string | null;
                created_at?: string | null;
                current_streak?: number | null;
                email?: string;
                full_name?: string | null;
                id?: string;
                is_admin?: boolean | null;
                last_completed_at?: string | null;
                level?: number | null;
                phone?: string | null;
                profession?: string | null;
                updated_at?: string | null;
                xp?: number | null;
            };
            Relationships: [];
        };
        rgpd_requests: {
            Row: {
                completed_at: string | null;
                created_at: string | null;
                details: import("../types/database.types").Json | null;
                id: string;
                status: Database["public"]["Enums"]["rgpd_request_status"];
                type: Database["public"]["Enums"]["rgpd_request_type"];
                updated_at: string | null;
                user_id: string;
            };
            Insert: {
                completed_at?: string | null;
                created_at?: string | null;
                details?: import("../types/database.types").Json | null;
                id?: string;
                status?: Database["public"]["Enums"]["rgpd_request_status"];
                type: Database["public"]["Enums"]["rgpd_request_type"];
                updated_at?: string | null;
                user_id: string;
            };
            Update: {
                completed_at?: string | null;
                created_at?: string | null;
                details?: import("../types/database.types").Json | null;
                id?: string;
                status?: Database["public"]["Enums"]["rgpd_request_status"];
                type?: Database["public"]["Enums"]["rgpd_request_type"];
                updated_at?: string | null;
                user_id?: string;
            };
            Relationships: [];
        };
        user_notes: {
            Row: {
                content: string;
                created_at: string | null;
                id: string;
                is_private: boolean | null;
                lesson_id: string | null;
                position: import("../types/database.types").Json | null;
                selected_text: string | null;
                tags: string[] | null;
                updated_at: string | null;
                user_id: string;
            };
            Insert: {
                content: string;
                created_at?: string | null;
                id?: string;
                is_private?: boolean | null;
                lesson_id?: string | null;
                position?: import("../types/database.types").Json | null;
                selected_text?: string | null;
                tags?: string[] | null;
                updated_at?: string | null;
                user_id: string;
            };
            Update: {
                content?: string;
                created_at?: string | null;
                id?: string;
                is_private?: boolean | null;
                lesson_id?: string | null;
                position?: import("../types/database.types").Json | null;
                selected_text?: string | null;
                tags?: string[] | null;
                updated_at?: string | null;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_notes_lesson_id_fkey";
                columns: ["lesson_id"];
                isOneToOne: false;
                referencedRelation: "lessons";
                referencedColumns: ["id"];
            }];
        };
        user_progress: {
            Row: {
                completed_at: string | null;
                created_at: string | null;
                id: string;
                lesson_id: string | null;
                status: string | null;
                updated_at: string | null;
                user_id: string | null;
            };
            Insert: {
                completed_at?: string | null;
                created_at?: string | null;
                id?: string;
                lesson_id?: string | null;
                status?: string | null;
                updated_at?: string | null;
                user_id?: string | null;
            };
            Update: {
                completed_at?: string | null;
                created_at?: string | null;
                id?: string;
                lesson_id?: string | null;
                status?: string | null;
                updated_at?: string | null;
                user_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "user_progress_lesson_id_fkey";
                columns: ["lesson_id"];
                isOneToOne: false;
                referencedRelation: "lessons";
                referencedColumns: ["id"];
            }];
        };
        user_sessions: {
            Row: {
                device_info: import("../types/database.types").Json | null;
                duration_minutes: number | null;
                ended_at: string | null;
                id: string;
                pages_visited: string[] | null;
                started_at: string | null;
                user_id: string | null;
            };
            Insert: {
                device_info?: import("../types/database.types").Json | null;
                duration_minutes?: number | null;
                ended_at?: string | null;
                id?: string;
                pages_visited?: string[] | null;
                started_at?: string | null;
                user_id?: string | null;
            };
            Update: {
                device_info?: import("../types/database.types").Json | null;
                duration_minutes?: number | null;
                ended_at?: string | null;
                id?: string;
                pages_visited?: string[] | null;
                started_at?: string | null;
                user_id?: string | null;
            };
            Relationships: [];
        };
        user_settings: {
            Row: {
                created_at: string | null;
                id: string;
                learning_preferences: import("../types/database.types").Json | null;
                notification_settings: import("../types/database.types").Json | null;
                privacy_settings: import("../types/database.types").Json | null;
                updated_at: string | null;
                user_id: string;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                learning_preferences?: import("../types/database.types").Json | null;
                notification_settings?: import("../types/database.types").Json | null;
                privacy_settings?: import("../types/database.types").Json | null;
                updated_at?: string | null;
                user_id: string;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                learning_preferences?: import("../types/database.types").Json | null;
                notification_settings?: import("../types/database.types").Json | null;
                privacy_settings?: import("../types/database.types").Json | null;
                updated_at?: string | null;
                user_id?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: {
        current_user_is_admin: {
            Args: Record<PropertyKey, never>;
            Returns: boolean;
        };
        email_exists: {
            Args: {
                search_email: string;
            };
            Returns: boolean;
        };
        get_user_settings: {
            Args: {
                user_id?: string;
            };
            Returns: {
                notification_settings: import("../types/database.types").Json;
                privacy_settings: import("../types/database.types").Json;
                learning_preferences: import("../types/database.types").Json;
            }[];
        };
        update_user_profile: {
            Args: {
                profile_data: import("../types/database.types").Json;
                user_id?: string;
            };
            Returns: {
                id: string;
                updated_at: string;
                full_name: string;
                avatar_url: string;
                phone: string;
                profession: string;
                company: string;
            }[];
        };
        update_user_settings: {
            Args: {
                settings_data: import("../types/database.types").Json;
                user_id?: string;
            };
            Returns: {
                notification_settings: import("../types/database.types").Json;
                privacy_settings: import("../types/database.types").Json;
                learning_preferences: import("../types/database.types").Json;
            }[];
        };
    };
    Enums: {
        achievement_rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        progress_status: "not_started" | "in_progress" | "completed";
        rgpd_request_status: "pending" | "processing" | "completed" | "rejected";
        rgpd_request_type: "access" | "deletion" | "rectification";
        user_role_type: "admin" | "instructor" | "student";
    };
    CompositeTypes: { [_ in never]: never; };
}>;
