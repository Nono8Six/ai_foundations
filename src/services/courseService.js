import { supabase } from '../lib/supabase';

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