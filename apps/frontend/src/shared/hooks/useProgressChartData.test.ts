// src/hooks/useProgressChartData.test.ts
import { renderHook } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { useProgressChartData } from './useProgressChartData';
import type { Database } from '@frontend/types/database.types';
import { subDays, format } from 'date-fns';

type LessonRow = Database['content']['Tables']['lessons']['Row'];
type CourseRow = Database['content']['Tables']['courses']['Row'];
type ModuleRow = Database['content']['Tables']['modules']['Row'];
type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];

// Mock data with minimal required fields
const mockLessons: Partial<LessonRow>[] = [
  { id: 'l1', module_id: 'm1', duration: 30 }, // 0.5 hours
  { id: 'l2', module_id: 'm1', duration: 60 }, // 1 hour
  { id: 'l3', module_id: 'm2', duration: 45 }, // 0.75 hours
  { id: 'l4', module_id: 'm3', duration: null }, // No duration
];

const mockCourses: Partial<CourseRow>[] = [
  { id: 'c1', category: 'Math' },
  { id: 'c2', category: 'Science' },
  { id: 'c3', category: 'Math' },
];

const mockModules: Partial<ModuleRow>[] = [
  { id: 'm1', course_id: 'c1' },
  { id: 'm2', course_id: 'c2' },
  { id: 'm3', course_id: 'c3' },
];

