import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';

const useRecentActivity = userId => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivities = async () => {
      const { data, error } = await safeQuery(() =>
        supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
      );
      if (error) {
        setError(error);
      } else {
        setActivities(data || []);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [userId]);

  return { activities, loading, error };
};

export default useRecentActivity;
