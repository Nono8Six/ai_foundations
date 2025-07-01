import { useEffect, useState, useMemo, useCallback } from 'react';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { Database } from '@frontend/types/database.types';

type ActivityRow = Database['public']['Tables']['activity_log']['Row'];

interface UseRecentActivityOptions<T extends Partial<ActivityRow> = Partial<ActivityRow>> {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: T;
}

interface UseRecentActivityResult {
  activities: ActivityRow[];
  loading: boolean;
  error: PostgrestError | null;
}

const supabaseClient = supabase as SupabaseClient<Database>;

export function useRecentActivity(
  userId: string | undefined,
  { limit = 10, order = 'desc', filters = {} }: UseRecentActivityOptions = {}
): UseRecentActivityResult {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  // Memoize the filters to prevent unnecessary effect re-runs
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchActivities = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build the query
      let query = supabaseClient
        .from('activity_log')
        .select('*')
        .eq('user_id', userId);

      // Apply filters if any
      const filterEntries =
        Object.entries(filters) as Array<[
          keyof ActivityRow,
          ActivityRow[keyof ActivityRow]
        ]>;
      query = filterEntries.reduce((q, [column, value]) => q.eq(column, value), query);

      // Apply ordering and limit
      query = query.order('created_at', { ascending: order === 'asc' }).limit(limit);

      // Execute the query using safeQuery
      const { data, error: queryError } = await safeQuery<ActivityRow[]>(async () => {
        const response = await query;
        return {
          data: response.data,
          error: response.error,
        };
      });

      if (queryError) {
        setError(queryError);
        setActivities([]);
      } else {
        setActivities(data || []);
      }
    } catch (err) {
      setError(err as PostgrestError);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit, order, filtersString]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error };
}

