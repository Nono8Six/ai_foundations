import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressChart = ({ weeklyData = [], monthlyData = [], subjectData = [] }) => {
  const [activeTab, setActiveTab] = useState('weekly');

  const getCurrentData = () => (activeTab === 'weekly' ? weeklyData : monthlyData);
  const getXAxisKey = () => (activeTab === 'weekly' ? 'day' : 'month');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-surface border border-border rounded-lg p-3 shadow-medium'>
          <p className='font-medium text-text-primary mb-2'>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className='text-sm' style={{ color: entry.color }}>
              {entry.dataKey === 'hours' && `Heures: ${entry.value}h`}
              {entry.dataKey === 'lessons' && `Leçons: ${entry.value}`}
              {entry.dataKey === 'xp' && `XP: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'weekly', label: 'Cette semaine', icon: 'Calendar' },
    { id: 'monthly', label: 'Ces 6 mois', icon: 'TrendingUp' },
  ];

  if (!weeklyData.length && !monthlyData.length) {
    return (
      <div className='bg-surface rounded-xl border border-border p-6'>
        <p className='text-sm text-text-secondary'>Aucune donnée de progression.</p>
      </div>
    );
  }

  return (
    <div className='bg-surface rounded-xl border border-border p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-text-primary mb-4 sm:mb-0'>
          Progression d\'apprentissage
        </h2>
        <div className='flex bg-secondary-100 rounded-lg p-1'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='w-full h-60'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={getCurrentData()} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey={getXAxisKey()} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type='monotone' dataKey='hours' stroke='#3b82f6' strokeWidth={2} dot={false} />
            <Line type='monotone' dataKey='lessons' stroke='#10b981' strokeWidth={2} dot={false} />
            <Line type='monotone' dataKey='xp' stroke='#f59e0b' strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {subjectData.length > 0 && (
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='h-48'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={subjectData} layout='vertical'>
                <XAxis type='number' hide />
                <YAxis
                  type='category'
                  dataKey='name'
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={100}
                />
                <Bar dataKey='value'>
                  {subjectData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='h-48'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={subjectData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={60}
                  label
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
