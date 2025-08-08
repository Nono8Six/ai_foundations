/**
 * ActivityItem - Composant réutilisable pour afficher un événement d'activité
 * 
 * Utilisé dans:
 * - /profile?tab=stats (timeline complète) 
 * - /espace (widget activité récente)
 * 
 * Affiche libellé humain, icône, badge XP, méta-info et timestamp relatif.
 * Possibilité d'afficher les détails JSON prettifiés en popover.
 */

import React, { useState } from 'react';
import Icon from '@shared/components/AppIcon';
import { FormattedActivity, prettifyDetails } from '@shared/utils/activityFormatter';

export interface ActivityItemProps {
  activity: FormattedActivity;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean; // Afficher bouton détails
  className?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  size = 'md',
  showDetails = false,
  className = ''
}) => {
  const [showDetailsPopover, setShowDetailsPopover] = useState(false);
  
  const sizeClasses = {
    sm: {
      container: 'py-2 px-3',
      icon: 'w-6 h-6',
      iconSize: 14,
      text: 'text-sm',
      meta: 'text-xs',
      xpBadge: 'text-xs px-1.5 py-0.5'
    },
    md: {
      container: 'py-3 px-4', 
      icon: 'w-8 h-8',
      iconSize: 16,
      text: 'text-sm',
      meta: 'text-xs',
      xpBadge: 'text-xs px-2 py-1'
    },
    lg: {
      container: 'py-4 px-5',
      icon: 'w-10 h-10', 
      iconSize: 20,
      text: 'text-base',
      meta: 'text-sm',
      xpBadge: 'text-sm px-2.5 py-1'
    }
  };
  
  const classes = sizeClasses[size];
  
  return (
    <div className={`flex items-start space-x-3 ${classes.container} ${className}`}>
      {/* Icône avec couleur */}
      <div className={`${classes.icon} flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full`}>
        <Icon 
          name={activity.icon} 
          size={classes.iconSize} 
          className={activity.iconColor}
        />
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Label principal */}
            <p className={`font-medium text-text-primary ${classes.text}`}>
              {activity.label}
              {activity.isBackfilled && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                  Migré
                </span>
              )}
            </p>
            
            {/* Meta-information */}
            {activity.meta && (
              <p className={`text-text-secondary mt-0.5 ${classes.meta}`}>
                {activity.meta}
              </p>
            )}
          </div>
          
          {/* Badge XP */}
          {activity.xpDelta !== undefined && activity.xpDelta !== 0 && (
            <span 
              className={`ml-2 inline-flex items-center font-medium rounded-full ${classes.xpBadge} ${
                activity.xpDelta > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {activity.xpDelta > 0 ? '+' : ''}{activity.xpDelta} XP
            </span>
          )}
        </div>
        
        {/* Footer avec timestamp et bouton détails */}
        <div className="flex items-center justify-between mt-1">
          <span className={`text-text-secondary ${classes.meta}`}>
            {activity.timeAgo}
          </span>
          
          {showDetails && Object.keys(activity.rawDetails).length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowDetailsPopover(!showDetailsPopover)}
                className={`text-text-secondary hover:text-text-primary transition-colors ${classes.meta}`}
              >
                Détails
              </button>
              
              {/* Popover détails */}
              {showDetailsPopover && (
                <>
                  {/* Overlay */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDetailsPopover(false)}
                  />
                  
                  {/* Popover content */}
                  <div className="absolute right-0 top-6 z-20 w-80 bg-white border border-border rounded-lg shadow-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-text-primary">
                        Détails techniques
                      </h4>
                      <button
                        onClick={() => setShowDetailsPopover(false)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                    
                    <div className="text-xs text-text-secondary bg-gray-50 rounded p-2 font-mono whitespace-pre-line max-h-48 overflow-auto">
                      {prettifyDetails(activity.rawDetails)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;