/**
 * ActivityTimeline - Timeline d'activités avec groupement temporel et pagination
 * 
 * Affiche les activités groupées par jour/semaine/mois selon la période.
 * Pagination infinie avec scroll loading pour performance.
 * Utilise ActivityItem pour l'affichage uniforme.
 */

import React, { useMemo } from 'react';
import Icon from '@shared/components/AppIcon';
import ActivityItem from './ActivityItem';
import { FormattedActivity } from '@shared/utils/activityFormatter';

export interface ActivityTimelineProps {
  activities: FormattedActivity[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  groupBy?: 'day' | 'week' | 'month';
  showDetails?: boolean;
  className?: string;
}

interface ActivityGroup {
  date: string;
  label: string;
  activities: FormattedActivity[];
  totalXP: number;
}

/**
 * Groupe les activités par période
 */
function groupActivities(
  activities: FormattedActivity[],
  groupBy: 'day' | 'week' | 'month'
): ActivityGroup[] {
  const groupsMap = new Map<string, ActivityGroup>();

  activities.forEach(activity => {
    const date = new Date(activity.timeAgo === 'maintenant' ? new Date() : getDateFromTimeAgo(activity.timeAgo));
    const groupKey = getGroupKey(date, groupBy);
    const groupLabel = getGroupLabel(groupKey, groupBy);

    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, {
        date: groupKey,
        label: groupLabel,
        activities: [],
        totalXP: 0
      });
    }

    const group = groupsMap.get(groupKey);
    if (group) {
      group.activities.push(activity);
      
      if (activity.xpDelta) {
        group.totalXP += activity.xpDelta;
      }
    }
  });

  // Trier par date décroissante
  return Array.from(groupsMap.values())
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Génère une clé de groupe selon le niveau de groupement
 */
function getGroupKey(date: Date, groupBy: 'day' | 'week' | 'month'): string {
  switch (groupBy) {
    case 'day':
      return date.toISOString().split('T')[0]; // "2025-01-08"
    case 'week': {
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      return `${year}-W${String(week).padStart(2, '0')}`; // "2025-W02"
    }
    case 'month':
      return date.toISOString().substring(0, 7); // "2025-01"
    default:
      return date.toISOString().split('T')[0];
  }
}

/**
 * Génère un label lisible pour le groupe
 */
function getGroupLabel(groupKey: string, groupBy: 'day' | 'week' | 'month'): string {
  try {
    switch (groupBy) {
      case 'day': {
        const date = new Date(groupKey);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (groupKey === today.toISOString().split('T')[0]) {
          return "Aujourd'hui";
        }
        if (groupKey === yesterday.toISOString().split('T')[0]) {
          return "Hier";
        }
        
        return date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
      }
      
      case 'week': {
        const [year, weekStr] = groupKey.split('-W');
        const week = parseInt(weekStr);
        const jan1 = new Date(parseInt(year), 0, 1);
        const weekStart = new Date(jan1.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
        
        return `Semaine du ${weekStart.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long' 
        })}`;
      }
      
      case 'month': {
        const date = new Date(`${groupKey  }-01`);
        return date.toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        });
      }
      
      default:
        return groupKey;
    }
  } catch (error) {
    return groupKey;
  }
}

/**
 * Calcule le numéro de semaine dans l'année
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Parse approximatif du timeAgo vers Date (pour le groupement)
 */
function getDateFromTimeAgo(timeAgo: string): Date {
  const now = new Date();
  
  if (timeAgo === 'maintenant') return now;
  
  // Parse les formats comme "il y a 2 j", "il y a 3 h", etc.
  const matches = timeAgo.match(/il y a (\d+)\s*([hmj])/);
  if (matches) {
    const value = parseInt(matches[1]);
    const unit = matches[2];
    
    switch (unit) {
      case 'h':
        return new Date(now.getTime() - value * 60 * 60 * 1000);
      case 'j':
        return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
      case 'm':
        return new Date(now.getTime() - value * 60 * 1000);
      default:
        return now;
    }
  }
  
  return now;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  groupBy = 'day',
  showDetails = false,
  className = ''
}) => {
  const groups = useMemo(() => {
    return groupActivities(activities, groupBy);
  }, [activities, groupBy]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  };

  if (activities.length === 0 && !isLoading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Icon name="Calendar" size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Aucune activité trouvée
        </h3>
        <p className="text-text-secondary max-w-md mx-auto">
          Aucun événement ne correspond à vos critères de recherche. 
          Essayez de modifier vos filtres ou la période sélectionnée.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {groups.map(group => (
        <div key={group.date} className="relative">
          {/* Header du groupe */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm pb-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                {group.label}
              </h3>
              
              {group.totalXP !== 0 && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  group.totalXP > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {group.totalXP > 0 ? '+' : ''}{group.totalXP} XP
                </span>
              )}
            </div>
            <div className="h-px bg-border mt-4" />
          </div>

          {/* Activités du groupe */}
          <div className="space-y-1">
            {group.activities.map(activity => (
              <div
                key={activity.id}
                className="bg-surface border border-border rounded-lg hover:border-primary/20 transition-colors"
              >
                <ActivityItem
                  activity={activity}
                  size="md"
                  showDetails={showDetails}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Load More */}
      {(hasMore || isLoading) && (
        <div className="text-center pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Icon name="Loader" size={20} className="animate-spin text-accent mr-2" />
              <span className="text-text-secondary">Chargement...</span>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center px-6 py-3 border border-border rounded-lg text-text-primary hover:bg-surface hover:border-primary/20 transition-colors"
            >
              <Icon name="ChevronDown" size={16} className="mr-2" />
              Voir plus d'activités
            </button>
          )}
        </div>
      )}

      {/* État vide avec chargement initial */}
      {isLoading && activities.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-4">
              <div className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;