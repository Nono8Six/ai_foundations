// src/hooks/useProgressChartData.ts
import { useState, useEffect, useMemo, useRef } from 'react';
import type { Database } from '@frontend/types/database.types';

type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];
type LessonRow = Database['public']['Tables']['lessons']['Row'];
type CourseRow = Database['public']['Tables']['courses']['Row'];
type ModuleRow = Database['public']['Tables']['modules']['Row'];

interface WeeklyData {
  day: string;
  lessons: number;
  hours: number;
  xp: number;
}

interface MonthlyData {
  month: string;
  lessons: number;
  hours: number;
  xp: number;
}

interface SubjectData {
  name: string;
  value: number;
}

interface ChartData {
  weekly: WeeklyData[];
  monthly: MonthlyData[];
  subject: SubjectData[];
}

interface EnrichedLesson extends LessonRow {
  courseId: string | undefined;
  category: string;
  duration: number;
}

// Temporary fix: Using native Date methods instead of date-fns
// import {
//   format,
//   parseISO,
//   eachDayOfInterval,
//   subDays,
//   eachMonthOfInterval,
//   subMonths,
// } from 'date-fns';

// Helper functions to replace date-fns temporarily
const format = (date: Date, formatStr: string) => {
  if (formatStr === 'EEE') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  if (formatStr === 'MMM yyyy') {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  if (formatStr === 'MMM') {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  if (formatStr === 'yyyy-MM-dd') {
    return date.toISOString().split('T')[0];
  }
  if (formatStr === 'yyyy-MM') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  return date.toLocaleDateString();
};

const parseISO = (dateStr: string) => new Date(dateStr);

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const subMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
};

const eachDayOfInterval = (interval: { start: Date; end: Date }) => {
  const days = [];
  const current = new Date(interval.start);
  while (current <= interval.end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const eachMonthOfInterval = (interval: { start: Date; end: Date }) => {
  const months = [];
  const current = new Date(interval.start);
  while (current <= interval.end) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
};

export function useProgressChartData(
  userProgress: UserProgressRow[] | undefined,
  lessons: LessonRow[] | undefined,
  courses: CourseRow[] | undefined,
  modules: ModuleRow[] | undefined
): ChartData {
  const [chartData, setChartData] = useState<ChartData>({
    weekly: [],
    monthly: [],
    subject: [],
  });

  const hasDataRef = useRef(false);

  const emptyLessonMapRef = useRef<Record<string, EnrichedLesson>>({});

  const enrichedLessons = useMemo(() => {
    if (
      !lessons ||
      lessons.length === 0 ||
      !courses ||
      courses.length === 0 ||
      !modules ||
      modules.length === 0
    ) {
      return emptyLessonMapRef.current;
    }
    const lessonMap: Record<string, EnrichedLesson> = {};
    const moduleCourseMap = modules.reduce<Record<string, string | undefined>>(
      (acc, module) => {
        acc[module.id] = module.course_id ?? undefined;
        return acc;
      },
      {}
    );

    lessons.forEach(lesson => {
      const courseId = moduleCourseMap[lesson.module_id ?? ''];
      const course = courses.find(c => c.id === courseId);
      lessonMap[lesson.id] = {
        ...lesson,
        courseId,
        category: course ? (course.category || 'Unknown') : 'Unknown',
        // Ensure duration is a number, default to 0 if not provided or invalid
        duration: typeof lesson.duration === 'number' ? lesson.duration : 0,
      };
    });
    return lessonMap;
  }, [lessons, courses, modules]);

  useEffect(() => {
    const noData =
      !userProgress ||
      userProgress.length === 0 ||
      Object.keys(enrichedLessons).length === 0;

    if (noData) {
      if (!hasDataRef.current) {
        return;
      }
      hasDataRef.current = false;
      setChartData({ weekly: [], monthly: [], subject: [] });
      return;
    }
    hasDataRef.current = true;

    const completedProgress = userProgress.filter(p => p.status === 'completed' && p.completed_at);

    // --- Weekly Data Aggregation ---
    const today = new Date();
    const last7DaysInterval = { start: subDays(today, 6), end: today };
    const last7DaysArray = eachDayOfInterval(last7DaysInterval);

    const weeklyData = last7DaysArray.map(dayDate => {
      let lessonsCompletedThisDay = 0;
      let hoursSpentThisDay = 0;

      completedProgress.forEach(p => {
        // Check if completed_at is a valid date string before parsing
        if (
          p.completed_at &&
          p.lesson_id &&
          format(parseISO(p.completed_at), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd')
        ) {
          lessonsCompletedThisDay++;
          const lessonDetails = enrichedLessons[p.lesson_id];
          if (lessonDetails && lessonDetails.duration) {
            hoursSpentThisDay += lessonDetails.duration / 60; // Convert minutes to hours
          }
        }
      });
      return {
        day: format(dayDate, 'EEE') || 'Mon', // Mon, Tue, etc.
        lessons: lessonsCompletedThisDay,
        hours: parseFloat(hoursSpentThisDay.toFixed(1)),
        xp: 0, // XP calculation not implemented yet
      };
    });

    // --- Monthly Data Aggregation ---
    const last6MonthsInterval = { start: subMonths(today, 5), end: today };
    const last6MonthsArray = eachMonthOfInterval(last6MonthsInterval);

    const monthlyData = last6MonthsArray.map(monthDate => {
      let lessonsCompletedThisMonth = 0;
      let hoursSpentThisMonth = 0;

      completedProgress.forEach(p => {
        if (
          p.completed_at &&
          p.lesson_id &&
          format(parseISO(p.completed_at), 'yyyy-MM') === format(monthDate, 'yyyy-MM')
        ) {
          lessonsCompletedThisMonth++;
          const lessonDetails = enrichedLessons[p.lesson_id];
          if (lessonDetails && lessonDetails.duration) {
            hoursSpentThisMonth += lessonDetails.duration / 60;
          }
        }
      });
      return {
        month: format(monthDate, 'MMM') || 'Jan', // Jan, Feb, etc.
        lessons: lessonsCompletedThisMonth,
        hours: parseFloat(hoursSpentThisMonth.toFixed(1)),
        xp: 0, // XP calculation not implemented yet
      };
    });

    // --- Subject Data Aggregation ---
    const subjectCounts: Record<string, number> = {};
    completedProgress.forEach(p => {
      if (p.lesson_id) {
        const lessonDetails = enrichedLessons[p.lesson_id];
        if (lessonDetails) {
          const category = lessonDetails.category || 'Unknown';
          subjectCounts[category] = (subjectCounts[category] || 0) + 1;
        }
      }
    });
    const subjectData = Object.entries(subjectCounts).map(([name, value]) => ({
      name,
      value,
    }));

    setChartData({ weekly: weeklyData, monthly: monthlyData, subject: subjectData });
  }, [userProgress, enrichedLessons]);

  return chartData;
}

