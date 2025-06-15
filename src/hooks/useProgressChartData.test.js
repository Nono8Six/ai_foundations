// src/hooks/useProgressChartData.test.js
import { renderHook } from '@testing-library/react-hooks'; // Or @testing-library/react if using a newer setup
import useProgressChartData from './useProgressChartData';
import { subDays, format } from 'date-fns';

// Mock data
const mockLessons = [
  { id: 'l1', module_id: 'm1', estimated_duration: 30 }, // 0.5 hours
  { id: 'l2', module_id: 'm1', estimated_duration: 60 }, // 1 hour
  { id: 'l3', module_id: 'm2', estimated_duration: 45 }, // 0.75 hours
  { id: 'l4', module_id: 'm3', estimated_duration: null }, // No duration
];

const mockCourses = [
  { id: 'c1', category: 'Math' },
  { id: 'c2', category: 'Science' },
  { id: 'c3', category: 'Math' },
];

const mockModules = [
  { id: 'm1', course_id: 'c1' },
  { id: 'm2', course_id: 'c2' },
  { id: 'm3', course_id: 'c3' },
];

describe('useProgressChartData', () => {
  it('should return empty arrays when userProgress is empty', () => {
    const { result } = renderHook(() => useProgressChartData([], mockLessons, mockCourses, mockModules));
    expect(result.current.weekly).toEqual([]);
    expect(result.current.monthly).toEqual([]);
    expect(result.current.subject).toEqual([]);
  });

  it('should return empty arrays when lessons, courses, or modules are empty', () => {
    const mockUserProgress = [{ lesson_id: 'l1', status: 'completed', completed_at: new Date().toISOString() }];
    let { result } = renderHook(() => useProgressChartData(mockUserProgress, [], mockCourses, mockModules));
    expect(result.current.weekly).toEqual([]);

    ({ result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, [], mockModules)));
    expect(result.current.weekly).toEqual([]);

    ({ result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, mockCourses, [])));
    expect(result.current.weekly).toEqual([]);
  });

  it('should process weekly data correctly for lessons completed today and yesterday', () => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const mockUserProgress = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() }, // Math, 0.5h
      { lesson_id: 'l2', status: 'completed', completed_at: yesterday.toISOString() }, // Math, 1h
      { lesson_id: 'l3', status: 'in_progress', completed_at: today.toISOString() }, // Should be ignored
      { lesson_id: 'l1', status: 'completed', completed_at: subDays(today, 7).toISOString() }, // Too old for weekly
    ];

    const { result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, mockCourses, mockModules));

    const todayFormatted = format(today, 'EEE');
    const yesterdayFormatted = format(yesterday, 'EEE');

    const todayData = result.current.weekly.find(d => d.day === todayFormatted);
    const yesterdayData = result.current.weekly.find(d => d.day === yesterdayFormatted);

    expect(result.current.weekly.length).toBe(7); // Should have 7 days
    expect(todayData).toBeDefined();
    expect(todayData.lessons).toBe(1);
    expect(todayData.hours).toBe(0.5);

    expect(yesterdayData).toBeDefined();
    expect(yesterdayData.lessons).toBe(1);
    expect(yesterdayData.hours).toBe(1);
  });

  it('should process monthly data correctly', () => {
    const today = new Date();
    const lastMonth = subDays(today, 35); // Ensure it's in the previous month
    const twoMonthsAgo = subDays(today, 65);

    const mockUserProgress = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() }, // Math, 0.5h, current month
      { lesson_id: 'l2', status: 'completed', completed_at: lastMonth.toISOString() }, // Math, 1h, last month
      { lesson_id: 'l1', status: 'completed', completed_at: lastMonth.toISOString() }, // Math, 0.5h, last month
      { lesson_id: 'l3', status: 'completed', completed_at: twoMonthsAgo.toISOString() }, // Science, 0.75h, two months ago
    ];

    const { result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, mockCourses, mockModules));

    expect(result.current.monthly.length).toBe(6); // Should have 6 months

    const currentMonthFormatted = format(today, 'MMM');
    const lastMonthFormatted = format(lastMonth, 'MMM');
    const twoMonthsAgoFormatted = format(twoMonthsAgo, 'MMM');

    const currentMonthData = result.current.monthly.find(m => m.month === currentMonthFormatted);
    const lastMonthData = result.current.monthly.find(m => m.month === lastMonthFormatted);
    const twoMonthsAgoData = result.current.monthly.find(m => m.month === twoMonthsAgoFormatted);

    expect(currentMonthData).toBeDefined();
    expect(currentMonthData.lessons).toBe(1);
    expect(currentMonthData.hours).toBe(0.5);

    expect(lastMonthData).toBeDefined();
    expect(lastMonthData.lessons).toBe(2);
    expect(lastMonthData.hours).toBe(1.5);

    expect(twoMonthsAgoData).toBeDefined();
    expect(twoMonthsAgoData.lessons).toBe(1);
    expect(twoMonthsAgoData.hours).toBe(0.75);
  });

  it('should aggregate subject data correctly', () => {
    const today = new Date();
    const mockUserProgress = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() }, // m1 -> c1 (Math)
      { lesson_id: 'l2', status: 'completed', completed_at: today.toISOString() }, // m1 -> c1 (Math)
      { lesson_id: 'l3', status: 'completed', completed_at: today.toISOString() }, // m2 -> c2 (Science)
      { lesson_id: 'l4', status: 'completed', completed_at: today.toISOString() }, // m3 -> c3 (Math) - no duration
    ];
    const { result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, mockCourses, mockModules));

    const mathData = result.current.subject.find(s => s.name === 'Math');
    const scienceData = result.current.subject.find(s => s.name === 'Science');

    expect(mathData).toBeDefined();
    expect(mathData.value).toBe(3); // l1, l2, l4

    expect(scienceData).toBeDefined();
    expect(scienceData.value).toBe(1); // l3
  });

  it('should handle lessons with no estimated_duration', () => {
    const today = new Date();
    const mockUserProgress = [
      { lesson_id: 'l4', status: 'completed', completed_at: today.toISOString() }, // m3 -> c3 (Math), estimated_duration is null
    ];
    const { result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, mockCourses, mockModules));

    const todayFormatted = format(today, 'EEE');
    const todayData = result.current.weekly.find(d => d.day === todayFormatted);

    expect(todayData.lessons).toBe(1);
    expect(todayData.hours).toBe(0); // Duration is null, so hours should be 0
  });

  it('should filter out progress items without completed_at', () => {
    const today = new Date();
    const mockUserProgress = [
      { lesson_id: 'l1', status: 'completed', completed_at: today.toISOString() },
      { lesson_id: 'l2', status: 'completed', completed_at: null }, // Should be ignored
    ];
    const { result } = renderHook(() => useProgressChartData(mockUserProgress, mockLessons, mockCourses, mockModules));

    const todayFormatted = format(today, 'EEE');
    const todayData = result.current.weekly.find(d => d.day === todayFormatted);

    expect(todayData.lessons).toBe(1); // Only l1 should be counted
  });

});
