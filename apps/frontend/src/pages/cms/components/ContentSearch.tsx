import React from 'react';
import Icon from '../../../components/AppIcon';

const ContentSearch = ({ searchQuery, onSearchChange, onCreateNew }) => {
  return (
    <div className='space-y-3'>
      {/* Search Input */}
      <div className='relative'>
        <Icon
          name='Search'
          size={20}
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400'
        />
        <input
          type='text'
          placeholder='Rechercher du contenu...'
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary'
          >
            <Icon name='X' size={16} />
          </button>
        )}
      </div>

      {/* Create New Button */}
      <button
        onClick={onCreateNew}
        className='w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center font-medium'
      >
        <Icon name='Plus' size={20} className='mr-2' />
        Nouveau contenu
      </button>

      {/* Quick Filters */}
      <div className='flex space-x-2'>
        <button className='px-3 py-1 text-xs bg-primary-50 text-primary rounded-full hover:bg-primary-100 transition-colors duration-200'>
          Tous
        </button>
        <button className='px-3 py-1 text-xs bg-secondary-100 text-text-secondary rounded-full hover:bg-secondary-200 transition-colors duration-200'>
          Publiés
        </button>
        <button className='px-3 py-1 text-xs bg-secondary-100 text-text-secondary rounded-full hover:bg-secondary-200 transition-colors duration-200'>
          Brouillons
        </button>
      </div>
    </div>
  );
};

export default ContentSearch;
