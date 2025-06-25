export interface CourseRow {
  id?: string;
  title: string;
  description: string;
  price?: number;
  thumbnail?: string;
  status?: string;
  prerequisites?: string;
  learningObjectives?: string;
  difficulty?: string;
  estimatedDuration?: number;
  tags?: string[];
  enrollments?: number;
  rating?: number;
}
