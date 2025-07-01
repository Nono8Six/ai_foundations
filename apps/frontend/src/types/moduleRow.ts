import { z } from 'zod';
import type { LessonRow } from './lessonRow';
import { LessonRowSchema } from './lessonRow';

export const ModuleRowSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  learningObjectives: z.string().optional(),
  estimatedDuration: z.number().optional(),
  isOptional: z.boolean().optional(),
  lessons: LessonRowSchema.array().optional(),
});

export type ModuleRow = z.infer<typeof ModuleRowSchema>;
