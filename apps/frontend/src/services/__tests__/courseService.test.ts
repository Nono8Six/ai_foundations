import { describe, it, expect, vi, beforeEach } from 'vitest';

const fromMock = vi.fn();

vi.mock('@frontend/lib/supabase', () => ({
  supabase: { from: fromMock }
}));

vi.mock('@frontend/types/course.types', () => ({
  CourseWithProgressSchema: {
    safeParse: (d: unknown) => ({ success: true, data: d }),
    parse: (d: unknown) => d,
  },
  BaseCourseSchema: {
    safeParse: (d: unknown) => ({ success: true, data: d }),
    parse: (d: unknown) => d,
  },
}));

function qb(result: { data: unknown; error: unknown; count?: number | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn((resolve) => Promise.resolve(result).then(resolve)),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('fetchCourses', () => {
  it('builds query with filters', async () => {
    const data = [{ id: '1' }];
    const builder = qb({ data, error: null, count: 1 });
    fromMock.mockReturnValue(builder);
    const { fetchCourses } = await import('../courseService');
    const result = await fetchCourses({
      filters: {
        search: 'react',
        skillLevel: ['easy'],
        category: ['web'],
      },
      sortBy: 'title_asc',
      pagination: { page: 2, pageSize: 5 },
    });

    expect(fromMock).toHaveBeenCalledWith('user_course_progress');
    expect(builder.select).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(builder.ilike).toHaveBeenCalledWith('title', '%react%');
    expect(builder.in).toHaveBeenNthCalledWith(1, 'difficulty', ['easy']);
    expect(builder.in).toHaveBeenNthCalledWith(2, 'category', ['web']);
    expect(builder.order).toHaveBeenCalledWith('title', { ascending: true, nullsFirst: false });
    expect(builder.range).toHaveBeenCalledWith(5, 9);
    expect(result).toEqual({ data, pagination: { page: 2, pageSize: 5, total: 1 } });
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
    const courseBuilder = qb({ data: { id: '1' }, error: null });
    const modulesBuilder = qb({ data: [], error: null });
    fromMock.mockReturnValueOnce(courseBuilder).mockReturnValueOnce(modulesBuilder);
    const { fetchCourseWithContent } = await import('../courseService');
    const result = await fetchCourseWithContent('1');
    expect(fromMock).toHaveBeenNthCalledWith(1, 'user_course_progress');
    expect(courseBuilder.select).toHaveBeenCalledWith('*');
    expect(courseBuilder.eq).toHaveBeenCalledWith('id', '1');
    expect(courseBuilder.single).toHaveBeenCalled();
    expect(fromMock).toHaveBeenNthCalledWith(2, 'modules');
    expect(modulesBuilder.select).toHaveBeenCalled();
    expect(modulesBuilder.eq).toHaveBeenNthCalledWith(1, 'course_id', '1');
    expect(modulesBuilder.eq).toHaveBeenNthCalledWith(2, 'is_published', true);
    expect(modulesBuilder.order).toHaveBeenCalledWith('module_order', { ascending: true });
    expect(result).toEqual({ id: '1', modules: [] });
  });

  it('throws on error', async () => {
    const builder = qb({ data: null, error: new Error('nope') });
    fromMock.mockReturnValueOnce(builder);
    const { fetchCourseWithContent } = await import('../courseService');
    await expect(fetchCourseWithContent('1')).rejects.toThrow('nope');
  });
});
