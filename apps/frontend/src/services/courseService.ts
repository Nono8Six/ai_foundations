// apps/frontend/src/services/courseService.ts
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import { z } from 'zod';

const supabaseClient = supabase as SupabaseClient<Database>;

type CoursesRow = Database['public']['Tables']['courses']['Row'];
type LessonsRow = Database['public']['Tables']['lessons']['Row'];
type ModulesRow = Database['public']['Tables']['modules']['Row'];
type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];

type CourseWithContent = CoursesRow & {
  modules: (ModulesRow & { lessons: LessonsRow[] })[];
};

type CourseProgress = CoursesRow & {
  progress: { completed: number; total: number };
};

export interface CourseFilters {
  skillLevel?: string[];
  duration?: string[];
  category?: string[];
}

// Zod schemas pour validation runtime + typage TS
const CourseProgressSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    cover_image_url: z.string().nullable(),
    category: z.string().nullable(),
    thumbnail_url: z.string().nullable(),
    progress: z.object({
      completed: z.number(),
      total: z.number(),
    }),
  })
  .passthrough();

const LessonsRowSchema = z
  .object({
    id: z.string(),
    module_id: z.string().nullable(),
    is_published: z.boolean().nullable(),
    duration: z.number().nullable(),
  })
  .passthrough();

const ModulesRowSchema = z
  .object({
    id: z.string(),
    course_id: z.string().nullable(),
  })
  .passthrough();

const UserProgressRowSchema = z
  .object({
    lesson_id: z.string(),
    status: z.string().nullable(),
    completed_at: z.string().nullable(),
  })
  .passthrough();

export const CoursesFromSupabaseSchema = z.object({
  courses: z.array(CourseProgressSchema),
  lessons: z.array(LessonsRowSchema),
  modules: z.array(ModulesRowSchema),
  userProgress: z.array(UserProgressRowSchema),
});

export type CoursesFromSupabase = z.infer<typeof CoursesFromSupabaseSchema>;

export async function fetchCourses({
  search = '',
  filters = {},
  sortBy = 'popularity',
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  filters?: CourseFilters;
  sortBy?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ data: CoursesRow[]; count: number }> {
  const { skillLevel = [], duration = [], category = [] } = filters;
  let query = supabaseClient
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (search) query = query.ilike('title', `%${search}%`);
  if (skillLevel.length) query = query.in('difficulty', skillLevel);
  if (category.length) query = query.in('category', category);
  if (duration.length) {
    const durations: string[] = [];
    if (duration.includes('short')) durations.push('duration_weeks.lte.3');
    if (duration.includes('medium')) durations.push('duration_weeks.gte.4,duration_weeks.lte.6');
    if (duration.includes('long')) durations.push('duration_weeks.gte.7');
    if (durations.length) query = query.or(durations.join(','));
  }

  switch (sortBy) {
    case 'popularity':
    case 'rating':
      query = query.order('created_at', { ascending: false });
      break;
    case 'difficulty':
    case 'duration':
    case 'alphabetical':
      query = query.order('title', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const validated = CourseProgressSchema.array().safeParse(data ?? []);
  if (!validated.success) throw new Error(`Invalid course data: ${validated.error.message}`);

  return { data: validated.data, count: count ?? 0 };
}

export async function fetchCoursesWithContent(): Promise<CourseWithContent[]> {
  const { data, error } = await supabaseClient
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as CourseWithContent[];
}

export async function fetchCoursesFromSupabase(userId: string): Promise<CoursesFromSupabase> {
  const [coursesResult, lessonsResult, modulesResult, progressResult] = await Promise.all([
    safeQuery(() =>
      supabaseClient
        .from('courses')
        .select('id, title, cover_image_url, category, thumbnail_url')
        .eq('is_published', true)
    ),
    safeQuery(() =>
      supabaseClient
        .from('lessons')
        .select('id, module_id, is_published, duration')
        .eq('is_published', true)
    ),
    safeQuery(() => supabaseClient.from('modules').select('id, course_id')),
    safeQuery(() =>
      supabaseClient
        .from('user_progress')
        .select('lesson_id, status, completed_at')
        .eq('user_id', userId)
    ),
  ]);

  [coursesResult, lessonsResult, modulesResult, progressResult].forEach((r) => {
    if (r.error) throw r.error;
  });

  const coursesData = CourseProgressSchema.array().parse(coursesResult.data ?? []);
  const lessonsData = LessonsRowSchema.array().parse(lessonsResult.data ?? []);
  const modulesData = ModulesRowSchema.array().parse(modulesResult.data ?? []);
  const progressData = UserProgressRowSchema.array().parse(progressResult.data ?? []);

  const completedIds = new Set(progressData.filter(p => p.status === 'completed').map(p => p.lesson_id));

  const moduleToCourse: Record<string, string> = {};
  modulesData.forEach(m => { if (m.course_id) moduleToCourse[m.id] = m.course_id });

  const lessonsByCourse: Record<string, string[]> = {};
  lessonsData.forEach(l => {
    const cid = l.module_id ? moduleToCourse[l.module_id] : undefined;
    if (cid) {
      lessonsByCourse[cid] = lessonsByCourse[cid] || [];
      lessonsByCourse[cid].push(l.id);
    }
  });

  const coursesWithStats: CourseProgress[] = coursesData.map(course => {
    const all = lessonsByCourse[course.id] ?? [];
    const comp = all.filter(id => completedIds.has(id));
    return { ...course, progress: { completed: comp.length, total: all.length } };
  });

  return {
    courses: coursesWithStats,
    lessons: lessonsData,
    modules: modulesData,
    userProgress: progressData,
  };
}
