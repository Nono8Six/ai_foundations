import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LessonNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  moduleStructure: Module[];
  currentLessonId?: string;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  isOpen,
  onClose,
  moduleStructure,
}) => {
  const [expandedModules, setExpandedModules] = useState(new Set([1])); // First module expanded by default

  const toggleModule = moduleId => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getTotalDuration = lessons => {
    return lessons.reduce((total, lesson) => {
      const minutes = parseInt(lesson.duration.split(' ')[0]);
      return total + minutes;
    }, 0);
  };

  const getCompletedCount = lessons => {
    return lessons.filter(lesson => lesson.completed).length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-surface border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}
      >
        {/* Header */}
        <div className='p-4 border-b border-border flex items-center justify-between'>
          <h2 className='font-semibold text-text-primary'>Navigation du cours</h2>
          <button
            onClick={onClose}
            className='lg:hidden p-1 hover:bg-secondary-50 rounded transition-colors'
          >
            <Icon name='X' size={20} aria-label='Fermer' />
          </button>
        </div>

        {/* Course Progress Overview */}
        <div className='p-4 border-b border-border bg-secondary-50'>
          <div className='mb-3'>
            <h3 className='font-medium text-text-primary mb-1'>
              Intelligence Artificielle pour Débutants
            </h3>
            <p className='text-sm text-text-secondary'>Progression générale</p>
          </div>

          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-text-secondary'>Leçons terminées</span>
            <span className='text-sm font-medium text-text-primary'>
              {moduleStructure.reduce(
                (total, module) => total + getCompletedCount(module.lessons),
                0
              )}{' '}
              / {moduleStructure.reduce((total, module) => total + module.lessons.length, 0)}
            </span>
          </div>

          <div className='w-full h-2 bg-secondary-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-300'
              style={{
                width: `${(moduleStructure.reduce((total, module) => total + getCompletedCount(module.lessons), 0) / moduleStructure.reduce((total, module) => total + module.lessons.length, 0)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Module List */}
        <div className='flex-1 overflow-auto'>
          {moduleStructure.map(module => (
            <div key={module.id} className='border-b border-border'>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className='w-full p-4 text-left hover:bg-secondary-50 transition-colors flex items-center justify-between'
              >
                <div className='flex-1'>
                  <h3 className='font-medium text-text-primary mb-1'>{module.title}</h3>
                  <div className='flex items-center space-x-4 text-sm text-text-secondary'>
                    <span>{module.lessons.length} leçons</span>
                    <span>{getTotalDuration(module.lessons)} min</span>
                    <span>
                      {getCompletedCount(module.lessons)}/{module.lessons.length} terminées
                    </span>
                  </div>
                </div>
                <Icon aria-hidden="true" 
                  name={expandedModules.has(module.id) ? 'ChevronDown' : 'ChevronRight'}
                  size={20}
                  className='text-text-secondary'
                />
              </button>

              {/* Module Progress */}
              <div className='px-4 pb-2'>
                <div className='w-full h-1 bg-secondary-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-accent transition-all duration-300'
                    style={{
                      width: `${(getCompletedCount(module.lessons) / module.lessons.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lessons List */}
              {expandedModules.has(module.id) && (
                <div className='bg-secondary-25'>
                  {module.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className={`
                        flex items-center p-3 pl-8 hover:bg-secondary-50 transition-colors cursor-pointer
                        ${lesson.current ? 'bg-primary-50 border-r-2 border-primary' : ''}
                      `}
                    >
                      {/* Lesson Status Icon */}
                      <div className='mr-3'>
                        {lesson.completed ? (
                          <div className='w-6 h-6 bg-accent rounded-full flex items-center justify-center'>
                            <Icon aria-hidden="true"  name='Check' size={14} color='white' />
                          </div>
                        ) : lesson.current ? (
                          <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
                            <Icon aria-hidden="true"  name='Play' size={12} color='white' />
                          </div>
                        ) : (
                          <div className='w-6 h-6 border-2 border-secondary-300 rounded-full flex items-center justify-center'>
                            <div className='w-2 h-2 bg-secondary-300 rounded-full' />
                          </div>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className='flex-1'>
                        <h4
                          className={`font-medium mb-1 ${lesson.current ? 'text-primary' : 'text-text-primary'}`}
                        >
                          {lesson.title}
                        </h4>
                        <div className='flex items-center space-x-3 text-sm text-text-secondary'>
                          <span className='flex items-center'>
                            <Icon aria-hidden="true"  name='Clock' size={12} className='mr-1' />
                            {lesson.duration}
                          </span>
                          {lesson.completed && (
                            <span className='flex items-center text-accent'>
                              <Icon aria-hidden="true"  name='CheckCircle' size={12} className='mr-1' />
                              Terminé
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lesson Actions */}
                      <div className='ml-2'>
                        {lesson.current && (
                          <Icon aria-hidden="true"  name='Volume2' size={16} className='text-primary' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className='p-4 border-t border-border bg-secondary-50'>
          <button className='w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors'>
            <Icon aria-hidden="true"  name='Download' size={16} className='mr-2' />
            Télécharger pour hors-ligne
          </button>
        </div>
      </div>
    </>
  );
};

export default LessonNavigation;
