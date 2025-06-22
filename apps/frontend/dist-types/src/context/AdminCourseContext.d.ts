import { type ReactNode } from 'react';
import type { Database } from '../types/database.types';
export interface AdminCourseContextValue {
    createCourse: (course: Database['public']['Tables']['courses']['Insert']) => Promise<Database['public']['Tables']['courses']['Row']>;
    updateCourse: (args: {
        id: string;
        updates: Database['public']['Tables']['courses']['Update'];
    }) => Promise<Database['public']['Tables']['courses']['Row']>;
    deleteCourse: (id: string) => Promise<void>;
    createModule: (module: Database['public']['Tables']['modules']['Insert']) => Promise<Database['public']['Tables']['modules']['Row']>;
    updateModule: (args: {
        id: string;
        updates: Database['public']['Tables']['modules']['Update'];
    }) => Promise<Database['public']['Tables']['modules']['Row']>;
    deleteModule: (id: string) => Promise<void>;
}
export declare const AdminCourseProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAdminCourses: () => AdminCourseContextValue;
