import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const useRecentActivity = (
  userId,
  { limit = 10, order = 'desc', filters = {} } = {}
) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivities = async () => {
      try {
        let query = supabase.from('activity_log').select('*');
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
        setActivities(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, limit, order, filters]);

  return { activities, loading, error };
};

export default useRecentActivity;
