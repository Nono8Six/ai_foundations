/**
 * Filters Bar - Barre de filtres pour la timeline XP
 * 
 * Composant compact et sticky qui permet de filtrer la timeline XP :
 * - Sélection de période (30j, 90j, 12m, All)
 * - Multi-select des sources (si disponibles)
 * - Tri par date (récents → anciens ou anciens → récents)
 * - Design responsive et accessible
 */

import React, { useState } from 'react';
import Icon from '@shared/components/AppIcon';
import type { XPFilters } from '@shared/services/xpService';

interface FiltersBarProps {
  filters: XPFilters;
  availableSources: string[];
  onFiltersChange: (filters: XPFilters) => void;
  isLoading?: boolean;
}

const PERIOD_OPTIONS = [
  { value: '30d' as const, label: '30 jours', shortLabel: '30j' },
  { value: '90d' as const, label: '90 jours', shortLabel: '90j' },
  { value: '12m' as const, label: '12 mois', shortLabel: '12m' },
  { value: 'all' as const, label: 'Tout', shortLabel: 'Tout' }
];

const SORT_OPTIONS = [
  { value: 'recent' as const, label: 'Plus récents', icon: 'ArrowDown' },
  { value: 'oldest' as const, label: 'Plus anciens', icon: 'ArrowUp' }
];

/**
 * Formatage des noms de sources pour l'affichage
 */
function formatSourceName(source: string): string {
  // Transforme "profile:completion" → "Profil"
  // Transforme "lesson:completed" → "Leçon"
  // etc.
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

const FiltersBar: React.FC<FiltersBarProps> = ({ 
  filters, 
  availableSources, 
  onFiltersChange,
  isLoading = false 
}) => {
  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false);

  const handlePeriodChange = (period: XPFilters['period']) => {
    onFiltersChange({ ...filters, period });
  };

  const handleSortChange = (sortBy: XPFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleSourceToggle = (source: string) => {
    const currentSources = filters.source || [];
    const newSources = currentSources.includes(source)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source];
    
    onFiltersChange({ 
      ...filters, 
      source: newSources.length === 0 ? undefined : newSources 
    });
  };

  const clearSources = () => {
    onFiltersChange({ ...filters, source: undefined });
  };

  const selectedSourceCount = filters.source?.length || 0;
  const hasSourceFilter = selectedSourceCount > 0;

  return (
    <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-border p-4 space-y-4 md:space-y-0 md:space-x-6 md:flex md:items-center md:justify-between">
      {/* Section gauche : Filtres principaux */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Sélecteur de période */}
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-text-secondary" />
          <div className="flex bg-secondary-100 rounded-lg p-1">
            {PERIOD_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handlePeriodChange(option.value)}
                disabled={isLoading}
                className={`
                  px-3 py-1 text-sm font-medium rounded-md transition-all duration-200
                  ${filters.period === option.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-200'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de sources (si des sources sont disponibles) */}
        {availableSources.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
              disabled={isLoading}
              className={`
                flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                ${hasSourceFilter 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-background text-text-secondary hover:text-text-primary hover:border-secondary-300'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon name="Filter" size={14} />
              <span>
                Sources {hasSourceFilter && `(${selectedSourceCount})`}
              </span>
              <Icon 
                name={showSourcesDropdown ? "ChevronUp" : "ChevronDown"} 
                size={14} 
              />
            </button>

            {/* Dropdown des sources */}
            {showSourcesDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg py-2 z-20">
                <div className="px-3 py-2 text-xs text-text-secondary border-b border-border flex items-center justify-between">
                  <span>Filtrer par source</span>
                  {hasSourceFilter && (
                    <button
                      onClick={clearSources}
                      className="text-primary hover:text-primary-700 font-medium"
                    >
                      Effacer
                    </button>
                  )}
                </div>
                
                <div className="max-h-48 overflow-y-auto">
                  {availableSources.map(source => {
                    const isSelected = filters.source?.includes(source) || false;
                    return (
                      <button
                        key={source}
                        onClick={() => handleSourceToggle(source)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 flex items-center space-x-2"
                      >
                        <div className={`
                          w-4 h-4 rounded border-2 flex items-center justify-center
                          ${isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-secondary-300'
                          }
                        `}>
                          {isSelected && (
                            <Icon name="Check" size={12} className="text-white" />
                          )}
                        </div>
                        <span className={isSelected ? 'font-medium text-text-primary' : 'text-text-secondary'}>
                          {formatSourceName(source)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section droite : Tri */}
      <div className="flex items-center space-x-2">
        <Icon name="ArrowUpDown" size={16} className="text-text-secondary" />
        <div className="flex bg-secondary-100 rounded-lg p-1">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              disabled={isLoading}
              className={`
                flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-md transition-all
                ${filters.sortBy === option.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-200'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon name={option.icon} size={14} />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay pour fermer le dropdown */}
      {showSourcesDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowSourcesDropdown(false)}
        />
      )}
    </div>
  );
};

export default FiltersBar;