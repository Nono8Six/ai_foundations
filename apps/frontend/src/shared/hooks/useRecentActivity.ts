import type { PostgrestError } from '@supabase/supabase-js';
import { useSupabaseList, type UseSupabaseListOptions } from './useSupabaseList';
import type { Database } from '@frontend/types/database.types';

type ActivityRow = Database['public']['Tables']['activity_log']['Row'];

export type UseRecentActivityOptions<T extends Partial<ActivityRow> = Partial<ActivityRow>> = UseSupabaseListOptions<T>;

export interface UseRecentActivityResult {
  activities: ActivityRow[];
  loading: boolean;
  error: PostgrestError | null;
}

export function useRecentActivity(
  userId: string | undefined,
  options: UseRecentActivityOptions = {}
): UseRecentActivityResult {
  const { data, loading, error } = useSupabaseList('activity_log', userId, options);
  return { activities: data, loading, error };
}

export default useRecentActivity;
