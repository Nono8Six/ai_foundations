import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@frontend/components/AppIcon';
import { supabase } from '@frontend/lib/supabase';
import { log } from '@libs/logger';

interface CourseData {
  name: string;
  enrollments: number;
  completions: number;
  rating: string | number;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const completionRate =
      data.enrollments > 0 ? Math.round((data.completions / data.enrollments) * 100) : 0;
    return (
      <div className='bg-surface p-3 border border-border rounded-lg shadow-medium'>
        <p className='text-sm font-medium text-text-primary mb-2'>{label}</p>
        <div className='space-y-1'>
          <p className='text-sm text-primary'>
            Inscriptions: {data.enrollments.toLocaleString('fr-FR')}
          </p>
          <p className='text-sm text-accent'>
            Complétions: {data.completions.toLocaleString('fr-FR')}
          </p>
          {data.rating !== 'N/A' && <p className='text-sm text-warning'>Note: {data.rating}/5</p>}
          <p className='text-xs text-text-secondary'>Taux de complétion: {completionRate}%</p>
        </div>
      </div>
    );
  }
  return null;
};

interface PopularCoursesChartProps {}

const PopularCoursesChart: React.FC<PopularCoursesChartProps> = () => {
  const [chartData, setChartData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);

  useEffect(() => {
    const fetchPopularCoursesData = async () => {
      setLoading(true);
      try {
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, modules!inner(id, lessons!inner(id))')
          .eq('is_published', true);

        if (coursesError) {
          log.error('Error fetching courses:', coursesError);
          throw coursesError;
        }

        if (!courses || courses.length === 0) {
          setChartData([]);
          setLoading(false);
          return;
        }

        const { data: userProgress, error: progressError } = await supabase
          .from('user_progress')
          .select('user_id, lesson_id, status');

        if (progressError) {
          log.error('Error fetching user progress:', progressError);
          throw progressError;
        }

        const completedLessonsByUser = new Map(); // Map<userId, Set<lessonId>>
        const startedLessonsByUser = new Map(); // Map<userId, Set<lessonId>>

        userProgress.forEach(progress => {
          if (!startedLessonsByUser.has(progress.user_id)) {
            startedLessonsByUser.set(progress.user_id, new Set());
          }
          startedLessonsByUser.get(progress.user_id).add(progress.lesson_id);

          if (progress.status === 'completed') {
            if (!completedLessonsByUser.has(progress.user_id)) {
              completedLessonsByUser.set(progress.user_id, new Set());
            }
            completedLessonsByUser.get(progress.user_id).add(progress.lesson_id);
          }
        });

        let processedCourses = courses.map(course => {
          const lessonsInCourseSet = new Set();
          course.modules.forEach(module => {
            module.lessons.forEach(lesson => {
              lessonsInCourseSet.add(lesson.id);
            });
          });

          if (lessonsInCourseSet.size === 0) {
            // Skip courses with no lessons
            return {
              name: course.title,
              enrollments: 0,
              completions: 0,
              rating: 'N/A',
            };
          }

          let enrollmentsCount = 0;
          startedLessonsByUser.forEach(startedLessons => {
            for (const lessonId of lessonsInCourseSet) {
              if (startedLessons.has(lessonId)) {
                enrollmentsCount++;
                break;
              }
            }
          });

          let completionsCount = 0;
          completedLessonsByUser.forEach(completedLessons => {
            let allCourseLessonsCompleted = true;
            for (const lessonId of lessonsInCourseSet) {
              if (!completedLessons.has(lessonId)) {
                allCourseLessonsCompleted = false;
                break;
              }
            }
            if (allCourseLessonsCompleted) {
              completionsCount++;
            }
          });

          return {
            name: course.title,
            enrollments: enrollmentsCount,
            completions: completionsCount,
            rating: 'N/A', // Rating not available from current schema
          };
        });

        processedCourses.sort((a, b) => b.enrollments - a.enrollments);
        const topCourses = processedCourses.slice(0, 6);

        setChartData(topCourses);

        // Calculate totals for summary
        const currentTotalEnrollments = topCourses.reduce(
          (acc, course) => acc + course.enrollments,
          0
        );
        const currentTotalCompletions = topCourses.reduce(
          (acc, course) => acc + course.completions,
          0
        );
        setTotalEnrollments(currentTotalEnrollments);
        setTotalCompletions(currentTotalCompletions);
      } catch (error) {
        log.error('Failed to process popular courses data:', error);
        setChartData([]); // Set to empty on error
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCoursesData();
  }, []);

  if (loading) {
    return (
      <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border h-[400px] flex items-center justify-center'>
        <p className='text-text-secondary'>Chargement des données du graphique...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border h-[400px] flex items-center justify-center'>
        <p className='text-text-secondary'>Aucune donnée disponible pour les cours populaires.</p>
      </div>
    );
  }

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Cours populaires</h3>
          <p className='text-sm text-text-secondary'>Inscriptions et taux de completion</p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-primary rounded-full'></div>
            <span className='text-xs text-text-secondary'>Inscriptions</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-accent rounded-full'></div>
            <span className='text-xs text-text-secondary'>Complétions</span>
          </div>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon
              name='MoreVertical'
              size={16}
              aria-label="Plus d'options"
              className='text-text-secondary'
            />
          </button>
        </div>
      </div>

      <div className='h-64'>
        {' '}
        {/* Ensure this height is appropriate */}
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart<CourseData>
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis
              dataKey='name'
              stroke='var(--color-text-secondary)'
              fontSize={11}
              angle={-45}
              textAnchor='end'
              height={80} // Adjusted for angled labels
              interval={0} // Show all labels
            />
            <YAxis
              stroke='var(--color-text-secondary)'
              fontSize={12}
              tickFormatter={value => value.toLocaleString('fr-FR')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey='enrollments'
              fill='var(--color-primary)'
              radius={[2, 2, 0, 0]}
              name='Inscriptions'
            />
            <Bar
              dataKey='completions'
              fill='var(--color-accent)'
              radius={[2, 2, 0, 0]}
              name='Complétions'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4'>
        {' '}
        {/* Changed to 2 cols for smaller screens, 3 for md and up */}
        <div className='text-center p-3 bg-primary-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Total inscriptions</p>
          <p className='text-lg font-semibold text-primary'>
            {totalEnrollments.toLocaleString('fr-FR')}
          </p>
        </div>
        <div className='text-center p-3 bg-accent-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Total complétions</p>
          <p className='text-lg font-semibold text-accent'>
            {totalCompletions.toLocaleString('fr-FR')}
          </p>
        </div>
        {/* Removing average rating as it's not available */}
        <div className='text-center p-3 bg-secondary-50 rounded-lg md:col-span-1 col-span-2'>
          <p className='text-sm text-text-secondary'>Note moyenne</p>
          <p className='text-lg font-semibold text-text-secondary'>N/A</p>
        </div>
      </div>
    </div>
  );
};

export default PopularCoursesChart;
