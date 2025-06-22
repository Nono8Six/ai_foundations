import { useEffect, useState } from 'react';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';
import type { Database } from '../types/database.types';

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
      const { data, error } = await safeQuery<ActivityRow[]>(() => {
        let query = supabaseClient
          .from<'activity_log', ActivityRow>('activity_log')
          .select('*')
          .eq('user_id', userId);

        // Applique les filtres dynamiques
        Object.entries(filters).forEach(([column, value]) => {
          query = query.eq(column as keyof ActivityRow, value as never);
        });

        // Applique l'ordre de tri
        if (order) {
          query = query.order('created_at', { ascending: order === 'asc' });
        }

        // Applique la limite
        if (limit) {
          query = query.limit(limit);
        }

        return query; // La requête est prête à être exécutée par safeQuery
      });

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
