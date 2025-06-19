// src/context/CourseContext.jsx
import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { logError } from './ErrorContext';
import { fetchCoursesFromSupabase } from '../services/courseService';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const queryResult = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: () => fetchCoursesFromSupabase(user.id),
    enabled: !!user?.id,
    onError: error =>
      logError(new Error(`[CourseContext] A critical error occurred: ${error.message}`)),
  });

  const courses = queryResult.data?.courses || [];
  const lessons = queryResult.data?.lessons || [];
  const modules = queryResult.data?.modules || [];
  const userProgress = queryResult.data?.userProgress || [];

  const value = {
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
