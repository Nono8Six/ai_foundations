export interface Course {
  id: string | number;
  title: string;
  description: string;
  category?: string;
  image?: string;
  difficulty?: string;
  duration?: string;
  modules?: number;
  xpReward?: number;
  lessons?: number;
  isFree?: boolean;
  isEnrolled?: boolean;
  progress?: number;
  previewLessons?: number;
  rating?: number;
  enrolledStudents?: number;
  prerequisites?: string[];
  tags?: string[];
  instructor?: string;
}
