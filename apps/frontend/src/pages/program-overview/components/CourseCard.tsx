import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@frontend/components/AppIcon';
import Image from '@frontend/components/AppImage';
import type { CourseWithProgress } from '@frontend/types/course.types';

export interface CourseCardProps {
  course: CourseWithProgress;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getDifficultyColor = (difficulty: string): string => {
    const level = difficulty.toLowerCase();
    if (level.includes('débutant') || level.includes('beginner')) {
      return 'bg-success-100 text-success-700';
    } else if (level.includes('intermédiaire') || level.includes('intermediate')) {
      return 'bg-warning-100 text-warning-700';
    } else if (level.includes('avancé') || level.includes('advanced')) {
      return 'bg-error-100 text-error-700';
    }
    return 'bg-secondary-100 text-secondary-700';
  };

  const getProgressColor = (progress: number): string => {
    if (progress === 100) return 'bg-success';
    if (progress > 0) return 'bg-primary';
    return 'bg-secondary-200';
  };

  // Calculer le pourcentage de progression
  const progressPercentage = course.progress?.percentage ?? 0;

  return (
    <div className='bg-surface rounded-xl shadow-subtle hover:shadow-medium transition-all duration-300 overflow-hidden group hover:-translate-y-1 flex flex-col h-full'>
      {/* Course Image */}
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={course.image}
          alt={course.title}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {/* Overlay Badges */}
        <div className='absolute top-4 left-4 flex flex-wrap gap-2'>
          {course.difficulty && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}
            >
              {course.difficulty}
            </span>
          )}
          {course.isFree && (
            <span className='px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700'>
              Gratuit
            </span>
          )}
        </div>

        {/* Progress Overlay for Enrolled Courses */}
        {course.progress && (
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3'>
            <div className='flex items-center justify-between text-white text-sm mb-2'>
              <span>Progression</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className='w-full bg-white bg-opacity-30 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className='p-6 flex-1 flex flex-col'>
        {/* Title and Rating */}
        <div className='mb-3'>
          <h3 className='text-lg font-semibold text-text-primary mb-2 line-clamp-2'>
            {course.title}
            {course.is_new && (
              <span className='ml-2 px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded-full'>
                Nouveau
              </span>
            )}
          </h3>
          <div className='flex items-center gap-2'>
            <div className='flex items-center'>
              {[...Array(5)].map((_, i) => (
                <Icon
                  aria-hidden='true'
                  key={i}
                  name='Star'
                  size={14}
                  className={
                    i < Math.floor(course.average_rating || 0)
                      ? 'text-warning fill-current'
                      : 'text-secondary-300'
                  }
                />
              ))}
            </div>
            <span className='text-sm text-text-secondary'>
              {course.average_rating?.toFixed(1) || 'Nouveau'} • {course.enrolled_students || 0} étudiants
            </span>
          </div>
        </div>

        {/* Description */}
        <p className='text-text-secondary text-sm mb-4 line-clamp-3 flex-1'>{course.description}</p>

        {/* Course Metadata */}
        <div className='mt-4 space-y-2'>
          <div className='flex items-center gap-2 text-sm text-text-secondary'>
            <div className='flex items-center gap-1'>
              <Icon name='Clock' size={14} className='text-primary' />
              <span>{course.duration || 'Durée variable'}</span>
            </div>
            
            {course.total_lessons > 0 && (
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Icon aria-hidden='true' name='FileText' size={14} />
                  <span>{course.total_lessons} leçons</span>
                </div>
              </div>
            )}
          </div>

          {/* Prerequisites */}
          {course.prerequisites?.length > 0 && (
            <div className='pt-2'>
              <p className='text-xs text-text-secondary mb-1'>Prérequis:</p>
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

          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className='pt-2'>
              <div className='flex flex-wrap gap-1'>
                {course.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded'
                  >
                    {tag}
                  </span>
                ))}
                {course.tags.length > 3 && (
                  <span className='px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded'>
                    +{course.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='mt-4 space-y-2'>
          {course.progress && course.progress.percentage > 0 ? (
            <Link
              to='/lesson-viewer'
              className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center block'
            >
              {course.progress.percentage === 100 ? 'Revoir le cours' : 'Continuer'}
            </Link>
          ) : (
            <Link
              to='/lesson-viewer'
              className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center block'
            >
              S&apos;inscrire
            </Link>
          )}

          {course.previewLessons && course.previewLessons > 0 && (
            <button className='w-full px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors text-sm'>
              Aperçu gratuit ({course.previewLessons} leçons)
            </button>
          )}
        </div>

        {/* Instructor */}
        <div className='mt-4 pt-4 border-t border-border'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
              <Icon aria-hidden='true' name='User' size={14} color='white' />
            </div>
            <div>
              <p className='text-sm font-medium text-text-primary'>
                {course.instructor || 'Équipe IA Foundations'}
              </p>
              <p className='text-xs text-text-secondary'>Instructeur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
