import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@frontend/components/AppIcon';
import Image from '@frontend/components/AppImage';
import type { Course } from '@frontend/types/course';

export interface CoursePathwayProps {
  courses: Course[];
}

const CoursePathway: React.FC<CoursePathwayProps> = ({ courses }) => {
  // Group courses by difficulty level for pathway visualization
  const groupedCourses = courses.reduce((acc, course) => {
    const level = course.difficulty || 'Autre';
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(course);
    return acc;
  }, {});

  const difficultyOrder = ['Débutant', 'Intermédiaire', 'Avancé', 'Autre'];
  const orderedGroups = difficultyOrder.filter(level => groupedCourses[level]);

  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'Débutant':
        return 'from-success to-success-600';
      case 'Intermédiaire':
        return 'from-warning to-warning-600';
      case 'Avancé':
        return 'from-error to-error-600';
      default:
        return 'from-secondary to-secondary-600';
    }
  };

  const getProgressColor = (progress?: number): string => {
    if (progress === 100) return 'bg-success';
    if (progress > 0) return 'bg-primary';
    return 'bg-secondary-200';
  };

  return (
    <div className='space-y-12'>
      {orderedGroups.map((difficulty, groupIndex) => (
        <div key={difficulty} className='relative'>
          {/* Difficulty Level Header */}
          <div className='flex items-center mb-8'>
            <div
              className={`w-12 h-12 bg-gradient-to-br ${getDifficultyColor(difficulty)} rounded-full flex items-center justify-center mr-4`}
            >
              <Icon
                aria-hidden='true'
                name={
                  difficulty === 'Débutant'
                    ? 'Play'
                    : difficulty === 'Intermédiaire'
                      ? 'Zap'
                      : 'Crown'
                }
                size={24}
                color='white'
              />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-text-primary'>{difficulty}</h2>
              <p className='text-text-secondary'>
                {groupedCourses[difficulty].length} cours disponible
                {groupedCourses[difficulty].length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Courses in this difficulty level */}
          <div className='relative'>
            {/* Connection Line */}
            {groupIndex < orderedGroups.length - 1 && (
              <div className='absolute left-6 top-full w-0.5 h-12 bg-gradient-to-b from-border to-transparent z-0' />
            )}

            <div className='space-y-6'>
              {groupedCourses[difficulty].map((course, courseIndex) => {
                const progress = course.progress?.percentage ?? 0;
                const isEnrolled = progress > 0;
                return (
                <div key={course.id} className='relative'>
                  {/* Course Connection Line */}
                  {courseIndex < groupedCourses[difficulty].length - 1 && (
                    <div className='absolute left-6 top-full w-0.5 h-6 bg-border z-0' />
                  )}

                  {/* Course Card */}
                  <div className='flex items-start gap-6 bg-surface rounded-xl shadow-subtle hover:shadow-medium transition-all duration-300 p-6 relative z-10'>
                    {/* Course Number/Status */}
                    <div className='flex-shrink-0'>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          progress === 100
                            ? 'bg-success text-white'
                            : isEnrolled
                              ? 'bg-primary text-white'
                              : 'bg-secondary-200 text-text-secondary'
                        }`}
                      >
                        {progress === 100 ? (
                          <Icon aria-hidden='true' name='Check' size={20} />
                        ) : isEnrolled ? (
                          <Icon aria-hidden='true' name='Play' size={20} />
                        ) : (
                          <Icon aria-hidden='true' name='Lock' size={20} />
                        )}
                      </div>
                    </div>

                    {/* Course Image */}
                    <div className='flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden'>
                      <Image
                        src={course.image}
                        alt={course.title}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    {/* Course Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <h3 className='text-lg font-semibold text-text-primary mb-1'>
                            {course.title}
                          </h3>
                          {course.duration && (
                            <div className='flex items-center gap-4 text-sm text-text-secondary'>
                              {course.duration && (
                                <div className='flex items-center gap-1'>
                                  <Icon aria-hidden='true' name='Clock' size={14} />
                                  <span>{course.duration}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Course Badges */}
                        <div className='flex gap-2' />
                      </div>

                      {/* Description */}
                      <p className='text-text-secondary text-sm mb-4 line-clamp-2'>
                        {course.description}
                      </p>

                      {/* Progress Bar (for enrolled courses) */}
                      {isEnrolled && (
                        <div className='mb-4'>
                          <div className='flex items-center justify-between text-sm mb-2'>
                            <span className='text-text-secondary'>Progression</span>
                            <span className='font-medium text-text-primary'>
                              {progress}%
                            </span>
                          </div>
                          <div className='w-full bg-secondary-200 rounded-full h-2'>
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {course.prerequisites?.length > 0 && (
                        <div className='mb-4'>
                          <p className='text-xs text-text-secondary mb-2'>Prérequis:</p>
                          <div className='flex flex-wrap gap-1'>
                            {course.prerequisites.map((prereq, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded'
                              >
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className='flex items-center gap-3'>
                        {isEnrolled ? (
                          <Link
                            to='/lesson-viewer'
                            className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm'
                          >
                            {progress === 100 ? 'Revoir' : 'Continuer'}
                          </Link>
                        ) : (
                          <Link
                            to='/lesson-viewer'
                            className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm'
                          >
                            S&apos;inscrire
                          </Link>
                        )}

                        {course.previewLessons > 0 && (
                          <button className='px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors text-sm'>
                            Aperçu ({course.previewLessons})
                          </button>
                        )}

                        {/* Rating */}
                        {course.average_rating !== undefined && (
                          <div className='flex items-center gap-1 ml-auto'>
                            <Icon
                              aria-hidden='true'
                              name='Star'
                              size={14}
                              className='text-warning fill-current'
                            />
                            <span className='text-sm font-medium text-text-primary'>
                              {course.average_rating.toFixed(1)}
                            </span>
                            <span className='text-sm text-text-secondary'>
                              ({course.enrolled_students || 0})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Pathway Completion Message */}
      {courses.length > 0 && (
        <div className='text-center py-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl'>
          <Icon aria-hidden='true' name='Trophy' size={48} className='mx-auto text-primary mb-4' />
          <h3 className='text-xl font-bold text-text-primary mb-2'>Parcours d&apos;Excellence IA</h3>
          <p className='text-text-secondary max-w-2xl mx-auto'>
            Suivez ce parcours structuré pour maîtriser l&apos;intelligence artificielle de manière
            progressive et efficace. Chaque cours vous prépare au suivant.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursePathway;
