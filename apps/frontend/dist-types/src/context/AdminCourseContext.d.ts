import { type ReactNode } from 'react';
export interface AdminCourseContextValue {
    createCourse: (course: unknown) => Promise<unknown>;
    updateCourse: (args: {
        id: string;
        updates: unknown;
    }) => Promise<unknown>;
    deleteCourse: (id: string) => Promise<unknown>;
    createModule: (module: unknown) => Promise<unknown>;
    updateModule: (args: {
        id: string;
        updates: unknown;
    }) => Promise<unknown>;
    deleteModule: (id: string) => Promise<unknown>;
}
export declare const AdminCourseProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdminCourses: () => AdminCourseContextValue;
