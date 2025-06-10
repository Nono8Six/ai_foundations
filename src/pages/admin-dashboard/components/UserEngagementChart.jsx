import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import Icon from '../../../components/AppIcon';

const UserEngagementChart = ({ timeRange }) => {
  const data = {
    '24h': [
      { time: '00:00', users: 120, sessions: 89 },
      { time: '04:00', users: 45, sessions: 32 },
      { time: '08:00', users: 890, sessions: 654 },
      { time: '12:00', users: 1240, sessions: 987 },
      { time: '16:00', users: 1560, sessions: 1234 },
      { time: '20:00', users: 980, sessions: 756 },
      { time: '23:59', users: 340, sessions: 234 },
    ],
    '7d': [
      { time: 'Lun', users: 2400, sessions: 1890 },
      { time: 'Mar', users: 2210, sessions: 1756 },
      { time: 'Mer', users: 2890, sessions: 2234 },
      { time: 'Jeu', users: 3200, sessions: 2567 },
      { time: 'Ven', users: 3100, sessions: 2456 },
      { time: 'Sam', users: 2100, sessions: 1678 },
      { time: 'Dim', users: 1800, sessions: 1456 },
    ],
    '30d': [
      { time: 'Sem 1', users: 18400, sessions: 14567 },
      { time: 'Sem 2', users: 19200, sessions: 15234 },
      { time: 'Sem 3', users: 21100, sessions: 16789 },
      { time: 'Sem 4', users: 22800, sessions: 18234 },
    ],
    '90d': [
      { time: 'Jan', users: 65400, sessions: 52340 },
      { time: 'Fév', users: 71200, sessions: 56780 },
      { time: 'Mar', users: 78900, sessions: 62450 },
    ],
  };

  const currentData = data[timeRange] || data['7d'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-surface p-3 border border-border rounded-lg shadow-medium'>
          <p className='text-sm font-medium text-text-primary mb-2'>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className='text-sm' style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString('fr-FR')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Engagement utilisateurs</h3>
          <p className='text-sm text-text-secondary'>Utilisateurs actifs et sessions</p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-primary rounded-full'></div>
            <span className='text-xs text-text-secondary'>Utilisateurs</span>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-accent rounded-full'></div>
            <span className='text-xs text-text-secondary'>Sessions</span>
          </div>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon name='Download' size={16} className='text-text-secondary' />
          </button>
        </div>
      </div>

      <div className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={currentData}>
            <defs>
              <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-primary)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='var(--color-primary)' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorSessions' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-accent)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='var(--color-accent)' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis dataKey='time' stroke='var(--color-text-secondary)' fontSize={12} />
            <YAxis
              stroke='var(--color-text-secondary)'
              fontSize={12}
              tickFormatter={value => value.toLocaleString('fr-FR')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type='monotone'
              dataKey='users'
              stroke='var(--color-primary)'
              fillOpacity={1}
              fill='url(#colorUsers)'
              strokeWidth={2}
              name='Utilisateurs'
            />
            <Area
              type='monotone'
              dataKey='sessions'
              stroke='var(--color-accent)'
              fillOpacity={1}
              fill='url(#colorSessions)'
              strokeWidth={2}
              name='Sessions'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-4'>
        <div className='text-center p-3 bg-primary-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Pic d'activité</p>
          <p className='text-lg font-semibold text-primary'>
            {Math.max(...currentData.map(d => d.users)).toLocaleString('fr-FR')}
          </p>
        </div>
        <div className='text-center p-3 bg-accent-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Sessions moyennes</p>
          <p className='text-lg font-semibold text-accent'>
            {Math.round(
              currentData.reduce((acc, d) => acc + d.sessions, 0) / currentData.length
            ).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementChart;
