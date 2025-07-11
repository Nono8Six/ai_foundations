import { useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { Database } from '@frontend/types/database.types';

const supabaseClient = supabase as SupabaseClient<Database>;

// Type constraint for tables with user_id and created_at
type TablesWithUserIdAndCreatedAt = keyof {
  [K in keyof Database['public']['Tables'] as 
    'user_id' extends keyof Database['public']['Tables'][K]['Row'] ? 
    'created_at' extends keyof Database['public']['Tables'][K]['Row'] ? K : never : never
  ]: never
};

export interface UseSupabaseListOptions<T> {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: Partial<T>;
}

export interface UseSupabaseListResult<Row, Insert, Update> {
  data: Row[];
  loading: boolean;
  error: PostgrestError | null;
  create: (payload: Insert) => Promise<Row>;
  update: (params: { id: string; updates: Update }) => Promise<Row>;
  remove: (id: string) => Promise<void>;
  refetch: () => Promise<unknown>;
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

  const query = useQuery({
    queryKey,
    enabled: Boolean(userId),
    gcTime: 0,
    queryFn: async (): Promise<Row[]> => {
      if (!userId) return [];
      
      // Build the base query with proper typing
      let query = supabaseClient
        .from(table)
        .select('*')
        .eq('user_id' as any, userId) as any; // Cast 'user_id' to any to bypass strict type checking

      // Apply filters with type safety
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      }

      // Execute the query with proper typing
      const { data, error } = await query
        .order('created_at', { ascending: order === 'asc' })
        .limit(limit);

      if (error) throw error;
      return (data || []) as Row[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [table, userId] });

  const create = useMutation<Row, PostgrestError, Insert>({
    mutationFn: async (payload) => {
      const { data, error } = await safeQuery<Row>(async () => {
        // Cast to unknown first to handle complex type issues
        const response = await (supabaseClient
          .from(table)
          .insert(payload as any)
          .select()
          .single() as unknown as Promise<{ data: Row | null; error: PostgrestError | null }>);
        return { data: response.data, error: response.error };
      });
      if (error) throw error;
      if (!data) throw new Error('No data returned from create operation');
      return data;
    },
    onSuccess: invalidate,
  });

  const update = useMutation<Row, PostgrestError, { id: string; updates: Update }>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await safeQuery<Row>(async () => {
        // Cast to unknown first to handle complex type issues
        const response = await (supabaseClient
          .from(table)
          .update(updates as any)
          .eq('id' as any, id) // Cast 'id' to any to bypass strict type checking
          .select()
          .single() as unknown as Promise<{ data: Row | null; error: PostgrestError | null }>);
        return { data: response.data, error: response.error };
      });
      if (error) throw error;
      if (!data) throw new Error('No data returned from update operation');
      return data;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation<void, PostgrestError, string>({
    mutationFn: async (id) => {
      const { error } = await safeQuery(async () => {
        const { error: deleteError } = await supabaseClient
          .from(table)
          .delete()
          .eq('id' as any, id); // Cast 'id' to any to bypass strict type checking
        return { data: null, error: deleteError };
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Cast error to PostgrestError | null to match the expected type
  const error = query.error as PostgrestError | null;
  
  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error,
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    refetch: query.refetch as () => Promise<unknown>,
  };
}