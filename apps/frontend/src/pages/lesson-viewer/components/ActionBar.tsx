import React from 'react';
import Icon from '../../../components/AppIcon';

const ActionBar = ({ onPrevious, onNext, onComplete, onToggleNotes, isCompleted, progress }) => {
  return (
    <div className='bg-surface border-t border-border p-4'>
      <div className='max-w-4xl mx-auto flex items-center justify-between'>
        {/* Left Actions */}
        <div className='flex items-center space-x-3'>
          <button
            onClick={onPrevious}
            className='flex items-center px-4 py-2 text-text-secondary hover:text-primary border border-border rounded-lg hover:bg-secondary-50 transition-colors'
          >
            <Icon aria-hidden="true"  name='ChevronLeft' size={16} className='mr-2' />
            <span className='hidden sm:inline'>Précédent</span>
          </button>

          <button
            onClick={onToggleNotes}
            className='flex items-center px-4 py-2 text-text-secondary hover:text-primary border border-border rounded-lg hover:bg-secondary-50 transition-colors'
          >
            <Icon aria-hidden="true"  name='StickyNote' size={16} className='mr-2' />
            <span className='hidden sm:inline'>Notes</span>
          </button>
        </div>

        {/* Center Progress */}
        <div className='hidden md:flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <Icon aria-hidden="true"  name='Clock' size={16} className='text-text-secondary' />
            <span className='text-sm text-text-secondary'>15 min restantes</span>
          </div>

          <div className='w-32 h-2 bg-secondary-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className='flex items-center space-x-3'>
          {!isCompleted ? (
            <button
              onClick={onComplete}
              className='flex items-center px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-700 transition-colors'
            >
              <Icon aria-hidden="true"  name='CheckCircle' size={16} className='mr-2' />
              <span>Marquer comme terminé</span>
            </button>
          ) : (
            <div className='flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-lg'>
              <Icon aria-hidden="true"  name='CheckCircle' size={16} className='mr-2' />
              <span>Terminé</span>
            </div>
          )}

          <button
            onClick={onNext}
            className='flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            <span className='hidden sm:inline'>Suivant</span>
            <Icon aria-hidden="true"  name='ChevronRight' size={16} className='ml-2' />
          </button>
        </div>
      </div>

      {/* Mobile Progress */}
      <div className='md:hidden mt-3 flex items-center justify-between'>
        <span className='text-sm text-text-secondary'>Progression: {Math.round(progress)}%</span>
        <div className='flex-1 mx-4 h-2 bg-secondary-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className='text-sm text-text-secondary'>15 min</span>
      </div>
    </div>
  );
};

export default ActionBar;
