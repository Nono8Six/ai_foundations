export interface LessonRow {
  id?: string;
  title: string;
  content?: string;
  duration?: number;
  videoUrl?: string;
  status?: string;
  order: number;
  hasQuiz?: boolean;
  allowComments?: boolean;
  isPreview?: boolean;
  completions?: number;
}
