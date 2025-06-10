import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PopularCoursesChart = () => {
  const coursesData = [
    {
      name: "Introduction à l\'IA",
      enrollments: 2847,
      completions: 2234,
      rating: 4.8,
    },
    {
      name: 'Machine Learning',
      enrollments: 2156,
      completions: 1678,
      rating: 4.7,
    },
    {
      name: 'Deep Learning',
      enrollments: 1923,
      completions: 1456,
      rating: 4.9,
    },
    {
      name: 'NLP Avancé',
      enrollments: 1654,
      completions: 1234,
      rating: 4.6,
    },
    {
      name: 'Computer Vision',
      enrollments: 1432,
      completions: 1098,
      rating: 4.5,
    },
    {
      name: 'IA Éthique',
      enrollments: 1287,
      completions: 987,
      rating: 4.4,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-surface p-3 border border-border rounded-lg shadow-medium'>
          <p className='text-sm font-medium text-text-primary mb-2'>{label}</p>
          <div className='space-y-1'>
            <p className='text-sm text-primary'>
              Inscriptions: {data.enrollments.toLocaleString('fr-FR')}
            </p>
            <p className='text-sm text-accent'>
              Complétions: {data.completions.toLocaleString('fr-FR')}
            </p>
            <p className='text-sm text-warning'>Note: {data.rating}/5</p>
            <p className='text-xs text-text-secondary'>
              Taux: {Math.round((data.completions / data.enrollments) * 100)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Cours populaires</h3>
          <p className='text-sm text-text-secondary'>Inscriptions et taux de completion</p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-primary rounded-full'></div>
            <span className='text-xs text-text-secondary'>Inscriptions</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-accent rounded-full'></div>
            <span className='text-xs text-text-secondary'>Complétions</span>
          </div>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon name='MoreVertical' size={16} className='text-text-secondary' />
          </button>
        </div>
      </div>

      <div className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={coursesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis
              dataKey='name'
              stroke='var(--color-text-secondary)'
              fontSize={11}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis
              stroke='var(--color-text-secondary)'
              fontSize={12}
              tickFormatter={value => value.toLocaleString('fr-FR')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey='enrollments'
              fill='var(--color-primary)'
              radius={[2, 2, 0, 0]}
              name='Inscriptions'
            />
            <Bar
              dataKey='completions'
              fill='var(--color-accent)'
              radius={[2, 2, 0, 0]}
              name='Complétions'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-4 grid grid-cols-3 gap-4'>
        <div className='text-center p-3 bg-primary-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Total inscriptions</p>
          <p className='text-lg font-semibold text-primary'>
            {coursesData
              .reduce((acc, course) => acc + course.enrollments, 0)
              .toLocaleString('fr-FR')}
          </p>
        </div>
        <div className='text-center p-3 bg-accent-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Total complétions</p>
          <p className='text-lg font-semibold text-accent'>
            {coursesData
              .reduce((acc, course) => acc + course.completions, 0)
              .toLocaleString('fr-FR')}
          </p>
        </div>
        <div className='text-center p-3 bg-warning-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Note moyenne</p>
          <p className='text-lg font-semibold text-warning'>
            {(
              coursesData.reduce((acc, course) => acc + course.rating, 0) / coursesData.length
            ).toFixed(1)}
            /5
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularCoursesChart;
