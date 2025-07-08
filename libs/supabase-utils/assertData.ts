export interface SupabaseResult<T, E extends Error = Error> {
  data: T | null;
  error: E | null;
}

export function assertData<T, E extends Error = Error>(
  result: SupabaseResult<T, E>
): T {
  const { data, error } = result;
  if (error || data === null) {
    throw error ?? new Error('No data');
  }
  return data;
}
