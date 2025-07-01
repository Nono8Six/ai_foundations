import { z } from 'zod';
import type { Json } from './database.types';

export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonSchema),
    z.record(JsonSchema.optional()),
  ])
);

export const CourseRowSchema = z.object({
  category: z.string().nullable(),
  cover_image_url: z.string().nullable(),
  created_at: z.string().nullable(),
  description: z.string().nullable(),
  difficulty: z.string().nullable(),
  id: z.string(),
  is_published: z.boolean().nullable(),
  slug: z.string(),
  thumbnail_url: z.string().nullable(),
  title: z.string(),
  updated_at: z.string().nullable(),
});
export type CourseRow = z.infer<typeof CourseRowSchema>;

export const LessonRowSchema = z.object({
  content: JsonSchema.nullable(),
  created_at: z.string().nullable(),
  duration: z.number().nullable(),
  id: z.string(),
  is_published: z.boolean().nullable(),
  lesson_order: z.number(),
  module_id: z.string().nullable(),
  title: z.string(),
  updated_at: z.string().nullable(),
});
export type LessonRow = z.infer<typeof LessonRowSchema>;

export const ModuleRowSchema = z.object({
  course_id: z.string().nullable(),
  created_at: z.string().nullable(),
  description: z.string().nullable(),
  id: z.string(),
  is_published: z.boolean().nullable(),
  module_order: z.number(),
  title: z.string(),
  updated_at: z.string().nullable(),
});
export type ModuleRow = z.infer<typeof ModuleRowSchema>;

export const UserProgressRowSchema = z.object({
  completed_at: z.string().nullable(),
  created_at: z.string().nullable(),
  id: z.string(),
  lesson_id: z.string().nullable(),
  status: z.string().nullable(),
  updated_at: z.string().nullable(),
  user_id: z.string().nullable(),
});
export type UserProgressRow = z.infer<typeof UserProgressRowSchema>;
