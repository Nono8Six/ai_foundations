import type { Database } from '../types/database.types';
type CoursesRow = Database['public']['Tables']['courses']['Row'];
type LessonsRow = Database['public']['Tables']['lessons']['Row'];
type ModulesRow = Database['public']['Tables']['modules']['Row'];
type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];
type CourseWithContent = CoursesRow & {
    modules: (ModulesRow & {
        lessons: LessonsRow[];
    })[];
};
type CourseProgress = CoursesRow & {
    progress: {
        completed: number;
        total: number;
    };
};
export interface CoursesFromSupabase {
    courses: CourseProgress[];
    lessons: LessonsRow[];
    modules: ModulesRow[];
    userProgress: UserProgressRow[];
}
export declare function fetchCourses({ search, filters, sortBy, page, pageSize }?: {
    search?: string;
    filters?: {};
    sortBy?: string;
    page?: number;
    pageSize?: number;
}): Promise<{
    data: CoursesRow[];
    count: number;
}>;
export declare function fetchCoursesWithContent(): Promise<CourseWithContent[]>;
export declare function fetchCoursesFromSupabase(userId: string): Promise<CoursesFromSupabase>;
export {};
