// src/pages/user-dashboard/components/ProgressChart.jsx
import React, { useState, useEffect } from 'react';
import { colors } from '@frontend/utils/theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCourses } from '@frontend/context/CourseContext';
import useProgressChartData from '@frontend/hooks/useProgressChartData';
import Icon from '@frontend/components/AppIcon';

interface WeeklyData {
  day: string;
  lessons: number;
  hours: number;
  xp: number;
}

interface MonthlyData {
  month: string;
  lessons: number;
  hours: number;
  xp: number;
}

const ProgressChart = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  // On choisit la version de la branche "main", qui est la plus à jour
  const { userProgress, lessons, courses, modules, isLoading } = useCourses();

  // On passe les données brutes au hook qui se charge des calculs
  const chartData = useProgressChartData(userProgress, lessons, courses, modules);

  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // On s'assure que le useEffect utilise la bonne variable "isLoading"
    if (
      !isLoading &&
      chartData &&
      (chartData.weekly?.length > 0 || chartData.monthly?.length > 0)
    ) {
      setHasData(true);
    } else if (!isLoading) {
      setHasData(false);
    }
  }, [chartData, isLoading]);

  const getCurrentData = () =>
    activeTab === 'weekly' ? chartData.weekly || [] : chartData.monthly || [];
  const getXAxisKey = () => (activeTab === 'weekly' ? 'day' : 'month');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-surface border border-border rounded-lg p-3 shadow-medium'>
          <p className='font-medium text-text-primary mb-2'>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className='text-sm' style={{ color: entry.color }}>
              {entry.dataKey === 'hours' && `Heures: ${entry.value.toFixed(1)}h`}
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
    { id: 'weekly', label: 'Cette semaine', icon: 'CalendarDays' },
    { id: 'monthly', label: 'Ces 6 mois', icon: 'TrendingUp' },
  ];

  if (isLoading) {
    return (
      <div className='bg-surface rounded-xl border border-border p-6 text-center'>
        <Icon
          aria-hidden='true'
          name='Loader'
          size={32}
          className='mx-auto animate-spin text-primary mb-4'
        />
        <p className='text-text-secondary'>Chargement des données de progression...</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className='bg-surface rounded-xl border border-border p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-text-primary mb-4 sm:mb-0'>
            Progression d'apprentissage
          </h2>
        </div>

        <div className='text-center py-8'>
          <Icon
            aria-hidden='true'
            name='BarChart3'
            size={48}
            className='mx-auto text-secondary-300 mb-4'
          />
          <h3 className='text-lg font-medium text-text-primary mb-2'>
            Aucune donnée de progression disponible
          </h3>
          <p className='text-text-secondary mb-4'>
            Commencez à apprendre pour voir votre progression ici.
          </p>
        </div>
      </div>
    );
  }

  const currentDataSet = getCurrentData();
  const totalHours = currentDataSet.reduce((acc, item) => acc + (item.hours || 0), 0).toFixed(1);
  const totalLessons = currentDataSet.reduce((acc, item) => acc + (item.lessons || 0), 0);
  const totalXP = currentDataSet.reduce((acc, item) => acc + (item.xp || 0), 0);

  return (
    <div className='bg-surface rounded-xl border border-border p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-text-primary mb-4 sm:mb-0'>
          Progression d'apprentissage
        </h2>
        <div className='flex bg-secondary-100 rounded-lg p-1'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-primary'}`}
            >
              <Icon aria-hidden='true' name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='w-full h-60 sm:h-72 md:h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart<WeeklyData | MonthlyData>
            data={getCurrentData()}
            margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
            <XAxis
              dataKey={getXAxisKey()}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              dy={10}
            />
            <YAxis tick={{ fill: colors.textSecondary, fontSize: 12 }} dx={-5} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type='monotone'
              dataKey='hours'
              stroke={colors.primary[500]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
              name='Heures'
            />
            <Line
              type='monotone'
              dataKey='lessons'
              stroke={colors.accent[500]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
              name='Leçons'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='text-center p-4 bg-primary-50 rounded-lg border border-primary-100'>
          <p className='text-sm text-text-secondary mb-1'>
            Temps d'étude ({activeTab === 'weekly' ? 'semaine' : '6 mois'})
          </p>
          <p className='text-2xl font-semibold text-primary'>{totalHours}h</p>
        </div>
        <div className='text-center p-4 bg-accent-50 rounded-lg border border-accent-100'>
          <p className='text-sm text-text-secondary mb-1'>
            Leçons terminées ({activeTab === 'weekly' ? 'semaine' : '6 mois'})
          </p>
          <p className='text-2xl font-semibold text-accent'>{totalLessons}</p>
        </div>
        <div className='text-center p-4 bg-warning-50 rounded-lg border border-warning-100'>
          <p className='text-sm text-text-secondary mb-1'>
            XP gagnés ({activeTab === 'weekly' ? 'semaine' : '6 mois'})
          </p>
          <p className='text-2xl font-semibold text-warning'>{totalXP}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
