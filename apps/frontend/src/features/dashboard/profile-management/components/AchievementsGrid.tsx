/**
 * AchievementsGrid - Grille UNIFIÉE de toutes les sources XP
 * 
 * Affiche TOUTES les sources d'XP unifiées : actions répétables + achievements uniques
 * ZERO donnée hardcodée - API unifiée depuis XPService.getAllXPOpportunities()
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@features/auth/contexts/AuthContext';
import { XPAdapter } from '@shared/services/xp-adapter';
import Icon from '@shared/components/AppIcon';

type FilterType = 'all' | 'actions' | 'achievements' | 'unlocked' | 'locked';
type RepeatabilityType = 'all' | 'repeatable' | 'once';
type CategoryType = 'all' | 'lesson' | 'course' | 'quiz' | 'profile' | 'streak' | 'module' | 'level' | 'xp' | 'special';

interface AchievementsGridProps {
  className?: string;
}

const AchievementsGrid: React.FC<AchievementsGridProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [repeatabilityFilter, setRepeatabilityFilter] = useState<RepeatabilityType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');

  // Récupérer TOUTES les opportunités XP unifiées (actions + achievements)
  const { data: allOpportunities, isLoading } = useQuery({
    queryKey: ['unified-xp-opportunities', user?.id],
    queryFn: () => XPAdapter.getAllXPOpportunities(),
    enabled: !!user?.id
  });

  // Filtrer les opportunités unifiées
  const filteredOpportunities = React.useMemo(() => {
    if (!allOpportunities) return [];

    return allOpportunities.filter(opportunity => {
      // Filtre par type (actions vs achievements)
      if (statusFilter === 'actions' && opportunity.category !== 'action') return false;
      if (statusFilter === 'achievements' && opportunity.category !== 'achievement') return false;
      if (statusFilter === 'unlocked' && (!opportunity.isUnlocked && opportunity.category === 'achievement')) return false;
      if (statusFilter === 'locked' && (opportunity.isUnlocked || opportunity.category === 'action')) return false;

      // Filtre par répétabilité
      if (repeatabilityFilter === 'repeatable' && !opportunity.isRepeatable) return false;
      if (repeatabilityFilter === 'once' && opportunity.isRepeatable) return false;

      // Filtre par catégorie
      if (categoryFilter !== 'all' && opportunity.sourceType !== categoryFilter) return false;

      return true;
    });
  }, [allOpportunities, statusFilter, repeatabilityFilter, categoryFilter]);

  if (isLoading || !allOpportunities) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
            <div className="h-6 bg-gray-300 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  const actionsCount = allOpportunities?.filter(o => o.category === 'action').length || 0;
  const achievementsCount = allOpportunities?.filter(o => o.category === 'achievement').length || 0;
  const unlockedAchievements = allOpportunities?.filter(o => o.category === 'achievement' && o.isUnlocked).length || 0;
  const filteredTotalCount = filteredOpportunities.length;

  return (
    <div className={className}>
      {/* En-tête avec statistiques */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon name="Trophy" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Toutes les sources XP</h3>
              <p className="text-sm text-purple-600">
                {actionsCount} actions • {achievementsCount} achievements • {unlockedAchievements} débloqués
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-20 h-3 bg-purple-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 ease-out"
                style={{ width: `${achievementsCount > 0 ? (unlockedAchievements / achievementsCount) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm font-medium text-purple-700">
              {achievementsCount > 0 ? Math.round((unlockedAchievements / achievementsCount) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtres:</span>
          </div>
          
          {/* Filtre par type */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'Tout', icon: 'Grid3x3' },
              { key: 'actions', label: 'Actions', icon: 'Zap' },
              { key: 'achievements', label: 'Achievements', icon: 'Trophy' },
              { key: 'unlocked', label: 'Débloqués', icon: 'CheckCircle' },
              { key: 'locked', label: 'Verrouillés', icon: 'Lock' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key as FilterType)}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                  statusFilter === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon name={icon} size={12} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Filtre par répétabilité */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'Toutes', icon: 'Grid3x3' },
              { key: 'repeatable', label: 'Répétables', icon: 'RotateCcw' },
              { key: 'once', label: 'Une fois', icon: 'CheckCircle' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setRepeatabilityFilter(key as RepeatabilityType)}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                  repeatabilityFilter === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon name={icon} size={12} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Filtre par catégorie */}
          <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap">
            {[
              { key: 'all', label: 'Toutes', icon: 'Grid3x3' },
              { key: 'lesson', label: 'Leçons', icon: 'BookOpen' },
              { key: 'course', label: 'Cours', icon: 'GraduationCap' },
              { key: 'quiz', label: 'Quiz', icon: 'Trophy' },
              { key: 'profile', label: 'Profil', icon: 'User' },
              { key: 'streak', label: 'Séries', icon: 'Calendar' },
              { key: 'level', label: 'Niveau', icon: 'TrendingUp' },
              { key: 'xp', label: 'XP', icon: 'Star' },
              { key: 'special', label: 'Spécial', icon: 'Crown' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key as CategoryType)}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-1 m-0.5 ${
                  categoryFilter === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon name={icon} size={10} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Compteur filtré */}
          {(statusFilter !== 'all' || repeatabilityFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredTotalCount} résultat{filteredTotalCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Grille des opportunités XP unifiées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpportunities.map((opportunity) => {
          const isAchievement = opportunity.category === 'achievement';
          const isAction = opportunity.category === 'action';
          const isCompleted = opportunity.isUnlocked === true; // Unifié pour actions ET achievements
          
          return (
            <div
              key={opportunity.id}
              className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                isCompleted
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm'
                  : isAction 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badge type et status */}
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isAction 
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {isAction ? 'Action' : 'Achievement'}
                  {opportunity.isRepeatable && isAction && ' ♾️'}
                </div>
                {isCompleted && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={14} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex items-start space-x-3 mt-2">
                {/* Icône */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? 'bg-green-500 shadow-lg'
                    : isAction && opportunity.available
                    ? 'bg-blue-500 shadow-md'
                    : 'bg-gray-200'
                }`}>
                  <Icon 
                    name={opportunity.icon} 
                    size={24} 
                    className={`${
                      isCompleted || (isAction && opportunity.available)
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  />
                </div>
                
                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold text-base pr-2 ${
                      isCompleted ? 'text-green-800' 
                      : isAction ? 'text-blue-800'
                      : 'text-gray-700'
                    }`}>
                      {opportunity.title}
                    </h4>
                    {isAction && opportunity.available && (
                      <Icon name="Zap" size={18} className="text-blue-500" />
                    )}
                  </div>
                  
                  <p className={`text-sm mb-2 leading-relaxed ${
                    isCompleted ? 'text-green-700' 
                    : isAction ? 'text-blue-700'
                    : 'text-gray-600'
                  }`}>
                    {opportunity.description}
                  </p>

                  {/* Récompense XP */}
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    isCompleted 
                      ? 'bg-green-100 text-green-800'
                      : isAction
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <Icon name="Star" size={12} />
                    <span>{opportunity.xpValue > 0 ? '+' : ''}{opportunity.xpValue} XP</span>
                  </div>
                  
                  {/* Informations supplémentaires pour actions */}
                  {isAction && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {opportunity.isRepeatable && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Répétable
                        </span>
                      )}
                      {opportunity.cooldownMinutes > 0 && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Cooldown: {opportunity.cooldownMinutes}min
                        </span>
                      )}
                      {opportunity.maxPerDay && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Max {opportunity.maxPerDay}/jour
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Progression pour achievements */}
                  {isAchievement && !isCompleted && opportunity.progress !== undefined && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Progression</span>
                        <span className="text-xs font-medium text-gray-700">
                          {opportunity.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(opportunity.progress || 0, 100)}%` }}
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
    </div>
  );
};

export default AchievementsGrid;