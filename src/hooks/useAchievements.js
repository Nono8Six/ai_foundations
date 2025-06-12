import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';

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
      setLoading(true);
      setError(null);

      // On combine les deux logiques : on construit la requête dynamique
      // et on l'exécute à l'intérieur de notre fonction sécurisée.
      const { data, error } = await safeQuery(() => {
        let query = supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId);

        // Applique les filtres dynamiques
        Object.entries(filters).forEach(([column, value]) => {
          query = query.eq(column, value);
        });

        // Applique l'ordre de tri
        if (order) {
          query = query.order('created_at', { ascending: order === 'asc' });
        }

        // Applique la limite
        if (limit) {
          query = query.limit(limit);
        }
        
        return query; // La fonction safeQuery exécutera cette requête
      });

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