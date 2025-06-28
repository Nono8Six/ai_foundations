import React from 'react';
import Icon from '@frontend/components/AppIcon';

interface UserFiltersProps {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const UserFilters = ({ filters, setFilters }: UserFiltersProps) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
      registrationDate: 'all',
      activityLevel: 'all',
      courseProgress: 'all',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <div className='space-y-4'>
      {/* Filter Row */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        {/* Status Filter */}
        <div>
          <label className='block text-xs font-medium text-text-secondary mb-1'>Statut</label>
          <select
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value='all'>Tous les statuts</option>
            <option value='active'>Actif</option>
            <option value='inactive'>Inactif</option>
            <option value='pending'>En attente</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className='block text-xs font-medium text-text-secondary mb-1'>Rôle</label>
          <select
            value={filters.role}
            onChange={e => handleFilterChange('role', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value='all'>Tous les rôles</option>
            <option value='student'>Étudiant</option>
            <option value='admin'>Administrateur</option>
          </select>
        </div>

        {/* Registration Date Filter */}
        <div>
          <label className='block text-xs font-medium text-text-secondary mb-1'>Inscription</label>
          <select
            value={filters.registrationDate}
            onChange={e => handleFilterChange('registrationDate', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value='all'>Toutes les dates</option>
            <option value='today'>Aujourd'hui</option>
            <option value='week'>Cette semaine</option>
            <option value='month'>Ce mois</option>
            <option value='quarter'>Ce trimestre</option>
            <option value='year'>Cette année</option>
          </select>
        </div>

        {/* Activity Level Filter */}
        <div>
          <label className='block text-xs font-medium text-text-secondary mb-1'>Activité</label>
          <select
            value={filters.activityLevel}
            onChange={e => handleFilterChange('activityLevel', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value='all'>Tous les niveaux</option>
            <option value='high'>Très actif</option>
            <option value='medium'>Modérément actif</option>
            <option value='low'>Peu actif</option>
            <option value='dormant'>Inactif</option>
          </select>
        </div>

        {/* Course Progress Filter */}
        <div>
          <label className='block text-xs font-medium text-text-secondary mb-1'>Progression</label>
          <select
            value={filters.courseProgress}
            onChange={e => handleFilterChange('courseProgress', e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value='all'>Toutes progressions</option>
            <option value='0-25'>0-25%</option>
            <option value='26-50'>26-50%</option>
            <option value='51-75'>51-75%</option>
            <option value='76-100'>76-100%</option>
            <option value='completed'>Terminé (100%)</option>
          </select>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {hasActiveFilters && (
        <div className='flex items-center justify-between pt-2 border-t border-border'>
          <div className='flex items-center space-x-2'>
            <Icon aria-hidden='true' name='Filter' size={16} className='text-text-secondary' />
            <span className='text-sm text-text-secondary'>Filtres actifs:</span>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(filters).map(([key, value]) => {
                if (value === 'all') return null;

                const filterLabels = {
                  status: { active: 'Actif', inactive: 'Inactif', pending: 'En attente' },
                  role: { student: 'Étudiant', admin: 'Admin' },
                  registrationDate: {
                    today: "Aujourd'hui",
                    week: 'Cette semaine',
                    month: 'Ce mois',
                    quarter: 'Ce trimestre',
                    year: 'Cette année',
                  },
                  activityLevel: {
                    high: 'Très actif',
                    medium: 'Modéré',
                    low: 'Peu actif',
                    dormant: 'Inactif',
                  },
                  courseProgress: {
                    '0-25': '0-25%',
                    '26-50': '26-50%',
                    '51-75': '51-75%',
                    '76-100': '76-100%',
                    completed: 'Terminé',
                  },
                };

                const label = filterLabels[key]?.[value] || value;

                return (
                  <span
                    key={key}
                    className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'
                  >
                    {label}
                    <button
                      onClick={() => handleFilterChange(key, 'all')}
                      className='ml-1 hover:text-primary-900 transition-colors'
                    >
                      <Icon name='X' size={12} aria-label='Supprimer filtre' />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <button
            onClick={clearAllFilters}
            className='inline-flex items-center px-3 py-1 text-sm text-text-secondary hover:text-primary transition-colors'
          >
            <Icon aria-hidden='true' name='X' size={14} className='mr-1' />
            Effacer tout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
