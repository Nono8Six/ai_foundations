/**
 * Micro Insights - Micro-insights des statistiques XP
 * 
 * Composant qui affiche les insights calculés depuis les vraies données :
 * - Total XP sur la période sélectionnée
 * - Top 3 des sources d'XP avec chips colorés
 * - Évolution récente (optionnel)
 * - N'affiche QUE si les données sont calculables (pas de placeholders)
 */

import React from 'react';
import Icon from '@shared/components/AppIcon';
import type { XPAggregates } from '@shared/services/xpService';

interface MicroInsightsProps {
  aggregates: XPAggregates;
  period: '30d' | '90d' | '12m' | 'all';
  isLoading?: boolean;
}

/**
 * Formatage des noms de sources pour l'affichage
 */
function formatSourceName(source: string): string {
  const sourceMap: Record<string, string> = {
    'profile:completion': 'Profil',
    'lesson:completed': 'Leçon',
    'quiz:passed': 'Quiz',
    'course:completed': 'Cours',
    'achievement:unlocked': 'Accomplissement',
    'streak:milestone': 'Série'
  };
  return sourceMap[source] || source.split(':')[0] || source;
}

/**
 * Couleurs pour les chips de sources
 */
const SOURCE_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
];

/**
 * Formatage du label de période
 */
function getPeriodLabel(period: string): string {
  switch (period) {
    case '30d': return '30 derniers jours';
    case '90d': return '90 derniers jours';
    case '12m': return '12 derniers mois';
    case 'all': return 'Tout';
    default: return 'Période sélectionnée';
  }
}

/**
 * Composant de loading
 */
const InsightsLoading: React.FC = () => (
  <div className="bg-surface rounded-lg border border-border p-6">
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

const MicroInsights: React.FC<MicroInsightsProps> = ({ 
  aggregates, 
  period, 
  isLoading = false 
}) => {
  // Loading state
  if (isLoading) {
    return <InsightsLoading />;
  }

  const { totalXpOnPeriod, topSources } = aggregates;
  const periodLabel = getPeriodLabel(period);

  // Ne pas afficher si pas de données significatives
  if (totalXpOnPeriod === 0 && topSources.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-accent" />
          <h3 className="text-base font-semibold text-text-primary">
            Insights
          </h3>
        </div>
        <div className="text-xs text-text-secondary bg-secondary-100 px-2 py-1 rounded">
          {periodLabel}
        </div>
      </div>

      {/* Total XP sur la période */}
      {totalXpOnPeriod > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Zap" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {totalXpOnPeriod} XP
              </div>
              <div className="text-sm text-text-secondary">
                {period === 'all' ? 'Total historique' : `Gagnés en ${periodLabel.toLowerCase()}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top sources */}
      {topSources.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
            <Icon name="Target" size={14} className="mr-2 text-accent" />
            Sources principales
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {topSources.slice(0, 3).map((source, index) => {
              const colors = SOURCE_COLORS[index] || SOURCE_COLORS[0] || { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700' };
              return (
                <div
                  key={source.source}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-full border
                    ${colors?.bg || 'bg-gray-100'} ${colors?.border || 'border-gray-200'}
                  `}
                >
                  <span className={`text-sm font-medium ${colors?.text || 'text-gray-700'}`}>
                    {formatSourceName(source.source)}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {/* Nombre d'événements */}
                    <span className={`text-xs ${colors?.text || 'text-gray-700'} opacity-75`}>
                      ×{source.count}
                    </span>
                    
                    {/* Total XP */}
                    <div className="w-px h-3 bg-current opacity-30" />
                    <span className={`text-xs font-bold ${colors?.text || 'text-gray-700'}`}>
                      {source.totalXp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Résumé rapide */}
          {topSources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {topSources.length} source{topSources.length !== 1 ? 's' : ''} d'XP
                </span>
                <div className="flex items-center space-x-1 text-accent">
                  <Icon name="Activity" size={12} />
                  <span className="text-xs">
                    {topSources.reduce((sum, s) => sum + s.count, 0)} événements
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MicroInsights;