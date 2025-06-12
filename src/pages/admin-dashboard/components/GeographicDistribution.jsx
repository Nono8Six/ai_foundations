import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GeographicDistribution = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const geographicData = [
    {
      country: 'France',
      users: 4567,
      percentage: 35.5,
      growth: '+12.3%',
      flag: '🇫🇷',
      regions: [
        { name: 'Île-de-France', users: 1234, percentage: 27.0 },
        { name: 'Auvergne-Rhône-Alpes', users: 876, percentage: 19.2 },
        { name: "Provence-Alpes-Côte d'Azur", users: 654, percentage: 14.3 },
        { name: 'Nouvelle-Aquitaine', users: 543, percentage: 11.9 },
      ],
    },
    {
      country: 'Canada',
      users: 2134,
      percentage: 16.6,
      growth: '+8.7%',
      flag: '🇨🇦',
      regions: [
        { name: 'Québec', users: 987, percentage: 46.2 },
        { name: 'Ontario', users: 654, percentage: 30.7 },
        { name: 'Colombie-Britannique', users: 321, percentage: 15.0 },
        { name: 'Alberta', users: 172, percentage: 8.1 },
      ],
    },
    {
      country: 'Belgique',
      users: 1876,
      percentage: 14.6,
      growth: '+15.2%',
      flag: '🇧🇪',
      regions: [
        { name: 'Bruxelles', users: 567, percentage: 30.2 },
        { name: 'Flandre', users: 654, percentage: 34.9 },
        { name: 'Wallonie', users: 655, percentage: 34.9 },
      ],
    },
    {
      country: 'Suisse',
      users: 1543,
      percentage: 12.0,
      growth: '+6.8%',
      flag: '🇨🇭',
      regions: [
        { name: 'Genève', users: 432, percentage: 28.0 },
        { name: 'Zurich', users: 543, percentage: 35.2 },
        { name: 'Berne', users: 321, percentage: 20.8 },
        { name: 'Lausanne', users: 247, percentage: 16.0 },
      ],
    },
    {
      country: 'Maroc',
      users: 1234,
      percentage: 9.6,
      growth: '+22.1%',
      flag: '🇲🇦',
      regions: [
        { name: 'Casablanca', users: 456, percentage: 37.0 },
        { name: 'Rabat', users: 321, percentage: 26.0 },
        { name: 'Marrakech', users: 287, percentage: 23.2 },
        { name: 'Fès', users: 170, percentage: 13.8 },
      ],
    },
    {
      country: 'Autres',
      users: 1493,
      percentage: 11.6,
      growth: '+18.9%',
      flag: '🌍',
      regions: [],
    },
  ];

  const totalUsers = geographicData.reduce((acc, country) => acc + country.users, 0);

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Distribution géographique</h3>
          <p className='text-sm text-text-secondary'>Répartition des utilisateurs par pays</p>
        </div>
        <div className='flex items-center space-x-2'>
          <button className='px-3 py-1 text-xs font-medium text-text-secondary border border-border rounded-md hover:bg-secondary-50 transition-colors'>
            Exporter
          </button>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon name='RefreshCw' size={16} className='text-text-secondary' />
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        {geographicData.map((country, index) => (
          <div
            key={index}
            className='border border-border rounded-lg p-4 hover:bg-secondary-50 transition-colors'
          >
            <div
              className='flex items-center justify-between cursor-pointer'
              onClick={() => setSelectedRegion(selectedRegion === index ? null : index)}
            >
              <div className='flex items-center space-x-3'>
                <span className='text-2xl'>{country.flag}</span>
                <div>
                  <h4 className='font-medium text-text-primary'>{country.country}</h4>
                  <p className='text-sm text-text-secondary'>
                    {country.users.toLocaleString('fr-FR')} utilisateurs ({country.percentage}%)
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <span className='text-sm font-medium text-success'>{country.growth}</span>
                {country.regions.length > 0 && (
                  <Icon
                    name={selectedRegion === index ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    className='text-text-secondary'
                  />
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className='mt-3'>
              <div className='w-full bg-secondary-200 rounded-full h-2'>
                <div
                  className='bg-primary h-2 rounded-full transition-all duration-300'
                  style={{ width: `${country.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Regional breakdown */}
            {selectedRegion === index && country.regions.length > 0 && (
              <div className='mt-4 pl-4 border-l-2 border-primary-200'>
                <h5 className='text-sm font-medium text-text-primary mb-3'>
                  Répartition régionale
                </h5>
                <div className='space-y-2'>
                  {country.regions.map((region, regionIndex) => (
                    <div key={regionIndex} className='flex items-center justify-between'>
                      <span className='text-sm text-text-secondary'>{region.name}</span>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-text-primary'>
                          {region.users.toLocaleString('fr-FR')}
                        </span>
                        <span className='text-xs text-text-secondary'>({region.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-6 pt-4 border-t border-border'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-text-secondary'>Total utilisateurs</span>
          <span className='text-lg font-semibold text-text-primary'>
            {totalUsers.toLocaleString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;
