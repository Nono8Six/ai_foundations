import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';
import Image from '@frontend/components/AppImage';
import type {
  AchievementRowCamel as Achievement,
} from '@frontend/types/database.types';

export interface AchievementCarouselProps {
  achievements?: Achievement[];
}

const AchievementCarousel: React.FC<AchievementCarouselProps> = ({ achievements = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getRarityColor = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
      case 'common':
        return 'border-secondary-300 bg-secondary-50';
      case 'uncommon':
        return 'border-success-300 bg-success-50';
      case 'rare':
        return 'border-primary-300 bg-primary-50';
      case 'epic':
        return 'border-warning-300 bg-warning-50';
      case 'legendary':
        return 'border-error-300 bg-error-50';
      default:
        return 'border-secondary-300 bg-secondary-50';
    }
  };

  const getRarityTextColor = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
      case 'common':
        return 'text-secondary-600';
      case 'uncommon':
        return 'text-success-600';
      case 'rare':
        return 'text-primary-600';
      case 'epic':
        return 'text-warning-600';
      case 'legendary':
        return 'text-error-600';
      default:
        return 'text-secondary-600';
    }
  };

  const nextAchievement = (): void => {
    setCurrentIndex(prev => (prev + 1) % achievements.length);
  };

  const prevAchievement = (): void => {
    setCurrentIndex(prev => (prev - 1 + achievements.length) % achievements.length);
  };

  if (!achievements.length) {
    return (
      <div className='bg-surface rounded-xl border border-border p-6'>
        <p className='text-sm text-text-secondary'>Aucun succès pour le moment.</p>
      </div>
    );
  }

  const currentAchievement = achievements[currentIndex];
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className='bg-surface rounded-xl border border-border p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-text-primary'>Succès</h3>
        <span className='text-sm text-text-secondary'>
          {earnedCount}/{achievements.length}
        </span>
      </div>

      <div
        className={`relative rounded-lg border-2 p-4 mb-4 transition-all duration-300 ${getRarityColor(currentAchievement.rarity)}`}
      >
        {currentAchievement.earned && (
          <div className='absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center'>
            <Icon aria-hidden='true' name='Check' size={14} color='white' />
          </div>
        )}
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
            <Image
              src={currentAchievement.icon}
              alt={currentAchievement.title}
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1'>
            <h4 className='font-medium text-text-primary'>{currentAchievement.title}</h4>
            <p className='text-sm text-text-secondary'>{currentAchievement.description}</p>
          </div>
          <div className={`text-sm font-medium ${getRarityTextColor(currentAchievement.rarity)}`}>
            {currentAchievement.xpReward} XP
          </div>
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <button
          onClick={prevAchievement}
          className='p-2 rounded-full hover:bg-secondary-100 transition-colors'
          disabled={achievements.length <= 1}
        >
          <Icon aria-hidden='true' name='ChevronLeft' size={16} className='text-text-secondary' />
        </button>
        <div className='flex space-x-2'>
          {achievements.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-secondary-300 hover:bg-secondary-400'}`}
            />
          ))}
        </div>
        <button
          onClick={nextAchievement}
          className='p-2 rounded-full hover:bg-secondary-100 transition-colors'
          disabled={achievements.length <= 1}
        >
          <Icon aria-hidden='true' name='ChevronRight' size={16} className='text-text-secondary' />
        </button>
      </div>

      <div className='mt-4 pt-4 border-t border-border'>
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <p className='text-lg font-semibold text-text-primary'>{earnedCount}</p>
            <p className='text-xs text-text-secondary'>Obtenus</p>
          </div>
          <div>
            <p className='text-lg font-semibold text-text-primary'>
              {achievements.filter(a => a.earned).reduce((sum, a) => sum + a.xpReward, 0)}
            </p>
            <p className='text-xs text-text-secondary'>XP des succès</p>
          </div>
        </div>
      </div>

      <button className='w-full mt-4 text-center text-primary hover:text-primary-700 transition-colors text-sm font-medium py-2 border border-primary rounded-lg hover:bg-primary-50'>
        Voir tous les succès
      </button>
    </div>
  );
};

export default AchievementCarousel;