describe('useProgressChartData', () => {
  afterEach((): void => {
    vi.clearAllMocks();
  });
  it('should return empty arrays when userProgress is empty', () => {
    const { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() => useProgressChartData([], mockLessons as LessonRow[], mockCourses as CourseRow[], mockModules as ModuleRow[]));
    expect(result.current.weekly).toEqual([]);
    expect(result.current.monthly).toEqual([]);
    expect(result.current.subject).toEqual([]);
  });

  it('should return empty arrays when lessons, courses, or modules are empty', (): void => {
    const mockUserProgress: UserProgressRow[] = [
      { lesson_id: 'l1', status: 'completed', completed_at: new Date().toISOString() },
    ];
    let { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() => useProgressChartData(mockUserProgress, [], mockCourses as CourseRow[], mockModules as ModuleRow[]));
    expect(result.current.weekly).toEqual([]);

    ({
      result,
    } = renderHook<undefined, ReturnType<typeof useProgressChartData>>(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], [], mockModules as ModuleRow[])
    ));
    expect(result.current.weekly).toEqual([]);

    ({
      result,
    } = renderHook<undefined, ReturnType<typeof useProgressChartData>>(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], mockCourses as CourseRow[], [])
    ));
    expect(result.current.weekly).toEqual([]);
  });

  it('should process weekly data correctly for lessons completed today and yesterday', (): void => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const mockUserProgress: UserProgressRow[] = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() }, // Math, 0.5h
      { lesson_id: 'l2', status: 'completed', completed_at: yesterday.toISOString() }, // Math, 1h
      { lesson_id: 'l3', status: 'in_progress', completed_at: today.toISOString() }, // Should be ignored
      { lesson_id: 'l1', status: 'completed', completed_at: subDays(today, 7).toISOString() }, // Too old for weekly
    ];

    const { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], mockCourses as CourseRow[], mockModules as ModuleRow[])
    );

    const todayFormatted = today.toLocaleDateString('en-US', { weekday: 'short' });
    const yesterdayFormatted = yesterday.toLocaleDateString('en-US', { weekday: 'short' });

    const todayData = result.current.weekly.find(d => d.day === todayFormatted);
    const yesterdayData = result.current.weekly.find(d => d.day === yesterdayFormatted);

    expect(result.current.weekly.length).toBe(7); // Should have 7 days
    expect(todayData).toBeDefined();
    expect(todayData?.lessons).toBe(1);
    expect(todayData?.hours).toBe(0.5);

    expect(yesterdayData).toBeDefined();
    expect(yesterdayData?.lessons).toBe(1);
    expect(yesterdayData?.hours).toBe(1);
  });

  it('should process monthly data correctly', (): void => {
    const today = new Date();
    const lastMonth = subDays(today, 35); // Ensure it's in the previous month
    const twoMonthsAgo = subDays(today, 65);

    const mockUserProgress: UserProgressRow[] = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() }, // Math, 0.5h, current month
      { lesson_id: 'l2', status: 'completed', completed_at: lastMonth.toISOString() }, // Math, 1h, last month
      { lesson_id: 'l1', status: 'completed', completed_at: lastMonth.toISOString() }, // Math, 0.5h, last month
      { lesson_id: 'l3', status: 'completed', completed_at: twoMonthsAgo.toISOString() }, // Science, 0.75h, two months ago
    ];

    const { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], mockCourses as CourseRow[], mockModules as ModuleRow[])
    );

    expect(result.current.monthly.length).toBe(6); // Should have 6 months

    // Use the same format as hook: short month names
    const currentMonthFormatted = today.toLocaleDateString('en-US', { month: 'short' });
    const lastMonthFormatted = lastMonth.toLocaleDateString('en-US', { month: 'short' });
    const twoMonthsAgoFormatted = twoMonthsAgo.toLocaleDateString('en-US', { month: 'short' });

    const currentMonthData = result.current.monthly.find(m => m.month === currentMonthFormatted);
    const lastMonthData = result.current.monthly.find(m => m.month === lastMonthFormatted);
    const twoMonthsAgoData = result.current.monthly.find(m => m.month === twoMonthsAgoFormatted);

    expect(currentMonthData).toBeDefined();
    expect(currentMonthData?.lessons).toBe(1);
    expect(currentMonthData?.hours).toBe(0.5);

    expect(lastMonthData).toBeDefined();
    expect(lastMonthData?.lessons).toBe(2);
    expect(lastMonthData?.hours).toBe(1.5);

    expect(twoMonthsAgoData).toBeDefined();
    expect(twoMonthsAgoData?.lessons).toBe(1);
    expect(twoMonthsAgoData?.hours).toBe(0.75);
  });

  it('should aggregate subject data correctly', (): void => {
    const today = new Date();
    const mockUserProgress: UserProgressRow[] = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() }, // m1 -> c1 (Math)
      { lesson_id: 'l2', status: 'completed', completed_at: today.toISOString() }, // m1 -> c1 (Math)
      { lesson_id: 'l3', status: 'completed', completed_at: today.toISOString() }, // m2 -> c2 (Science)
      { lesson_id: 'l4', status: 'completed', completed_at: today.toISOString() }, // m3 -> c3 (Math) - no duration
    ];
    const { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], mockCourses as CourseRow[], mockModules as ModuleRow[])
    );

    const mathData = result.current.subject.find(s => s.name === 'Math');
    const scienceData = result.current.subject.find(s => s.name === 'Science');

    expect(mathData).toBeDefined();
    expect(mathData.value).toBe(3); // l1, l2, l4

    expect(scienceData).toBeDefined();
    expect(scienceData.value).toBe(1); // l3
  });

  it('should handle lessons with no duration', (): void => {
    const today = new Date();
    const mockUserProgress: UserProgressRow[] = [
      { lesson_id: 'l4', status: 'completed', completed_at: today.toISOString() }, // m3 -> c3 (Math), duration is null
    ];
    const { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], mockCourses as CourseRow[], mockModules as ModuleRow[])
    );

    const todayFormatted = today.toLocaleDateString('en-US', { weekday: 'short' });
    const todayData = result.current.weekly.find(d => d.day === todayFormatted);

    expect(todayData?.lessons).toBe(1);
    expect(todayData?.hours).toBe(0); // Duration is null, so hours should be 0
  });

  it('should filter out progress items without completed_at', (): void => {
    const today = new Date();
    const mockUserProgress: UserProgressRow[] = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() },
      { lesson_id: 'l2', status: 'completed', completed_at: null }, // Should be ignored
    ];
    const { result } = renderHook<
      undefined,
      ReturnType<typeof useProgressChartData>
    >(() =>
      useProgressChartData(mockUserProgress, mockLessons as LessonRow[], mockCourses as CourseRow[], mockModules as ModuleRow[])
    );

    const todayFormatted = today.toLocaleDateString('en-US', { weekday: 'short' });
    const todayData = result.current.weekly.find(d => d.day === todayFormatted);

    expect(todayData?.lessons).toBe(1); // Only l1 should be counted
  });
});
