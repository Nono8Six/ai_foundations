/**
 * ActivityFilters - Barre de filtres pour la timeline d'activité
 * 
 * Permet de filtrer par:
 * - Période (30j, 90j, 12m, Tout)
 * - Type d'activité (profil, leçon, cours, etc.)
 * - Activités avec XP uniquement
 * - Tri (récent/ancien)
 */

import React, { useMemo } from 'react';
import Icon from '@shared/components/AppIcon';
import { ActivityFilters } from '@shared/services/activityService';

export interface ActivityFiltersProps {
  filters: ActivityFilters;
  availableTypes: string[];
  onFiltersChange: (filters: ActivityFilters) => void;
  isLoading?: boolean;
  className?: string;
}

const PERIOD_OPTIONS = [
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
  { value: '12m', label: '12 mois' },
  { value: 'all', label: 'Tout' }
] as const;

const TYPE_LABELS: Record<string, string> = {
  'profile': 'Profil',
  'lesson': 'Leçons',
  'course': 'Cours',
  'quiz': 'Quiz',
  'achievement': 'Badges',
  'streak': 'Séries',
  'system': 'Système'
};

const ActivityFiltersComponent: React.FC<ActivityFiltersProps> = ({
  filters,
  availableTypes,
  onFiltersChange,
  isLoading = false,
  className = ''
}) => {
  const typeOptions = useMemo(() => {
    return availableTypes.map(type => ({
      value: type,
      label: TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1)
    }));
  }, [availableTypes]);

  const selectedTypes = filters.types || [];

  const handlePeriodChange = (period: ActivityFilters['period']) => {
    onFiltersChange({ ...filters, period });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    onFiltersChange({
      ...filters,
      types: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleXPToggle = () => {
    onFiltersChange({
      ...filters,
      hasXP: filters.hasXP ? undefined : true
    });
  };

  const handleSortToggle = () => {
    onFiltersChange({
      ...filters,
      sortBy: filters.sortBy === 'oldest' ? 'recent' : 'oldest'
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      period: '90d',
      sortBy: 'recent'
    });
  };

  const hasActiveFilters = !!(
    filters.types?.length ||
    filters.hasXP ||
    filters.period !== '90d' ||
    filters.sortBy !== 'recent'
  );

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 space-y-4 ${className}`}>
      {/* Header avec titre et clear */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary flex items-center">
          <Icon name="Filter" size={16} className="mr-2 text-accent" />
          Filtres
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isLoading}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filtres principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Période */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Période
          </label>
          <div className="grid grid-cols-2 gap-1">
            {PERIOD_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handlePeriodChange(option.value)}
                disabled={isLoading}
                className={`px-3 py-1.5 text-xs rounded transition-colors disabled:opacity-50 ${
                  filters.period === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Types d'activité */}
        {typeOptions.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Types d'activité
            </label>
            <div className="flex flex-wrap gap-1">
              {typeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleTypeToggle(option.value)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs rounded transition-colors disabled:opacity-50 ${
                    selectedTypes.includes(option.value)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options avancées */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Options
          </label>
          <div className="space-y-2">
            {/* XP uniquement */}
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={filters.hasXP || false}
                onChange={handleXPToggle}
                disabled={isLoading}
                className="mr-2 h-3 w-3 text-primary focus:ring-primary border-gray-300 rounded disabled:opacity-50"
              />
              XP uniquement
            </label>

            {/* Tri */}
            <button
              onClick={handleSortToggle}
              disabled={isLoading}
              className="flex items-center text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            >
              <Icon 
                name={filters.sortBy === 'oldest' ? 'ArrowUp' : 'ArrowDown'} 
                size={12} 
                className="mr-1" 
              />
              {filters.sortBy === 'oldest' ? 'Plus anciens' : 'Plus récents'}
            </button>
          </div>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Icon name="Loader" size={16} className="animate-spin text-accent mr-2" />
          <span className="text-xs text-text-secondary">Application des filtres...</span>
        </div>
      )}
    </div>
  );
};

export default ActivityFiltersComponent;