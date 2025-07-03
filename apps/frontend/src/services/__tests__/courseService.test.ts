import { describe, it, expect, vi, beforeEach } from 'vitest';

let fromMock: vi.Mock;

vi.mock('@frontend/lib/supabase', () => {
  fromMock = vi.fn();
  return { supabase: { from: fromMock } };
});

function qb(result: { data: unknown; error: unknown; count?: number | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    then: vi.fn((resolve) => Promise.resolve(result).then(resolve)),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('fetchCourses', () => {
  it('builds query with filters', async () => {
    const data = [{ id: '1', title: 'c', cover_image_url: null, category: null, thumbnail_url: null, progress: { completed: 0, total: 0 } }];
    const builder = qb({ data, error: null, count: 1 });
    fromMock.mockReturnValue(builder);
    const { fetchCourses } = await import('../courseService');
    const result = await fetchCourses({
      search: 'react',
      filters: { skillLevel: ['easy'], category: ['web'], duration: ['short'] },
      sortBy: 'alphabetical',
      page: 2,
      pageSize: 5,
    });

    expect(fromMock).toHaveBeenCalledWith('courses');
    expect(builder.select).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(builder.eq).toHaveBeenCalledWith('is_published', true);
    expect(builder.ilike).toHaveBeenCalledWith('title', '%react%');
    expect(builder.in).toHaveBeenNthCalledWith(1, 'difficulty', ['easy']);
    expect(builder.in).toHaveBeenNthCalledWith(2, 'category', ['web']);
    expect(builder.or).toHaveBeenCalledWith('duration_weeks.lte.3');
    expect(builder.order).toHaveBeenCalledWith('title', { ascending: true });
    expect(builder.range).toHaveBeenCalledWith(5, 9);
    expect(result).toEqual({ data, count: 1 });
  });

  it('throws on query error', async () => {
    const err = new Error('fail');
    const builder = qb({ data: null, error: err, count: null });
    fromMock.mockReturnValue(builder);
    const { fetchCourses } = await import('../courseService');
    await expect(fetchCourses()).rejects.toThrow(err);
  });
});

describe('fetchCoursesWithContent', () => {
  it('returns courses with content', async () => {
    const data = [{ id: '1', modules: [] }];
    const builder = qb({ data, error: null, count: null });
    fromMock.mockReturnValue(builder);
    const { fetchCoursesWithContent } = await import('../courseService');
    const result = await fetchCoursesWithContent();
    expect(fromMock).toHaveBeenCalledWith('courses');
    expect(builder.select).toHaveBeenCalledWith('*, modules(*, lessons(*))');
    expect(builder.order).toHaveBeenCalledWith('created_at');
    expect(result).toEqual(data);
  });

  it('throws on error', async () => {
    const builder = qb({ data: null, error: new Error('nope') });
    fromMock.mockReturnValue(builder);
    const { fetchCoursesWithContent } = await import('../courseService');
    await expect(fetchCoursesWithContent()).rejects.toThrow('nope');
  });
});
