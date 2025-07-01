import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { PostgrestError } from '@supabase/supabase-js';

import useAchievements from './useAchievements';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase');
let safeQueryMock: ReturnType<typeof vi.fn>;
vi.mock('../utils/supabaseClient', () => {
  safeQueryMock = vi.fn(async fn => fn());
  return { safeQuery: safeQueryMock };
});

describe('useAchievements', () => {
  beforeEach(() => {
    supabase.from.mockClear();
    safeQueryMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches achievements successfully', async () => {
    const mockAchievements = [
      {
        id: 'a1',
        title: 'First',
        description: null,
        icon: null,
        rarity: 'common',
        xp_reward: 10,
        earned: true,
        user_id: 'u1',
        created_at: new Date().toISOString(),
      },
    ];

    supabase
      .from('achievements')
      .select('*')
      .eq('user_id', 'u1')
      .order('created_at', { ascending: false })
      .limit(10)
      .mockResolvedValueOnce({ data: mockAchievements, error: null });

    const { result } = renderHook<undefined, ReturnType<typeof useAchievements>>(
      () => useAchievements('u1')
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.error).toBeNull();
  });

  it('handles query error', async () => {
    const err: PostgrestError = { message: 'fail' } as PostgrestError;

    supabase
      .from('achievements')
      .select('*')
      .eq('user_id', 'u1')
      .order('created_at', { ascending: false })
      .limit(10)
      .mockResolvedValueOnce({ data: null, error: err });

    const { result } = renderHook<undefined, ReturnType<typeof useAchievements>>(
      () => useAchievements('u1')
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.achievements).toEqual([]);
    expect(result.current.error).toEqual(err);
  });
});
