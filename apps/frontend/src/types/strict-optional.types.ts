/**
 * TypeScript strict optional property types utilities
 * 
 * These types help handle the `exactOptionalPropertyTypes` compiler option
 * which enforces strict handling of optional properties with undefined values.
 */

/**
 * Helper type to make properties explicitly optional with undefined
 * Compatible with exactOptionalPropertyTypes: true
 */
export type StrictOptional<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P] | undefined;
};

/**
 * Helper type to handle nullable database fields properly
 * Converts null | T to T | undefined for optional properties
 */
export type NullableToUndefined<T> = T extends null ? undefined : T;

/**
 * Type helper for activity data transformation
 * Handles the mismatch between database types and UI component expectations
 */
export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  timestamp: string;
  badge?: string;
  thumbnail?: string;
  instructor?: string;
}

/**
 * Helper to transform database activity logs to UI activities
 */
export type ActivityLogToActivity = (log: {
  action: string;
  created_at: string | null;
  details: Json;
  id: string;
  type: string;
  user_id: string;
}) => Activity;

/**
 * Type for handling course progress with extended fields
 */
export interface CourseWithProgress {
  id: string;
  title: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  category: string | null;
  cover_image_url: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  is_published: boolean;
  slug: string;
  thumbnail_url: string | null;
  // Extended progress fields
  progress?: number;
  total_lessons?: number;
  completed_lessons?: number;
  completion_percentage?: number;
  last_accessed?: string | null;
  status?: 'not_started' | 'in_progress' | 'completed';
  enrolled_at?: string | null;
  lessons?: LessonItem[];
}

/**
 * Interface for lesson items in modules
 */
export interface LessonItem {
  id: string;
  title: string;
  duration: string; // Always string for UI consistency
  completed: boolean;
  current: boolean;
}

/**
 * Interface for module items
 */
export interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

/**
 * Lesson resource type
 */
export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'document';
  url: string;
  description?: string;
}

/**
 * JSON type for database compatibility
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];