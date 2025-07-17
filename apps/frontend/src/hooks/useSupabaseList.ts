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

// Modern TypeScript 5.8+ utility types for database operations

// Type-safe Supabase Insert/Update types with exactOptionalPropertyTypes
type SafeSupabaseInsert<T> = {
  [K in keyof T]?: T[K] | undefined;
};

type SafeSupabaseUpdate<T> = {
  [K in keyof T]?: T[K] | undefined;
};
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
    gcTime: 5 * 60 * 1000, // 5 minutes cache time for better performance
    queryFn: async () => {
      let q = supabaseClient.from(table).select('*');

      // Type-safe filter by user_id using string literal
      if (userId) {
        q = q.eq('user_id' as never, userId);
      }

      for (const [column, value] of Object.entries(filters)) {
        if (value !== undefined) {
          q = q.eq(column as string, value);
        }
      }

      q = q.order('created_at', { ascending: order === 'asc' });
      q = q.limit(limit);

      const { data, error } = await safeQuery<Row[]>(async () => {
        const resp = await q;
        // Type assertion is safe here as we're selecting from the correct table
        return { data: resp.data as Row[] | null, error: resp.error };
      });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [table, userId] });

  const create = useMutation<Row, PostgrestError, Insert>({
    mutationFn: async (payload: Insert) => {
      // Type-safe insertion with exactOptionalPropertyTypes compatibility
      const safePayload = payload as SafeSupabaseInsert<Row>;
      
      const result = await safeQuery<Row>(async () => {
        const resp = await supabaseClient.from(table).insert(safePayload as never).select().single();
        // Type assertion is safe here as insert returns the same type
        return { data: resp.data as Row | null, error: resp.error };
      });
      return assertData<Row>(result);
    },
    onSuccess: invalidate,
  });

  const update = useMutation<Row, PostgrestError, { id: string; updates: Update }>({
    mutationFn: async ({ id, updates }) => {
      // Type-safe update with exactOptionalPropertyTypes compatibility
      const safeUpdates = updates as SafeSupabaseUpdate<Row>;
      
      const result = await safeQuery<Row>(async () => {
        // Type-safe update using proper key constraints
        const resp = await supabaseClient.from(table).update(safeUpdates as never).eq('id' as never, id).select().single();
        // Type assertion is safe here as update returns the same type
        return { data: resp.data as Row | null, error: resp.error };
      });
      return assertData<Row>(result);
    },
    onSuccess: invalidate,
  });

  const remove = useMutation<void, PostgrestError, string>({
    mutationFn: async (id: string) => {
      const { error } = await safeQuery(async () => {
        // Type-safe delete using proper key constraints
        const resp = await supabaseClient.from(table).delete().eq('id' as never, id);
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