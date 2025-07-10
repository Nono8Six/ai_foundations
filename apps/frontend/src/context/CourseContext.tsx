// src/context/CourseContext.tsx
import { type ReactNode } from 'react';
import type { QueryObserverResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { createContextStrict } from './createContextStrict';

import { logError } from './ErrorContext.tsx';
import { fetchCourses } from '@frontend/services/courseService';
import type { PaginatedCoursesResult, CourseWithProgress } from '@frontend/types/course.types';
import type { NoInfer } from '@frontend/types/utils';

type CourseData = PaginatedCoursesResult;

export interface CourseContextValue {
  coursesWithProgress: CourseWithProgress[];
  userProgress: unknown[];
  lessons: unknown[];
  modules: unknown[];
  isLoading: boolean;
  refetchCourses: () => Promise<QueryObserverResult<CourseData | null, unknown>>;
}

const [CourseContext, useCourses] = createContextStrict<CourseContextValue>();

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const key: NoInfer<[string, string | undefined]> = ['courses', user?.id];

  const queryResult = useQuery<
    PaginatedCoursesResult,
    Error,
    PaginatedCoursesResult,
    typeof key
  >({
    queryKey: key,
    queryFn: () => fetchCourses(),
    enabled: !!user?.id,
    retry: false,
    onError: (error: Error) =>
      logError(new Error(`[CourseContext] A critical error occurred: ${error.message}`)),
  });

  // Extraction des données avec des valeurs par défaut
  const coursesWithProgress = queryResult.data?.data || [];

  // La valeur du contexte utilise directement les résultats de useQuery
  const value: CourseContextValue = {
    coursesWithProgress,
    userProgress: [],
    lessons: [],
    modules: [],
    isLoading: queryResult.isLoading,
    refetchCourses: queryResult.refetch,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export { useCourses };
