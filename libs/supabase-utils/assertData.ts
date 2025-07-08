import type { Result } from './result';

export function assertData<T, E extends Error = Error>(result: Result<T, E>): T {
  if ('error' in result && result.error) {
    throw result.error;
  }
  if (result.data === null) {
    throw new Error('No data');
  }
  return result.data;
}
