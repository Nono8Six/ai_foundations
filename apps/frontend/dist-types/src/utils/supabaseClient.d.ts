import { PostgrestError } from '@supabase/supabase-js';
export declare function safeQuery<T>(fn: () => Promise<{
    data: T | null;
    error: PostgrestError | null;
}>): Promise<{
    data: T | null;
    error: PostgrestError | null;
}>;
