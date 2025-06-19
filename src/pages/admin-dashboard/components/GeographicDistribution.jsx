import React from 'react';
import Icon from '../../../components/AppIcon';

const GeographicDistribution = () => {
  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Distribution géographique</h3>
          <p className='text-sm text-text-secondary'>Répartition des utilisateurs par pays</p>
        </div>
        {/* Optional: Keep export/refresh if they might be used later, or remove */}
        {/* <div className='flex items-center space-x-2'>
          <button className='px-3 py-1 text-xs font-medium text-text-secondary border border-border rounded-md hover:bg-secondary-50 transition-colors'>
            Exporter
          </button>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon name='RefreshCw' size={16} className='text-text-secondary' />
          </button>
        </div> */}
      </div>

      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <Icon name='MapPinOff' size={48} className='text-secondary-400 mb-4' />
        <p className='text-md font-medium text-text-primary mb-1'>
          Les données de distribution géographique ne sont pas actuellement disponibles.
        </p>
        <p className='text-sm text-text-secondary'>
          Pour activer cette fonctionnalité, des informations de localisation des utilisateurs seraient nécessaires.
        </p>
      </div>

      {/* Footer showing total users can be removed or also show N/A */}
       <div className='mt-6 pt-4 border-t border-border'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-text-secondary'>Total utilisateurs (géographique)</span>
          <span className='text-lg font-semibold text-text-primary'>
            N/A
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;
