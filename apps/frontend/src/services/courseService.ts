import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import {
  CourseRowSchema,
  LessonRowSchema,
  ModuleRowSchema,
  UserProgressRowSchema,
  type CourseRow,
  type LessonRow,
  type ModuleRow,
  type UserProgressRow,
} from '@frontend/types/rowSchemas';

const supabaseClient = supabase as SupabaseClient<Database>;

type CourseWithContent = CourseRow & {
  modules: (ModuleRow & { lessons: LessonRow[] })[];
};

type CourseProgress = CourseRow & {
  progress: { completed: number; total: number };
};

export interface CourseFilters {
  skillLevel?: string[];
  duration?: string[];
  category?: string[];
}

export interface CoursesFromSupabase {
  courses: CourseProgress[];
  lessons: LessonRow[];
  modules: ModuleRow[];
  userProgress: UserProgressRow[];
}

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
} = {}): Promise<{ data: CourseRow[]; count: number }> {
  const { skillLevel = [], duration = [], category = [] } = filters;
  let query = supabaseClient
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (skillLevel.length) {
    query = query.in('difficulty', skillLevel);
  }

  if (category.length) {
    query = query.in('category', category);
  }

  if (duration.length) {
    // Example assumes a "duration_weeks" column
    const durations = [];
    if (duration.includes('short')) durations.push('duration_weeks.lte.3');
    if (duration.includes('medium')) durations.push('duration_weeks.gte.4,duration_weeks.lte.6');
    if (duration.includes('long')) durations.push('duration_weeks.gte.7');
    if (durations.length) {
      query = query.or(durations.join(','));
    }
  }

  switch (sortBy) {
    case 'popularity':
      // Sort by creation date (newest first) as a proxy for popularity since enrolled_count doesn't exist
      query = query.order('created_at', { ascending: false });
      break;
    case 'difficulty':
      // Sort by title since difficulty column doesn't exist in the schema
      query = query.order('title', { ascending: true });
      break;
    case 'duration':
      // Sort by title since duration_weeks column doesn't exist in the schema
      query = query.order('title', { ascending: true });
      break;
    case 'alphabetical':
      query = query.order('title', { ascending: true });
      break;
    case 'rating':
      // Sort by creation date since rating column doesn't exist in the schema
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  const coursesData = CourseRowSchema.array().parse(data ?? []);
  return { data: coursesData, count: count || 0 };
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

  if (coursesResult.error) throw coursesResult.error;
  if (lessonsResult.error) throw lessonsResult.error;
  if (modulesResult.error) throw modulesResult.error;
  if (progressResult.error) throw progressResult.error;

  const coursesData = CourseRowSchema.array().parse(coursesResult.data ?? []);
  const lessonsData = LessonRowSchema.array().parse(lessonsResult.data ?? []);
  const modulesData = ModuleRowSchema.array().parse(modulesResult.data ?? []);
  const progressData = UserProgressRowSchema.array().parse(
    progressResult.data ?? []
  );

  const completedLessonIds = new Set(
    progressData.filter(p => p.status === 'completed').map(p => p.lesson_id)
  );

  const moduleCourseMap = modulesData.reduce<Record<string, string | undefined>>(
    (acc, module) => {
      acc[module.id] = module.course_id ?? undefined;
      return acc;
    },
    {}
  );

  const lessonsByCourse = lessonsData.reduce<Record<string, string[]>>( (
    acc, lesson
  ) => {
    const courseId = moduleCourseMap[lesson.module_id ?? ''];
    if (!courseId) {
      return acc;
    }
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(lesson.id);
    return acc;
  }, {} );

  const coursesWithStats: CourseProgress[] = coursesData.map(course => {
    const courseLessonIds = lessonsByCourse[course.id] || [];
    const progress = {
      completed: courseLessonIds.filter(id => completedLessonIds.has(id)).length,
      total: courseLessonIds.length,
    };
    return { ...course, progress };
  });

  return {
    courses: coursesWithStats,
    lessons: lessonsData,
    modules: modulesData,
    userProgress: progressData,
  } as CoursesFromSupabase;
}
