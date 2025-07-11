import { useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import { assertData } from '@libs/supabase-utils/assertData';
import type { Database } from '@frontend/types/database.types';

const supabaseClient = supabase as SupabaseClient<Database>;

// Contrainte T
type TablesWithUserIdAndCreatedAt = {
  [K in keyof Database['public']['Tables']]: 
    'user_id' extends keyof Database['public']['Tables'][K]['Row'] 
    ? 'created_at' extends keyof Database['public']['Tables'][K]['Row'] 
      ? K 
      : never 
    : never
}[keyof Database['public']['Tables']];

export interface UseSupabaseListOptions<T> {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: Partial<T>;
}

export interface UseSupabaseListResult<T, I, U> {
  data: T[];
  loading: boolean;
  error: PostgrestError | null;
  create: (payload: I) => Promise<T>;
  update: (args: { id: string; updates: U }) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function useSupabaseList<const T extends TablesWithUserIdAndCreatedAt>(
  table: T,
  userId: string | undefined,
  {
    limit = 10,
    order = 'desc',
    filters = {},
  }: UseSupabaseListOptions<Database['public']['Tables'][T]['Row']> = {}
): UseSupabaseListResult<
  Database['public']['Tables'][T]['Row'],
  Database['public']['Tables'][T]['Insert'],
  Database['public']['Tables'][T]['Update']
> {
  type Row = Database['public']['Tables'][T]['Row'];
  type Insert = Database['public']['Tables'][T]['Insert'];
  type Update = Database['public']['Tables'][T]['Update'];

  const queryClient = useQueryClient();

  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);
  const queryKey = useMemo(
    () => [table, userId, { limit, order, filters: filtersString }],
    [table, userId, limit, order, filtersString]
  );

  const query: UseQueryResult<Row[], PostgrestError> = useQuery({
    queryKey,
    enabled: Boolean(userId),
    gcTime: 0,
    queryFn: async () => {
      let q = supabaseClient.from(table).select('*');

      // @ts-ignore - TS union limitation; 'user_id' guaranteed by constraint
      q = q.eq('user_id', userId!);

      for (const [column, value] of Object.entries(filters)) {
        if (value !== undefined) {
          q = q.eq(column, value as any);
        }
      }

      q = q.order('created_at', { ascending: order === 'asc' });
      q = q.limit(limit);

      const { data, error } = await safeQuery<Row[]>(async () => {
        const resp = await q;
        // @ts-ignore - TS union expansion; data matches Row[] runtime
        return { data: resp.data as Row[], error: resp.error };
      });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [table, userId] });

  const create = useMutation<Row, PostgrestError, Insert>({
    mutationFn: async (payload: Insert) => {
      const result = await safeQuery<Row>(async () => {
        const resp = await supabaseClient.from(table).insert(payload as any).select().single();
        // @ts-ignore - TS union expansion; data matches Row runtime
        return { data: resp.data as Row, error: resp.error };
      });
      return assertData<Row>(result);
    },
    onSuccess: invalidate,
  });

  const update = useMutation<Row, PostgrestError, { id: string; updates: Update }>({
    mutationFn: async ({ id, updates }) => {
      const result = await safeQuery<Row>(async () => {
        // @ts-ignore - TS union limitation; 'id' guaranteed by schema
        const resp = await supabaseClient.from(table).update(updates as any).eq('id', id).select().single();
        // @ts-ignore - TS union expansion; data matches Row runtime
        return { data: resp.data as Row, error: resp.error };
      });
      return assertData<Row>(result);
    },
    onSuccess: invalidate,
  });

  const remove = useMutation<void, PostgrestError, string>({
    mutationFn: async (id: string) => {
      const { error } = await safeQuery(async () => {
        // @ts-ignore - TS union limitation; 'id' guaranteed by schema
        const resp = await supabaseClient.from(table).delete().eq('id', id);
        return { data: null, error: resp.error };
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error ?? null,
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
  };
}