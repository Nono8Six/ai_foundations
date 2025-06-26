import { useEffect, useState } from 'react';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { Database } from '@frontend/types/database.types';

type AchievementRow = Database['public']['Tables']['achievements']['Row'];

interface UseAchievementsOptions {
  limit?: number;
  order?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
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

  useEffect(() => {
    if (!userId) return;

    const fetchAchievements = async () => {
      setLoading(true);
      setError(null);

      // On combine les deux logiques : on construit la requête dynamique
      // et on l'exécute à l'intérieur de notre fonction sécurisée.
      const { data, error } = await safeQuery<AchievementRow[]>(() =>
        Object.entries(filters)
          .reduce(
            (q, [column, value]) =>
              q.eq(column as keyof AchievementRow, value as never),
            supabaseClient
              .from('achievements')
              .select('*')
              .eq('user_id', userId)
          )
          .order('created_at', { ascending: order === 'asc' })
          .limit(limit)
      );

      if (error) {
        setError(error);
        setAchievements([]);
      } else {
        setAchievements(data || []);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, [userId, limit, order, JSON.stringify(filters)]); // On utilise JSON.stringify pour que le hook réagisse aux changements dans l'objet filters

  return { achievements, loading, error };
};

export default useAchievements;
