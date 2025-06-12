import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock AuthContext to always return a user
vi.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

const coursesData = [
  {
    id: 'c1',
    title: 'Course 1',
    cover_image_url: '',
    instructor: '',
    category: '',
    thumbnail_url: '',
  },
  {
    id: 'c2',
    title: 'Course 2',
    cover_image_url: '',
    instructor: '',
    category: '',
    thumbnail_url: '',
  },
];
const lessonsData = [
  { id: 'l1', module_id: 1, is_published: true },
  { id: 'l2', module_id: 2, is_published: true },
  { id: 'l3', module_id: 3, is_published: true },
];
const modulesData = [
  { id: 1, course_id: 'c1' },
  { id: 2, course_id: 'c1' },
  { id: 3, course_id: 'c2' },
];
const progressData = [{ lesson_id: 'l1', status: 'completed' }];

const dataMap = {
  courses: coursesData,
  lessons: lessonsData,
  modules: modulesData,
  user_progress: progressData,
};

vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: table => ({
        select: () => {
          const baseResult = { data: dataMap[table], error: null };
          const promise = Promise.resolve(baseResult);
          return Object.assign(promise, {
            eq: async () => baseResult,
          });
        },
      }),
    },
  };
});

import { CourseProvider, useCourses } from '../CourseContext.jsx';

const Consumer = () => {
  const { coursesWithProgress, loading } = useCourses();
  return (
    <div>
      {loading && <span data-testid='loading'>loading</span>}
      <pre data-testid='courses'>{JSON.stringify(coursesWithProgress)}</pre>
    </div>
  );
};

describe('fetchAllData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates progress per course using modules', async () => {
    render(
      <CourseProvider>
        <Consumer />
      </CourseProvider>
    );

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

    const courses = JSON.parse(screen.getByTestId('courses').textContent);
    const c1 = courses.find(c => c.id === 'c1');
    const c2 = courses.find(c => c.id === 'c2');

    expect(c1.progress).toEqual({ completed: 1, total: 2 });
    expect(c2.progress).toEqual({ completed: 0, total: 1 });
  });
});
