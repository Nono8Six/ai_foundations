import type { Database } from '../types/database.types';
type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];
type LessonRow = Database['public']['Tables']['lessons']['Row'];
type CourseRow = Database['public']['Tables']['courses']['Row'];
type ModuleRow = Database['public']['Tables']['modules']['Row'];
interface WeeklyData {
    day: string;
    lessons: number;
    hours: number;
    xp: number;
}
interface MonthlyData {
    month: string;
    lessons: number;
    hours: number;
    xp: number;
}
interface SubjectData {
    name: string;
    value: number;
}
interface ChartData {
    weekly: WeeklyData[];
    monthly: MonthlyData[];
    subject: SubjectData[];
}
declare const useProgressChartData: (userProgress: UserProgressRow[] | undefined, lessons: LessonRow[] | undefined, courses: CourseRow[] | undefined, modules: ModuleRow[] | undefined) => ChartData;
export default useProgressChartData;
