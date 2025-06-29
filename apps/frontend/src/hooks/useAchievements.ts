import { useEffect, useState, useMemo, useCallback } from 'react';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { Database } from '@frontend/types/database.types';

type AchievementRow = Database['public']['Tables']['achievements']['Row'];

interface UseAchievementsOptions {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: Partial<AchievementRow>;
}

interface UseAchievementsResult {
  achievements: AchievementRow[];
  loading: boolean;
  error: PostgrestError | null;
}

const supabaseClient = supabase as SupabaseClient<Database>;

const useAchievements = (
  userId: string | undefined,
  { limit = 10, order = 'desc', filters = {} }: UseAchievementsOptions = {}
): UseAchievementsResult => {
  const [achievements, setAchievements] = useState<AchievementRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  // Memoize the filters to prevent unnecessary effect re-runs
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchAchievements = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build the query
      let query = supabaseClient
        .from('achievements')
        .select('*')
        .eq('user_id', userId);

      // Apply filters if any
      const filterEntries =
        Object.entries(filters) as Array<[
          keyof AchievementRow,
          AchievementRow[keyof AchievementRow]
        ]>;
      query = filterEntries.reduce((q, [column, value]) => q.eq(column, value), query);

      // Apply ordering and limit
      query = query.order('created_at', { ascending: order === 'asc' }).limit(limit);

      // Execute the query using safeQuery
      const { data, error: queryError } = await safeQuery<AchievementRow[]>(async () => {
        const response = await query;
        return {
          data: response.data,
          error: response.error,
        };
      });

      if (queryError) {
        setError(queryError);
        setAchievements([]);
      } else {
        setAchievements(data || []);
      }
    } catch (err) {
      setError(err as PostgrestError);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit, order, filtersString]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { achievements, loading, error };
};

export default useAchievements;
