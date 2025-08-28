import { useQuery } from '@tanstack/react-query';
import { ActivityService, type ActivityEvent, type ActivityFilters } from '@shared/services/activityService';

export interface UseXPActivityOptions {
  filters?: ActivityFilters;
  limit?: number;
  enabled?: boolean;
}

export interface UseXPActivityResult {
  activities: ActivityEvent[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer les activités récentes d'un utilisateur depuis xp_events
 * Remplace useRecentActivity qui utilisait activity_log (inexistante)
 */
export function useXPActivity(
  userId: string | undefined,
  options: UseXPActivityOptions = {}
): UseXPActivityResult {
  const { filters = {}, limit = 5, enabled = true } = options;

  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['xp-activity', userId, filters, limit],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return ActivityService.getRecentActivities(userId, limit);
    },
    enabled: enabled && !!userId,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return { 
    activities, 
    loading: isLoading, 
    error: error as Error | null 
  };
}

export default useXPActivity;