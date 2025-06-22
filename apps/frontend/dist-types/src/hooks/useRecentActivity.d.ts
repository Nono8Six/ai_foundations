import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
type ActivityRow = Database['public']['Tables']['activity_log']['Row'];
interface UseRecentActivityOptions {
    limit?: number;
    order?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
}
interface UseRecentActivityResult {
    activities: ActivityRow[];
    loading: boolean;
    error: PostgrestError | null;
}
declare const useRecentActivity: (userId: string | undefined, { limit, order, filters }?: UseRecentActivityOptions) => UseRecentActivityResult;
export default useRecentActivity;
