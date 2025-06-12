import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const useAchievements = (
  userId,
  { limit = 10, order = 'desc', filters = {} } = {}
) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAchievements = async () => {
      try {
        let query = supabase.from('achievements').select('*');
        query = query.eq('user_id', userId);
        Object.entries(filters).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
        if (order) {
          query = query.order('created_at', { ascending: order === 'asc' });
        }
        if (limit) {
          query = query.limit(limit);
        }
        const { data, error } = await query;

        if (error) throw error;
        setAchievements(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userId, limit, order, filters]);

  return { achievements, loading, error };
};

export default useAchievements;
