import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';

export async function fetchCourses({ search = '', filters = {}, sortBy = 'popularity', page = 1, pageSize = 12 } = {}) {
  let query = supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (filters.skillLevel && filters.skillLevel.length) {
    query = query.in('difficulty', filters.skillLevel);
  }

  if (filters.category && filters.category.length) {
    query = query.in('category', filters.category);
  }

  if (filters.duration && filters.duration.length) {
    // Example assumes a "duration_weeks" column
    const durations = [];
    if (filters.duration.includes('short')) durations.push('duration_weeks.lte.3');
    if (filters.duration.includes('medium')) durations.push('duration_weeks.gte.4,duration_weeks.lte.6');
    if (filters.duration.includes('long')) durations.push('duration_weeks.gte.7');
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
  return { data: data || [], count: count || 0 };
}

export async function fetchCoursesWithContent() {
  const { data, error } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function fetchCoursesFromSupabase(userId) {
  const [coursesResult, lessonsResult, modulesResult, progressResult] =
    await Promise.all([
      safeQuery(() =>
        supabase
          .from('courses')
          .select('id, title, cover_image_url, category, thumbnail_url')
          .eq('is_published', true)
      ),
      safeQuery(() =>
        supabase
          .from('lessons')
          .select('id, module_id, is_published, duration')
          .eq('is_published', true)
      ),
      safeQuery(() => supabase.from('modules').select('id, course_id')),
      safeQuery(() =>
        supabase
          .from('user_progress')
          .select('lesson_id, status, completed_at')
          .eq('user_id', userId)
      ),
    ]);

  if (coursesResult.error) throw coursesResult.error;
  if (lessonsResult.error) throw lessonsResult.error;
  if (modulesResult.error) throw modulesResult.error;
  if (progressResult.error) throw progressResult.error;

  const coursesData = coursesResult.data || [];
  const lessonsData = lessonsResult.data || [];
  const modulesData = modulesResult.data || [];
  const progressData = progressResult.data || [];

  const completedLessonIds = new Set(
    progressData.filter(p => p.status === 'completed').map(p => p.lesson_id)
  );

  const moduleCourseMap = modulesData.reduce((acc, module) => {
    acc[module.id] = module.course_id;
    return acc;
  }, {});

  const lessonsByCourse = lessonsData.reduce((acc, lesson) => {
    const courseId = moduleCourseMap[lesson.module_id];
    if (!courseId) {
      return acc;
    }
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(lesson.id);
    return acc;
  }, {});

  const coursesWithStats = coursesData.map(course => {
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
  };
}
