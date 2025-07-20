import { PostgrestError } from '@supabase/supabase-js';
import { logError } from '@shared/contexts/ErrorContext';
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
    if (data === null) {
      return { data: null, error: new Error('No data') as E };
    }
    return { data, error: null };
  } catch (err) {
    logError(err as AppError);
    const error = typeof err === 'string' ? new Error(err) : err;
    return { data: null, error: error as E };
  }
}
