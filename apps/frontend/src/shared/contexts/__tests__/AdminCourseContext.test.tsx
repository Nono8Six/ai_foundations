import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let fromMock: vi.Mock;
vi.mock('@core/supabase/client', () => {
  fromMock = vi.fn(table => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: { id: 'new', table }, error: null })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'upd', table }, error: null })),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
  }));
  return { supabase: { from: fromMock } };
});

let safeQueryMock: vi.Mock;
vi.mock('@core/supabase/utils', () => {
  safeQueryMock = vi.fn(async fn => fn());
  return { safeQuery: safeQueryMock };
});

vi.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

import { AdminCourseProvider, useAdminCourses } from '../AdminCourseContext';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    <AdminCourseProvider>{children}</AdminCourseProvider>
  </QueryClientProvider>
);

describe('AdminCourseContext', () => {
  beforeEach(() => {
    fromMock.mockClear();
    safeQueryMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates, updates and deletes courses', async () => {
    const { result } = renderHook<
      undefined,
      ReturnType<typeof useAdminCourses>
    >(() => useAdminCourses(), { wrapper });

    await act(async () => {
      const newCourse = await result.current.createCourse({ title: 'c' });
      expect(newCourse).toEqual({ id: 'new', table: 'courses' });

      const updated = await result.current.updateCourse('1', { title: 'u' });
      expect(updated).toEqual({ id: 'upd', table: 'courses' });

      await result.current.deleteCourse('1');
    });

    expect(fromMock).toHaveBeenCalledWith('courses');
  });

  it('creates, updates and deletes modules', async () => {
    const { result } = renderHook<
      undefined,
      ReturnType<typeof useAdminCourses>
    >(() => useAdminCourses(), { wrapper });

    await act(async () => {
      const newModule = await result.current.createModule({ title: 'm' });
      expect(newModule).toEqual({ id: 'new', table: 'modules' });

      const updated = await result.current.updateModule('1', { title: 'u' });
      expect(updated).toEqual({ id: 'upd', table: 'modules' });

      await result.current.deleteModule('1');
    });

    expect(fromMock).toHaveBeenCalledWith('modules');
  });
});
