import { z } from 'zod';

export const LessonRowSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string().optional(),
  duration: z.number().optional(),
  videoUrl: z.string().optional(),
  status: z.string().optional(),
  order: z.number(),
  hasQuiz: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  isPreview: z.boolean().optional(),
  completions: z.number().optional(),
});

export type LessonRow = z.infer<typeof LessonRowSchema>;
