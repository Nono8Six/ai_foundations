import { PostgrestError } from '@supabase/supabase-js';
import { logError } from '@frontend/context/ErrorContext';
import type { AppError } from '@frontend/types/app-error';
import type { Result } from '@libs/supabase-utils/result';

export async function safeQuery<T, E extends Error = PostgrestError>(
  fn: () => PromiseLike<{ data: T | null; error: E | null }>
): Promise<Result<T, E>> {
  try {
    const { data, error } = await fn();
    if (error) {
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    logError(err as AppError);
    const error = typeof err === 'string' ? new Error(err) : err;
    return { data: null, error: error as E };
  }
}
