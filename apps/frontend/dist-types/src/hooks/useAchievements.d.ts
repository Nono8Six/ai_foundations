import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
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
declare const useAchievements: (userId: string | undefined, { limit, order, filters }?: UseAchievementsOptions) => UseAchievementsResult;
export default useAchievements;
