/**
 * XP Timeline - Timeline des événements XP groupés temporellement
 * 
 * Composant principal qui affiche la timeline des gains XP :
 * - Groupements temporels adaptatifs (jour/semaine/mois)
 * - Support virtualisation avec react-window (si installé)
 * - Pagination infinie avec intersection observer
 * - Loading states et empty state élégant
 * - Fully responsive et accessible
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import Icon from '@shared/components/AppIcon';
import GroupHeader from './GroupHeader';
import type { XPTimelineGroup, XPEvent } from '@shared/services/xpService';

interface TimelineProps {
  groups: XPTimelineGroup[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalEventCount: number;
  emptyStateConfig?: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

/**
 * Composant pour un événement XP individuel
 */
interface XPEventItemProps {
  event: XPEvent;
  isLast: boolean;
}

const XPEventItem: React.FC<XPEventItemProps> = ({ event, isLast }) => {
  const eventDate = new Date(event.created_at);
  const timeString = eventDate.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Déterminer l'icône selon la source
  const getSourceIcon = (source: string): string => {
    if (source.includes('profile')) return 'User';
    if (source.includes('lesson')) return 'BookOpen';
    if (source.includes('quiz')) return 'CheckCircle';
    if (source.includes('course')) return 'Award';
    if (source.includes('achievement')) return 'Trophy';
    if (source.includes('streak')) return 'Flame';
    return 'Zap';
  };

  // Formatage du nom de source pour affichage
  const formatSourceDisplay = (source: string): string => {
    const sourceMap: Record<string, string> = {
      'profile:completion': 'Profil complété',
      'lesson:completed': 'Leçon terminée',
      'quiz:passed': 'Quiz réussi',
      'course:completed': 'Cours terminé',
      'achievement:unlocked': 'Accomplissement',
      'streak:milestone': 'Étape de série'
    };
    return sourceMap[source] || source;
  };

  const sourceIcon = getSourceIcon(event.source || event.type);
  const displaySource = formatSourceDisplay(event.source || `${event.type}:${event.action}`);

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-4 top-12 bottom-0 w-px bg-border" />
      )}
      
      {/* Event content */}
      <div className="flex items-start space-x-3 pb-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name={sourceIcon} size={14} className="text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-text-primary truncate">
              {displaySource}
            </p>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <span className="text-sm font-bold text-green-600">
                +{event.xp_delta} XP
              </span>
              <span className="text-xs text-text-secondary">
                {timeString}
              </span>
            </div>
          </div>
          
          {/* Détails additionnels si disponibles */}
          {event.details && Object.keys(event.details).length > 0 && (
            <div className="text-xs text-text-secondary">
              {event.details.description || event.details.title || event.action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Composant pour un groupe temporel d'événements
 */
interface TimelineGroupProps {
  group: XPTimelineGroup;
}

const TimelineGroup: React.FC<TimelineGroupProps> = ({ group }) => {
  return (
    <div className="mb-8">
      {/* En-tête du groupe */}
      <GroupHeader
        label={group.label}
        totalXp={group.totalXp}
        eventCount={group.eventCount}
      />
      
      {/* Events du groupe */}
      <div className="mt-4 pl-4">
        {group.events.map((event, index) => (
          <XPEventItem
            key={event.id}
            event={event}
            isLast={index === group.events.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Composant de loading skeleton
 */
const TimelineSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="space-y-4">
        {/* Group header skeleton */}
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Events skeleton */}
        <div className="pl-4 space-y-3">
          {[1, 2].map(j => (
            <div key={j} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/**
 * Composant d'empty state
 */
interface EmptyStateProps {
  config: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ config }) => (
  <div className="text-center py-16">
    <div className="mb-6">
      <Icon name="BarChart3" size={64} className="mx-auto text-gray-300 mb-4" />
    </div>
    
    <h3 className="text-lg font-semibold text-text-primary mb-2">
      {config.title}
    </h3>
    
    <p className="text-text-secondary mb-6 max-w-md mx-auto">
      {config.description}
    </p>
    
    <a
      href={config.ctaHref}
      className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
    >
      <Icon name="Play" size={18} className="mr-2" />
      {config.ctaLabel}
    </a>
  </div>
);

/**
 * Hook pour la pagination infinie avec Intersection Observer
 */
function useInfiniteScroll(
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: () => void
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: '100px', // Charger 100px avant d'atteindre le bas
        threshold: 0.1
      }
    );

    observer.observe(sentinel);
    
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return sentinelRef;
}

/**
 * Composant Timeline principal
 */
const Timeline = forwardRef<HTMLDivElement, TimelineProps>(({
  groups,
  isLoading,
  hasMore,
  onLoadMore,
  totalEventCount,
  emptyStateConfig
}, ref) => {
  const sentinelRef = useInfiniteScroll(hasMore, isLoading, onLoadMore);

  // Empty state si pas de groupes
  if (!isLoading && groups.length === 0) {
    const defaultEmptyConfig = {
      title: 'Aucun événement XP',
      description: 'Vos gains d\'expérience apparaîtront ici une fois que vous commencerez à apprendre.',
      ctaLabel: 'Commencer maintenant',
      ctaHref: '/programmes'
    };
    
    return (
      <div ref={ref} className="bg-surface rounded-lg border border-border p-6">
        <EmptyState config={emptyStateConfig || defaultEmptyConfig} />
      </div>
    );
  }

  return (
    <div ref={ref} className="bg-surface rounded-lg border border-border">
      {/* Header avec stats */}
      {groups.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">
              Timeline XP
            </h3>
            <div className="text-sm text-text-secondary">
              {totalEventCount} événement{totalEventCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Contenu de la timeline */}
      <div className="p-6">
        {isLoading && groups.length === 0 ? (
          <TimelineSkeleton />
        ) : (
          <div className="space-y-0" role="feed" aria-label="Timeline des gains XP">
            {groups.map((group, index) => (
              <TimelineGroup 
                key={`${group.period}-${index}`} 
                group={group} 
              />
            ))}
            
            {/* Loading more indicator */}
            {isLoading && groups.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <Icon name="Loader" size={24} className="animate-spin text-primary mr-3" />
                <span className="text-text-secondary">Chargement...</span>
              </div>
            )}
            
            {/* Sentinel pour pagination infinie */}
            {hasMore && !isLoading && (
              <div ref={sentinelRef} className="h-4" />
            )}
            
            {/* End indicator */}
            {!hasMore && groups.length > 0 && (
              <div className="text-center py-6 text-sm text-text-secondary border-t border-border mt-8">
                <Icon name="CheckCircle" size={16} className="inline mr-2" />
                Tous les événements ont été chargés
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;