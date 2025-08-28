// src/context/CourseContext.tsx
import React, { type ReactNode } from 'react';
import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useAuth } from '@features/auth/contexts/AuthContext';
import { createContextStrict } from "@shared/contexts/createContextStrict";

import { logError } from '@shared/contexts/ErrorContext';
import { fetchCourses } from '@shared/services/courseService';
import type { PaginatedCoursesResult, CourseWithProgress } from '@frontend/types/course.types';
import type { NoInfer } from '@frontend/types/utils';
import type { Database } from '@frontend/types/database.types';

type CourseData = PaginatedCoursesResult;

export interface CourseContextValue {
  coursesWithProgress: CourseWithProgress[];
  userProgress: Database['public']['Tables']['user_progress']['Row'][];
  lessons: Database['content']['Tables']['lessons']['Row'][];
  modules: Database['content']['Tables']['modules']['Row'][];
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
    enabled: true, // Les cours publiés sont accessibles à tous
    retry: false,
  });

  // Handle errors in TanStack Query v5 style
  React.useEffect(() => {
    if (queryResult.error) {
      logError(new Error(`[CourseContext] A critical error occurred: ${queryResult.error.message}`));
    }
  }, [queryResult.error]);

  // Extraction des données avec des valeurs par défaut
  const coursesWithProgress = queryResult.data?.data || [];

  const defaultUserProgress = React.useMemo<
    Database['public']['Tables']['user_progress']['Row'][]
  >(() => [], []);

  const defaultLessons = React.useMemo<
    Database['content']['Tables']['lessons']['Row'][]
  >(() => [], []);

  const defaultModules = React.useMemo<
    Database['content']['Tables']['modules']['Row'][]
  >(() => [], []);

  // La valeur du contexte utilise directement les résultats de useQuery
  const value: CourseContextValue = {
    coursesWithProgress,
    userProgress: defaultUserProgress,
    lessons: defaultLessons,
    modules: defaultModules,
    isLoading: queryResult.isLoading,
    refetchCourses: queryResult.refetch,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export { useCourses };
