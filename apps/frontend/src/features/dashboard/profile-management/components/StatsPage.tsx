/**
 * Stats Page - Timeline d'activité avec données réelles depuis activity_log
 * 
 * Refonte complète avec :
 * - Timeline des événements XP/activité avec libellés humains (pas de JSON brut)
 * - Filtres scalables (période, type, XP uniquement, tri)
 * - Groupements temporels auto (jour/semaine/mois)
 * - Pagination infinie avec TanStack Query
 * - Insights contextuels avec agrégations
 * - Astuce profil masquée si profil déjà complété
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@features/auth/contexts/AuthContext';

// Services et formatters
import { 
  ActivityService,
  type ActivityFilters,
  type ActivityPagination 
} from '@shared/services/activityService';
import { 
  formatActivities, 
  isProfileComplete,
  type FormattedActivity 
} from '@shared/utils/activityFormatter';

// Composants d'activité
import ActivityFilters from '@shared/components/activity/ActivityFilters';
import ActivityTimeline from '@shared/components/activity/ActivityTimeline';
import ActivityInsights from '@shared/components/activity/ActivityInsights';

// Composants partagés
import Icon from '@shared/components/AppIcon';

const INITIAL_FILTERS: ActivityFilters = {
  period: '90d',
  sortBy: 'recent'
};

const PAGE_SIZE = 20;

const StatsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [filters, setFilters] = useState<ActivityFilters>(INITIAL_FILTERS);

  // Déterminer le niveau de groupement selon la période
  const groupBy = useMemo(() => {
    switch (filters.period) {
      case '30d':
        return 'day';
      case '90d': 
        return 'week';
      case '12m':
      case 'all':
        return 'month';
      default:
        return 'day';
    }
  }, [filters.period]);

  // Vérifier si le profil est complet pour masquer l'astuce
  const profileCompleted = useMemo(() => {
    return userProfile ? isProfileComplete(userProfile) : false;
  }, [userProfile]);

  // Query keys stables
  const queryKeys = useMemo(() => ({
    activities: ['user-activities', user?.id, filters],
    aggregates: ['activity-aggregates', user?.id, { period: filters.period, types: filters.types }],
    availableTypes: ['activity-types', user?.id],
    hasXP: ['has-xp-activities', user?.id]
  }), [user?.id, filters]);

  // Vérifier si l'utilisateur a des activités XP
  const { data: hasXPActivities, isLoading: checkingXP } = useQuery({
    queryKey: queryKeys.hasXP,
    queryFn: () => user?.id ? ActivityService.hasXPActivities(user.id) : false,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Timeline des activités avec pagination infinie
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchActivities
  } = useInfiniteQuery({
    queryKey: queryKeys.activities,
    queryFn: ({ pageParam = 0 }) => {
      if (!user?.id) {
        return { activities: [], totalCount: 0, hasMore: false };
      }
      return ActivityService.getUserActivities(
        user.id,
        filters,
        { page: pageParam, pageSize: PAGE_SIZE }
      );
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false
  });

  // Agrégations pour insights
  const { data: aggregates, isLoading: aggregatesLoading } = useQuery({
    queryKey: queryKeys.aggregates,
    queryFn: () => user?.id ? ActivityService.getActivityAggregates(user.id, filters) : null,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Types disponibles pour filtres
  const { data: availableTypes = [] } = useQuery({
    queryKey: queryKeys.availableTypes,
    queryFn: () => user?.id ? ActivityService.getAvailableTypes(user.id) : [],
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Handlers
  const handleFiltersChange = useCallback((newFilters: ActivityFilters) => {
    setFilters(newFilters);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Formatter toutes les activités des pages
  const allActivities: FormattedActivity[] = useMemo(() => {
    if (!activitiesData?.pages) return [];
    
    const rawActivities = activitiesData.pages.flatMap(page => page.activities);
    return formatActivities(rawActivities);
  }, [activitiesData]);

  const totalActivityCount = useMemo(() => {
    return activitiesData?.pages?.[0]?.totalCount || 0;
  }, [activitiesData]);

  // Loading state initial  
  if (checkingXP) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Icon name="Loader" className="animate-spin text-primary mx-auto mb-4" size={32} />
            <p className="text-text-secondary">Chargement de votre activité...</p>
          </div>
        </div>
      </div>
    );
  }

  // Aucune activité trouvée
  if (totalActivityCount === 0 && !activitiesLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Statistiques d'apprentissage
          </h3>
          <p className="text-text-secondary text-sm">
            Votre journal d'activité est encore vide
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Icon name="Sparkles" size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-3">
            Prêt à commencer votre aventure ?
          </h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Vos activités d'apprentissage apparaîtront ici dès que vous commencerez. 
            Chaque action compte pour votre progression !
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/programmes"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Icon name="BookOpen" size={18} className="mr-2" />
              Explorer les cours
            </a>
            
            {!profileCompleted && (
              <a
                href="/profile?tab=personal"
                className="inline-flex items-center px-6 py-3 text-text-primary border border-border rounded-lg hover:bg-surface transition-colors font-medium"
              >
                <Icon name="User" size={18} className="mr-2" />
                Compléter mon profil
              </a>
            )}
          </div>
          
          {!profileCompleted && (
            <div className="mt-8 pt-6 border-t border-border max-w-sm mx-auto">
              <div className="flex items-center justify-center space-x-2 text-xs text-text-secondary">
                <Icon name="Lightbulb" size={14} />
                <span>
                  Astuce : Complétez votre profil pour gagner vos premiers XP !
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Rendu principal avec données
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Statistiques d'apprentissage
        </h3>
        <p className="text-text-secondary text-sm">
          Votre journal d'activité avec {totalActivityCount} événement{totalActivityCount > 1 ? 's' : ''}
          {hasXPActivities && ' • Gains XP inclus'}
        </p>
      </div>

      {/* Barre de filtres */}
      <ActivityFilters
        filters={filters}
        availableTypes={availableTypes}
        onFiltersChange={handleFiltersChange}
        isLoading={activitiesLoading || aggregatesLoading}
      />

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Timeline principale (col-span-3 sur lg) */}
        <div className="lg:col-span-3">
          <ActivityTimeline
            activities={allActivities}
            isLoading={activitiesLoading}
            hasMore={hasNextPage}
            onLoadMore={handleLoadMore}
            groupBy={groupBy}
            showDetails={true}
          />
        </div>

        {/* Sidebar avec insights (col-span-1 sur lg) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {/* Insights avec agrégations */}
            {aggregates && (
              <ActivityInsights
                aggregates={aggregates}
                period={filters.period || '90d'}
                isLoading={aggregatesLoading}
              />
            )}

            {/* Stats rapides du profil (pas de duplication avec header) */}
            {userProfile && (
              <div className="bg-surface rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center">
                  <Icon name="Activity" size={14} className="mr-2 text-accent" />
                  Progression
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Série actuelle</span>
                    <span className="font-medium text-text-primary">
                      {userProfile.current_streak} jour{userProfile.current_streak !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {userProfile.last_completed_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Dernière activité</span>
                      <span className="font-medium text-text-primary">
                        {new Date(userProfile.last_completed_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Astuce conditionnelle - masquée si profil complété */}
            {!profileCompleted && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-blue-800 mb-1">
                      Conseil
                    </h5>
                    <p className="text-xs text-blue-700">
                      Complétez votre profil pour débloquer plus d'XP et maximiser 
                      votre progression dans l'apprentissage !
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer avec indicateur temps réel */}
      <div className="text-center pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Données temps réel</span>
          </div>
          <div className="w-px h-3 bg-border"></div>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={12} />
            <span>Timeline optimisée</span>
          </div>
          <div className="w-px h-3 bg-border"></div>
          <div>
            {totalActivityCount} événement{totalActivityCount > 1 ? 's' : ''} total
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;