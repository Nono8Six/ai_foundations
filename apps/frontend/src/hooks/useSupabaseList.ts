import { useEffect, useState, useMemo, useCallback } from 'react';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { Database } from '@frontend/types/database.types';

const supabaseClient = supabase as SupabaseClient<Database>;

export interface UseSupabaseListOptions<T> {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: Partial<T>;
}

export interface UseSupabaseListResult<T> {
  data: T[];
  loading: boolean;
  error: PostgrestError | null;
}

export function useSupabaseList<T extends keyof Database['public']['Tables']>(
  table: T,
  userId: string | undefined,
  {
    limit = 10,
    order = 'desc',
    filters = {},
  }: UseSupabaseListOptions<Database['public']['Tables'][T]['Row']> = {}
): UseSupabaseListResult<Database['public']['Tables'][T]['Row']> {
  type Row = Database['public']['Tables'][T]['Row'];
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchList = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabaseClient.from(table).select('*').eq('user_id', userId);

      const filterEntries = Object.entries(filters) as Array<[keyof Row, Row[keyof Row]]>;
      query = filterEntries.reduce((q, [column, value]) => q.eq(column as string, value), query);

      query = query
        .order('created_at', {
          ascending: order === 'asc',
        })
        .limit(limit);

      const { data, error: queryError } = await safeQuery<Row[]>(async () => {
        const response = await query;
        return { data: response.data, error: response.error };
      });

      if (queryError) {
        setError(queryError);
        setData([]);
      } else {
        setData(data || []);
      }
    } catch (err) {
      setError(err as PostgrestError);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, userId, limit, order, filtersString]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error };
}
