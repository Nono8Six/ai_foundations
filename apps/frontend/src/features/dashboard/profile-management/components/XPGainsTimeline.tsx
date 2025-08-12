/**
 * XPGainsTimeline - Timeline moderne des gains XP
 * 
 * Composant moderne pour afficher les gains XP récents
 * avec des visuels attrayants et animations fluides
 */

import React from 'react';
import Icon from '@shared/components/AppIcon';

interface XPGain {
  id: string;
  source: string;
  amount: number;
  date: string;
  description: string;
  icon: string;
  color: string;
}

interface XPGainsTimelineProps {
  gains: XPGain[];
  isLoading?: boolean;
  className?: string;
}

const XPGainsTimeline: React.FC<XPGainsTimelineProps> = ({
  gains,
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-gray-300 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
            <div className="h-6 bg-gray-300 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (gains.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
        <p>Aucun gain XP récent</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {gains.map((gain, index) => (
        <div
          key={gain.id}
          className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          {/* Icône */}
          <div className={`w-10 h-10 rounded-lg ${gain.color} flex items-center justify-center`}>
            <Icon name={gain.icon} size={18} className="text-white" />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">
              {gain.description}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(gain.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Badge XP */}
          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-semibold">
            <Icon name="Plus" size={12} />
            <span>{gain.amount}</span>
            <span className="text-xs">XP</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default XPGainsTimeline;