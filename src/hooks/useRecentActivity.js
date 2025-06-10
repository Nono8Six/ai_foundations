import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const useRecentActivity = userId => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  return { activities, loading, error };
};

export default useRecentActivity;
