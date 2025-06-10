import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const useAchievements = userId => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAchievements(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userId]);

  return { achievements, loading, error };
};

export default useAchievements;
