/**
 * AchievementsProgress - Composant d'achievements avec progression
 * 
 * Affichage moderne et gamifié des achievements avec :
 * - Progression visuelle
 * - Animations de déverrouillage 
 * - États visuels clairs
 * - Tooltips informatifs
 */

import React, { useState } from 'react';
import Icon from '@shared/components/AppIcon';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  reward?: string;
  category: 'learning' | 'social' | 'completion' | 'streak';
}

interface AchievementsProgressProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}

const categoryConfig = {
  learning: {
    label: 'Apprentissage',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  social: {
    label: 'Social',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  completion: {
    label: 'Complétion',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  streak: {
    label: 'Série',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
};

const AchievementsProgress: React.FC<AchievementsProgressProps> = ({
  achievements,
  onAchievementClick,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className={className}>
      {/* Header avec progression globale */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Icon name="Award" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
            <p className="text-sm text-gray-500">
              {unlockedCount}/{totalCount} débloqués • {progressPercentage}% complété
            </p>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tous ({totalCount})
        </button>
        
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = achievements.filter(a => a.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as Achievement['category'])}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? `bg-gradient-to-r ${config.color} text-white`
                  : `${config.bgColor} text-gray-600 hover:bg-opacity-80`
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grille d'achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => {
          const categoryStyle = categoryConfig[achievement.category];
          const progressPercent = achievement.progress && achievement.maxProgress
            ? (achievement.progress / achievement.maxProgress) * 100
            : 0;

          return (
            <div
              key={achievement.id}
              onClick={() => onAchievementClick?.(achievement)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                achievement.unlocked
                  ? `${categoryStyle.bgColor} ${categoryStyle.borderColor} shadow-sm hover:shadow-md`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {/* Badge de statut */}
              {achievement.unlocked && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Icône de l'achievement */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  achievement.unlocked
                    ? `bg-gradient-to-r ${categoryStyle.color} shadow-lg`
                    : 'bg-gray-300'
                }`}>
                  <Icon 
                    name={achievement.icon} 
                    size={20} 
                    className={achievement.unlocked ? 'text-white' : 'text-gray-500'} 
                  />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm mb-1 ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h4>
                  
                  <p className={`text-xs mb-2 ${
                    achievement.unlocked ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Récompense */}
                  {achievement.reward && achievement.unlocked && (
                    <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
                      <Icon name="Gift" size={10} />
                      <span>{achievement.reward}</span>
                    </div>
                  )}

                  {/* Barre de progression */}
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gray-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun achievement dans la catégorie */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Icon name="Award" size={32} className="mx-auto mb-2 opacity-50" />
          <p>Aucun achievement dans cette catégorie</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsProgress;