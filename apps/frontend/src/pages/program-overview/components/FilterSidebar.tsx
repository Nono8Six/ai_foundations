import React from 'react';
import Icon from '@frontend/components/AppIcon';
import type { Course } from '@frontend/types/course';
import type { ProgramFilters } from '../index';

export interface FilterSidebarProps {
  filters: ProgramFilters;
  onFilterChange: (filters: ProgramFilters) => void;
  courses: Course[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, courses }) => {
  const skillLevels = ['Débutant', 'Intermédiaire', 'Avancé'];
  const durations = [
    { value: 'short', label: 'Court (≤ 3 semaines)' },
    { value: 'medium', label: 'Moyen (4-6 semaines)' },
    { value: 'long', label: 'Long (≥ 7 semaines)' },
  ];
  const categories = [...new Set(courses.map(course => course.category))];
  const statuses = [
    { value: 'enrolled', label: 'Inscrit' },
    { value: 'completed', label: 'Terminé' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'not-started', label: 'Non commencé' },
  ];

  const handleFilterToggle = (filterType: keyof ProgramFilters, value: string) => {
    const currentFilters = filters[filterType];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];

    onFilterChange({
      ...filters,
      [filterType]: newFilters,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      skillLevel: [],
      duration: [],
      category: [],
      status: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

  return (
    <div className='bg-surface rounded-xl shadow-subtle p-6 sticky top-24'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-text-primary'>Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className='text-sm text-primary hover:text-primary-700 transition-colors'
          >
            Effacer tout
          </button>
        )}
      </div>

      {/* Skill Level Filter */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
          <Icon aria-hidden='true' name='TrendingUp' size={16} />
          Niveau de difficulté
        </h4>
        <div className='space-y-2'>
          {skillLevels.map(level => (
            <label key={level} className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={filters.skillLevel.includes(level)}
                onChange={() => handleFilterToggle('skillLevel', level)}
                className='w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2'
              />
              <span className='text-sm text-text-secondary group-hover:text-text-primary transition-colors'>
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
          <Icon aria-hidden='true' name='Clock' size={16} />
          Durée
        </h4>
        <div className='space-y-2'>
          {durations.map(duration => (
            <label key={duration.value} className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={filters.duration.includes(duration.value)}
                onChange={() => handleFilterToggle('duration', duration.value)}
                className='w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2'
              />
              <span className='text-sm text-text-secondary group-hover:text-text-primary transition-colors'>
                {duration.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
          <Icon aria-hidden='true' name='FolderOpen' size={16} />
          Catégorie
        </h4>
        <div className='space-y-2'>
          {categories.map(category => (
            <label key={category} className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={filters.category.includes(category)}
                onChange={() => handleFilterToggle('category', category)}
                className='w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2'
              />
              <span className='text-sm text-text-secondary group-hover:text-text-primary transition-colors'>
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-text-primary mb-3 flex items-center gap-2'>
          <Icon aria-hidden='true' name='CheckCircle' size={16} />
          Statut
        </h4>
        <div className='space-y-2'>
          {statuses.map(status => (
            <label key={status.value} className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={filters.status.includes(status.value)}
                onChange={() => handleFilterToggle('status', status.value)}
                className='w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2'
              />
              <span className='text-sm text-text-secondary group-hover:text-text-primary transition-colors'>
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className='border-t border-border pt-6'>
        <h4 className='text-sm font-medium text-text-primary mb-3'>Statistiques</h4>
        <div className='space-y-2 text-sm text-text-secondary'>
          <div className='flex justify-between'>
            <span>Total des cours</span>
            <span className='font-medium'>{courses.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
