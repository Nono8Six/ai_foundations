import { type ReactNode } from 'react';
import type { QueryObserverResult } from '@tanstack/react-query';
interface CourseData {
    courses: unknown[];
    lessons: unknown[];
    modules: unknown[];
    userProgress: unknown[];
}
export interface CourseContextValue extends CourseData {
    isLoading: boolean;
    refetchCourses: () => Promise<QueryObserverResult<CourseData | null, unknown>>;
}
export declare const CourseProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useCourses: () => CourseContextValue;
export {};
