import { PostgrestError } from '@supabase/supabase-js';
export declare function safeQuery<T, E extends Error = PostgrestError>(fn: () => Promise<{
    data: T | null;
    error: E | null;
}>): Promise<{
    data: T | null;
    error: E | null;
}>;
