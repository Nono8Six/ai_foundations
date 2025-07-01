import { z } from 'zod';

export const CourseRowSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  price: z.number().optional(),
  thumbnail: z.string().optional(),
  status: z.string().optional(),
  prerequisites: z.string().optional(),
  learningObjectives: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedDuration: z.number().optional(),
  tags: z.array(z.string()).optional(),
  enrollments: z.number().optional(),
  rating: z.number().optional(),
});

export type CourseRow = z.infer<typeof CourseRowSchema>;
