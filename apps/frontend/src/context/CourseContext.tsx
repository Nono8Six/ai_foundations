// src/context/CourseContext.tsx
import { type ReactNode } from 'react';
import type { QueryObserverResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { createContextStrict } from './createContextStrict';

import { logError } from './ErrorContext.tsx';
import {
  fetchCoursesFromSupabase,
  CoursesFromSupabaseSchema,
} from '@frontend/services/courseService';
import type { CoursesFromSupabase } from '@frontend/services/courseService';
import type { NoInfer } from '@frontend/types/utils';

type CourseData = CoursesFromSupabase;

export interface CourseContextValue extends CourseData {
  isLoading: boolean;
  refetchCourses: () => Promise<QueryObserverResult<CourseData | null, unknown>>;
}

const [CourseContext, useCourses] = createContextStrict<CourseContextValue>();

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const key: NoInfer<[string, string | undefined]> = ['courses', user?.id];

  const queryResult = useQuery<CoursesFromSupabase, Error, CoursesFromSupabase, typeof key>({
    queryKey: key,
    queryFn: () =>
      fetchCoursesFromSupabase(user?.id ?? (() => { throw new Error('User ID is undefined'); })()).then(data =>
        CoursesFromSupabaseSchema.parse(data)
      ),
    enabled: !!user?.id,
    onError: (error: Error) =>
      logError(new Error(`[CourseContext] A critical error occurred: ${error.message}`)),
  });

  // Extraction des données avec des valeurs par défaut
  const courses = queryResult.data?.courses || [];
  const lessons = queryResult.data?.lessons || [];
  const modules = queryResult.data?.modules || [];
  const userProgress = queryResult.data?.userProgress || [];

  // La valeur du contexte utilise directement les résultats de useQuery
  const value: CourseContextValue = {
    courses,
    userProgress,
    lessons,
    modules,
    isLoading: queryResult.isLoading,
    refetchCourses: queryResult.refetch,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export { useCourses };
