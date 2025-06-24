import { PostgrestError } from '@supabase/supabase-js';
import { logError } from '../context/ErrorContext';

export async function safeQuery<T, E extends Error = PostgrestError>(
  fn: () => PromiseLike<{ data: T | null; error: E | null }>
): Promise<{ data: T | null; error: E | null }> {
  try {
    const { data, error } = await fn();
    if (error) {
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    logError(err);
    return { data: null, error: err as E };
  }
}
