import { type ReactNode } from 'react';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { CoursesFromSupabase } from '../services/courseService';
type CourseData = CoursesFromSupabase;
export interface CourseContextValue extends CourseData {
    isLoading: boolean;
    refetchCourses: () => Promise<QueryObserverResult<CourseData | null, unknown>>;
}
export declare const CourseProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useCourses: () => CourseContextValue;
export {};
