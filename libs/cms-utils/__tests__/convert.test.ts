import { describe, it, expect } from 'vitest';
import { courseApiToCmsCourse } from '../index';

describe('courseApiToCmsCourse', () => {
  it('converts nested API data', () => {
    const apiCourse = {
      id: 'c1',
      title: 'Course',
      description: 'Desc',
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      modules: [
        {
          id: 'm1',
          title: 'Mod',
          description: 'Mod desc',
          created_at: '2023-01-01',
          updated_at: '2023-01-02',
          course_id: 'c1',
          lessons: [
            {
              id: 'l1',
              title: 'Les',
              duration: 10,
              created_at: '2023-01-01',
              updated_at: '2023-01-02',
              module_id: 'm1',
            },
          ],
        },
      ],
    } as any;

    const result = courseApiToCmsCourse(apiCourse);

    expect(result).toEqual({
      id: 'c1',
      title: 'Course',
      description: 'Desc',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
      type: 'course',
      modules: [
        {
          id: 'm1',
          title: 'Mod',
          description: 'Mod desc',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-02',
          courseId: 'c1',
          type: 'module',
          lessons: [
            {
              id: 'l1',
              title: 'Les',
              duration: 10,
              createdAt: '2023-01-01',
              updatedAt: '2023-01-02',
              moduleId: 'm1',
              type: 'lesson',
            },
          ],
        },
      ],
    });
  });
});
