import type { PostgrestError } from '@supabase/supabase-js';
import { useSupabaseList, type UseSupabaseListOptions } from './useSupabaseList';
import type { Tables } from '@frontend/types/database.types';

type AchievementRow = Tables<'achievements'>;

export type UseAchievementsOptions<
  T extends Partial<AchievementRow> = Partial<AchievementRow>,
> = UseSupabaseListOptions<T>;

export interface UseAchievementsResult {
  achievements: AchievementRow[];
  loading: boolean;
  error: PostgrestError | null;
}

export function useAchievements(
  userId: string | undefined,
  options: UseAchievementsOptions = {}
): UseAchievementsResult {
  const { data, loading, error } = useSupabaseList(
    'achievements',
    userId,
    options
  );

  return { achievements: data, loading, error };
}

export default useAchievements;
