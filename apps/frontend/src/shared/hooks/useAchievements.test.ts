import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest';
import type { PostgrestError } from '@supabase/supabase-js';

import { useAchievements } from './useAchievements';
import { supabase } from '@core/supabase/client';
import type { safeQuery } from '@core/supabase/utils';

vi.mock('@core/supabase/client');
const supabaseFromMock = supabase.from as MockedFunction<typeof supabase.from>;
let safeQueryMock: MockedFunction<typeof safeQuery>;
vi.mock('@core/supabase/utils', () => {
  safeQueryMock = vi.fn(async fn => fn()) as MockedFunction<typeof safeQuery>;
  return { safeQuery: safeQueryMock };
});

let queryClient: QueryClient;

describe('useAchievements', () => {
  beforeEach((): void => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    supabase.from.mockClear();
    safeQueryMock.mockClear();
  });

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('fetches achievements successfully', async (): Promise<void> => {
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
      () => useAchievements('u1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      }
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.error).toBeNull();
  });

  it('handles query error', async (): Promise<void> => {
    const err: PostgrestError = { message: 'fail' } as PostgrestError;

    supabase
      .from('achievements')
      .select('*')
      .eq('user_id', 'u1')
      .order('created_at', { ascending: false })
      .limit(10)
      .mockResolvedValueOnce({ data: null, error: err });

    const { result } = renderHook<undefined, ReturnType<typeof useAchievements>>(
      () => useAchievements('u1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.achievements).toEqual([]);
    expect(result.current.error).toEqual(err);
  });
});
