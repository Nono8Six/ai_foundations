import { useEffect, useState } from 'react';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { Database } from '@frontend/types/database.types';

type ActivityRow = Database['public']['Tables']['activity_log']['Row'];

interface UseRecentActivityOptions {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

interface UseRecentActivityResult {
  activities: ActivityRow[];
  loading: boolean;
  error: PostgrestError | null;
}

const supabaseClient = supabase as SupabaseClient<Database>;

const useRecentActivity = (
  userId: string | undefined,
  { limit = 10, order = 'desc', filters = {} }: UseRecentActivityOptions = {}
): UseRecentActivityResult => {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      // On combine la requête flexible de la branche 'main'
      // avec la sécurité de 'safeQuery' de la branche 'codex'.
      const { data, error } = await safeQuery<ActivityRow[]>(() =>
        Object.entries(filters)
          .reduce(
            (q, [column, value]) => q.eq(column as keyof ActivityRow, value as never),
            supabaseClient.from('activity_log').select('*').eq('user_id', userId)
          )
          .order('created_at', { ascending: order === 'asc' })
          .limit(limit)
      );

      if (error) {
        setError(error);
        setActivities([]);
      } else {
        setActivities(data || []);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [userId, limit, order, JSON.stringify(filters)]); // On stringify l'objet filters pour une détection de changement fiable

  return { activities, loading, error };
};

export default useRecentActivity;
