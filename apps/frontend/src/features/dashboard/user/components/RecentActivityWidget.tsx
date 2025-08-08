/**
 * RecentActivityWidget - Widget activité récente avec formatter commun
 * 
 * Remplace l'ancien RecentActivity qui affichait du JSON brut.
 * Utilise ActivityService et formatters pour affichage humanisé.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Icon from '@shared/components/AppIcon';
import ActivityItem from '@shared/components/activity/ActivityItem';
import { ActivityService } from '@shared/services/activityService';
import { formatActivities } from '@shared/utils/activityFormatter';

export interface RecentActivityWidgetProps {
  userId?: string;
  limit?: number;
  className?: string;
}

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  userId,
  limit = 5,
  className = ''
}) => {
  // Récupérer les activités récentes
  const { data: recentActivities = [], isLoading, error } = useQuery({
    queryKey: ['recent-activities-widget', userId, limit],
    queryFn: () => userId ? ActivityService.getRecentActivities(userId, limit) : [],
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false
  });

  // Formatter les activités pour affichage
  const formattedActivities = formatActivities(recentActivities);

  if (error) {
    return (
      <div className={`bg-surface rounded-xl border border-border p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Activité récente</h2>
        </div>
        
        <div className="text-center py-8">
          <Icon name="AlertCircle" size={32} className="mx-auto text-red-500 mb-4" />
          <p className="text-text-secondary">
            Impossible de charger votre activité récente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Activité récente</h2>
        {formattedActivities.length > 0 && (
          <Link
            to="/profile?tab=stats"
            className="text-primary hover:text-primary-700 transition-colors text-sm font-medium"
          >
            Voir tout
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3 p-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : formattedActivities.length === 0 ? (
        // État vide avec encouragement
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Icon name="Sparkles" size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Prêt à commencer ?
          </h3>
          <p className="text-text-secondary mb-4">
            Vos activités d'apprentissage apparaîtront ici dès que vous commencerez un cours ou mettrez à jour votre profil.
          </p>
          <Link
            to="/programmes"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Icon name="BookOpen" size={16} className="mr-2" />
            Explorer les cours
          </Link>
        </div>
      ) : (
        // Timeline avec activités formatées
        <div className="space-y-1">
          {formattedActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Ligne de connexion */}
              {index < formattedActivities.length - 1 && (
                <div className="absolute left-4 top-12 w-0.5 h-8 bg-border" />
              )}
              
              {/* Item d'activité avec formatter humain */}
              <div className="bg-background border border-border rounded-lg hover:border-primary/20 transition-colors">
                <ActivityItem
                  activity={activity}
                  size="sm"
                  showDetails={false} // Pas de détails dans le widget
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer avec lien vers page complète */}
      {formattedActivities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <Link
            to="/profile?tab=stats"
            className="w-full text-center text-primary hover:text-primary-700 transition-colors text-sm font-medium py-2 block"
          >
            Afficher toute l&rsquo;activité
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentActivityWidget;