import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';

const useRecentActivity = (
  userId,
  { limit = 10, order = 'desc', filters = {} } = {}
) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const { data, error } = await safeQuery(() => {
        let query = supabase
          .from('activity_log')
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
