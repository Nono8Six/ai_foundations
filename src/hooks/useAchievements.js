import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';

const useAchievements = userId => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAchievements = async () => {
      const { data, error } = await safeQuery(() =>
        supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      );
      if (error) {
        setError(error);
      } else {
        setAchievements(data || []);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, [userId]);

  return { achievements, loading, error };
};

export default useAchievements;
