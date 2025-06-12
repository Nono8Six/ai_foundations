import { describe, it, expect, vi } from 'vitest';
import { safeQuery } from '../supabaseClient';
import * as ErrorContext from '../../context/ErrorContext';

describe('safeQuery', () => {
  it('returns data when query succeeds', async () => {
    vi.spyOn(ErrorContext, 'logError').mockImplementation(() => {});
    const result = await safeQuery(() => Promise.resolve({ data: 'ok', error: null }));
    expect(result).toEqual({ data: 'ok', error: null });
  });

  it('logs and returns error when query returns error', async () => {
    const err = { message: 'fail' };
    const spy = vi.spyOn(ErrorContext, 'logError').mockImplementation(() => {});
    const result = await safeQuery(() => Promise.resolve({ data: null, error: err }));
    expect(spy).toHaveBeenCalledWith(err);
    expect(result).toEqual({ data: null, error: err });
  });

  it('catches thrown errors and logs them', async () => {
    const err = new Error('boom');
    const spy = vi.spyOn(ErrorContext, 'logError').mockImplementation(() => {});
    const result = await safeQuery(() => {
      throw err;
    });
    expect(spy).toHaveBeenCalledWith(err);
    expect(result).toEqual({ data: null, error: err });
  });
});
