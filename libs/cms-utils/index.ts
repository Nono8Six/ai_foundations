export interface BaseContentItem {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsLesson extends BaseContentItem {
  type: 'lesson';
  duration?: number;
  status?: string;
  completions?: number;
  moduleId?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  hasQuiz?: boolean;
  allowComments?: boolean;
  isPreview?: boolean;
}

export interface CmsModule extends BaseContentItem {
  type: 'module';
  courseId?: string;
  lessons?: CmsLesson[];
  order?: number;
  learningObjectives?: string;
  estimatedDuration?: number;
  isOptional?: boolean;
}

export interface CmsCourse extends BaseContentItem {
  type: 'course';
  price?: number;
  status?: string;
  enrollments?: number;
  thumbnail?: string;
  prerequisites?: string;
  learningObjectives?: string;
  difficulty?: string;
  estimatedDuration?: number;
  tags?: string[];
  rating?: number;
  modules?: CmsModule[];
}

export type CmsContentItem = CmsCourse | CmsModule | CmsLesson;

import type { Database } from '@frontend/types/database.types';

export type CourseWithContent = Database['content']['Tables']['courses']['Row'] & {
  modules: (Database['content']['Tables']['modules']['Row'] & {
    lessons: Database['content']['Tables']['lessons']['Row'][];
  })[];
};

export function courseApiToCmsCourse(course: CourseWithContent): CmsCourse {
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? '',
    createdAt: course.created_at ?? '',
    updatedAt: course.updated_at ?? '',
    type: 'course',
    modules: course.modules?.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description ?? '',
      createdAt: module.created_at ?? '',
      updatedAt: module.updated_at ?? '',
      courseId: module.course_id ?? '',
      type: 'module',
      lessons: module.lessons?.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration_seconds ?? 0,
        createdAt: lesson.created_at ?? '',
        updatedAt: lesson.updated_at ?? '',
        moduleId: lesson.module_id ?? '',
        type: 'lesson',
      })) ?? [],
    })) ?? [],
  };
}

export function courseRowToCmsCourse(
  course: Database['content']['Tables']['courses']['Row']
): CmsCourse {
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? '',
    createdAt: course.created_at ?? '',
    updatedAt: course.updated_at ?? '',
    type: 'course',
    modules: [],
  };
}

