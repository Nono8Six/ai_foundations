import { describe, it, expect, vi } from 'vitest';
import { safeQuery } from '../supabaseClient';
import * as ErrorContext from '../../context/ErrorContext';

describe('safeQuery', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('returns data when query succeeds', async () => {
    vi.spyOn(ErrorContext, 'logError').mockImplementation(() => {});
    const result = await safeQuery(() => Promise.resolve({ data: 'ok', error: null }));
    expect(result).toEqual({ data: 'ok', error: null });
  });

  it('returns error without logging when query returns error', async () => {
    const err = { message: 'fail' };
    const spy = vi.spyOn(ErrorContext, 'logError').mockImplementation(() => {});
    const result = await safeQuery(() => Promise.resolve({ data: null, error: err }));
    expect(spy).not.toHaveBeenCalled();
    expect(result).toEqual({ data: null, error: err });
  });

  it('returns "No data" error when query resolves with null data', async () => {
    vi.spyOn(ErrorContext, 'logError').mockImplementation(() => {});
    const result = await safeQuery(() => Promise.resolve({ data: null, error: null }));
    expect(result.error).toEqual(new Error('No data'));
    expect(result.data).toBeNull();
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
