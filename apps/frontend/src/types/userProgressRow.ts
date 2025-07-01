import { z } from 'zod';

export const UserProgressRowSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().nullable().optional(),
  lesson_id: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
});

export type UserProgressRow = z.infer<typeof UserProgressRowSchema>;
