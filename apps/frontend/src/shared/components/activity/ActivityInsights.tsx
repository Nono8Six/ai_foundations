/**
 * ActivityInsights - Panneau d'insights et statistiques d'activité
 * 
 * Affiche les agrégations calculées:
 * - XP total sur la période
 * - Nombre total d'événements  
 * - Top 3 des types d'activité
 * - Graphique simple des derniers jours
 */

import React from 'react';
import Icon from '@shared/components/AppIcon';
import { ActivityAggregates } from '@shared/services/activityService';

export interface ActivityInsightsProps {
  aggregates: ActivityAggregates;
  period: string;
  isLoading?: boolean;
  className?: string;
}

const TYPE_LABELS: Record<string, string> = {
  'profile': 'Profil',
  'lesson': 'Leçons', 
  'course': 'Cours',
  'quiz': 'Quiz',
  'achievement': 'Badges',
  'streak': 'Séries',
  'system': 'Système'
};

const TYPE_ICONS: Record<string, string> = {
  'profile': 'User',
  'lesson': 'BookOpen',
  'course': 'Award', 
  'quiz': 'CheckCircle',
  'achievement': 'Medal',
  'streak': 'Flame',
  'system': 'Settings'
};

const ActivityInsights: React.FC<ActivityInsightsProps> = ({
  aggregates,
  period,
  isLoading = false,
  className = ''
}) => {
  const periodLabel = {
    '30d': '30 derniers jours',
    '90d': '90 derniers jours', 
    '12m': '12 derniers mois',
    'all': 'Depuis le début'
  }[period] || period;

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-text-primary mb-1">
          Aperçu
        </h4>
        <p className="text-sm text-text-secondary">
          {periodLabel}
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 gap-3">
        {/* XP Total */}
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {aggregates.totalXP > 0 ? '+' : ''}{aggregates.totalXP}
          </div>
          <div className="text-xs text-text-secondary">XP gagnés</div>
        </div>

        {/* Événements */}
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Activity" size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {aggregates.totalEvents}
          </div>
          <div className="text-xs text-text-secondary">
            Événement{aggregates.totalEvents > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Top activités */}
      {aggregates.topTypes.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <h5 className="text-sm font-semibold text-text-primary mb-3 flex items-center">
            <Icon name="TrendingUp" size={14} className="mr-2 text-accent" />
            Top activités
          </h5>
          
          <div className="space-y-3">
            {aggregates.topTypes.slice(0, 3).map((typeStats, index) => {
              const label = TYPE_LABELS[typeStats.type] || typeStats.type;
              const icon = TYPE_ICONS[typeStats.type] || 'Activity';
              const maxXP = Math.max(...aggregates.topTypes.map(t => t.totalXP));
              const percentage = maxXP > 0 ? (typeStats.totalXP / maxXP) * 100 : 0;
              
              return (
                <div key={typeStats.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center text-sm">
                      <Icon name={icon} size={14} className="mr-2 text-text-secondary" />
                      <span className="text-text-primary">{label}</span>
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                      {typeStats.totalXP > 0 ? '+' : ''}{typeStats.totalXP} XP
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-text-secondary mt-1">
                    {typeStats.count} événement{typeStats.count > 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mini graphique des derniers jours */}
      {aggregates.eventsByDay.length > 1 && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <h5 className="text-sm font-semibold text-text-primary mb-3 flex items-center">
            <Icon name="BarChart" size={14} className="mr-2 text-accent" />
            Activité récente
          </h5>
          
          <div className="flex items-end justify-between h-16 space-x-1">
            {aggregates.eventsByDay.slice(-7).map((dayStats, _index) => {
              const maxCount = Math.max(...aggregates.eventsByDay.map(d => d.count));
              const height = maxCount > 0 ? (dayStats.count / maxCount) * 100 : 0;
              const date = new Date(dayStats.date);
              
              return (
                <div key={dayStats.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent rounded-t transition-all duration-300 min-h-[2px]"
                    style={{ height: `${Math.max(height, 3)}%` }}
                    title={`${dayStats.count} événement${dayStats.count > 1 ? 's' : ''} le ${date.toLocaleDateString('fr-FR')}`}
                  />
                  <div className="text-xs text-text-secondary mt-1 transform rotate-45 origin-bottom-left">
                    {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Astuce conditionnelle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h6 className="text-sm font-semibold text-blue-800 mb-1">
              Astuce
            </h6>
            <p className="text-xs text-blue-700">
              {aggregates.totalXP === 0 
                ? "Terminez des leçons ou complétez votre profil pour gagner vos premiers points d'expérience !"
                : "Maintenez une routine d'apprentissage quotidienne pour maximiser vos gains d'XP et débloquer de nouveaux badges."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityInsights;