import { logError } from '../context/ErrorContext';

export async function safeQuery(fn) {
  try {
    const { data, error } = await fn();
    if (error) {
      logError(error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    logError(err);
    return { data: null, error: err };
  }
}