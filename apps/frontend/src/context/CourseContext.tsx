// src/context/CourseContext.tsx
import React, { createContext, useContext, type ReactNode } from 'react';
import type { QueryObserverResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';

import { logError } from './ErrorContext.tsx';
import { fetchCoursesFromSupabase } from '../services/courseService';
import type { CoursesFromSupabase } from '../services/courseService';


type CourseData = CoursesFromSupabase;

export interface CourseContextValue extends CourseData {
  isLoading: boolean;
  refetchCourses: () => Promise<QueryObserverResult<CourseData | null, unknown>>;
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const queryResult = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve(null); // Ne rien faire si l'utilisateur n'est pas connecté
      return fetchCoursesFromSupabase(user.id);
    },
    enabled: !!user?.id, // La requête ne s'exécute que si user.id existe
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

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
