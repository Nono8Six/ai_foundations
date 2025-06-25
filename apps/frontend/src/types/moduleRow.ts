import type { LessonRow } from './lessonRow';

export interface ModuleRow {
  id?: string;
  title: string;
  description: string;
  order: number;
  learningObjectives?: string;
  estimatedDuration?: number;
  isOptional?: boolean;
  lessons?: LessonRow[];
}
