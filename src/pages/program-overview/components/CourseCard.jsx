import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CourseCard = ({ course }) => {
  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-success-100 text-success-700';
      case 'Intermédiaire':
        return 'bg-warning-100 text-warning-700';
      case 'Avancé':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getProgressColor = progress => {
    if (progress === 100) return 'bg-success';
    if (progress > 0) return 'bg-primary';
    return 'bg-secondary-200';
  };

  return (
    <div className='bg-surface rounded-xl shadow-subtle hover:shadow-medium transition-all duration-300 overflow-hidden group hover:-translate-y-1'>
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
        {course.isEnrolled && (
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3'>
            <div className='flex items-center justify-between text-white text-sm mb-2'>
              <span>Progression</span>
              <span>{course.progress}%</span>
            </div>
            <div className='w-full bg-white bg-opacity-30 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className='p-6'>
        {/* Title and Rating */}
        <div className='mb-3'>
          <h3 className='text-lg font-semibold text-text-primary mb-2 line-clamp-2'>
            {course.title}
          </h3>
          {course.rating !== undefined && (
            <div className='flex items-center gap-2'>
              <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name='Star'
                    size={14}
                    className={
                      i < Math.floor(course.rating)
                        ? 'text-warning fill-current'
                        : 'text-secondary-300'
                    }
                  />
                ))}
              </div>
              <span className='text-sm text-text-secondary'>
                {course.rating} ({course.enrolledStudents || 0} étudiants)
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className='text-text-secondary text-sm mb-4 line-clamp-3'>{course.description}</p>

        {/* Course Meta */}
        {(course.duration || course.modules || course.xpReward || course.lessons) && (
          <div className='space-y-2 mb-4'>
            <div className='flex items-center gap-4 text-sm text-text-secondary'>
              {course.duration && (
                <div className='flex items-center gap-1'>
                  <Icon name='Clock' size={14} />
                  <span>{course.duration}</span>
                </div>
              )}
              {course.modules && (
                <div className='flex items-center gap-1'>
                  <Icon name='BookOpen' size={14} />
                  <span>{course.modules} modules</span>
                </div>
              )}
            </div>

            {(course.xpReward || course.lessons) && (
              <div className='flex items-center gap-4 text-sm text-text-secondary'>
                {course.xpReward && (
                  <div className='flex items-center gap-1'>
                    <Icon name='Award' size={14} />
                    <span>{course.xpReward} XP</span>
                  </div>
                )}
                {course.lessons && (
                  <div className='flex items-center gap-1'>
                    <Icon name='Users' size={14} />
                    <span>{course.lessons} leçons</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Prerequisites */}
        {course.prerequisites?.length > 0 && (
          <div className='mb-4'>
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
          <div className='mb-4'>
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

        {/* Action Buttons */}
        <div className='space-y-2'>
          {course.isEnrolled ? (
            <Link
              to='/lesson-viewer'
              className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center block'
            >
              {course.progress === 100 ? 'Revoir le cours' : 'Continuer'}
            </Link>
          ) : (
            <Link
              to='/lesson-viewer'
              className='w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center block'
            >
              S'inscrire
            </Link>
          )}

          {course.previewLessons > 0 && (
            <button className='w-full px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors text-sm'>
              Aperçu gratuit ({course.previewLessons} leçons)
            </button>
          )}
        </div>

        {/* Instructor */}
        <div className='mt-4 pt-4 border-t border-border'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
              <Icon name='User' size={14} color='white' />
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
