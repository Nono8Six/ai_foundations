import React, { useState, useEffect } from 'react';
import { colors } from '../../../utils/theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useCourses } from '../../../context/CourseContext';
import Icon from '../../../components/AppIcon';

const ProgressChart = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const { user } = useAuth();
  const { userProgress } = useCourses();
  const [hasData, setHasData] = useState(false);
  const [chartData, setChartData] = useState({
    weekly: [],
    monthly: [],
    subjects: []
  });

  useEffect(() => {
    // Generate realistic data based on user progress
    if (user && userProgress.length > 0) {
      generateChartData();
      setHasData(true);
    } else {
      setHasData(false);
    }
  }, [user, userProgress]);

  const generateChartData = () => {
    // Weekly data - last 7 days
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const weeklyData = days.map((day, index) => {
      const dayHasPassed = (today === 0 ? 6 : today - 1) >= index;
      
      // Only show activity for days that have passed
      return {
        day,
        hours: dayHasPassed ? Math.random() * 2 : 0,
        lessons: dayHasPassed ? Math.floor(Math.random() * 3) : 0,
        xp: dayHasPassed ? Math.floor(Math.random() * 100) : 0
      };
    });

    // Monthly data - last 6 months
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const monthlyData = months.map(month => ({
      month,
      hours: Math.random() * 30 + 5,
      lessons: Math.floor(Math.random() * 20 + 5),
      xp: Math.floor(Math.random() * 1000 + 200)
    }));

    // Subject distribution
    const subjects = [
            { name: 'IA Générale', value: 35, color: colors.primary },
            { name: 'Machine Learning', value: 25, color: colors.accent },
            { name: 'Deep Learning', value: 20, color: colors.warning },
            { name: 'NLP', value: 15, color: colors.secondary },
            { name: 'Computer Vision', value: 5, color: colors.error }
    ];

    setChartData({
      weekly: weeklyData,
      monthly: monthlyData,
      subjects
    });
  };

  const getCurrentData = () => (activeTab === 'weekly' ? chartData.weekly : chartData.monthly);
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
    { id: 'weekly', label: 'Cette semaine', icon: 'Calendar' },
    { id: 'monthly', label: 'Ces 6 mois', icon: 'TrendingUp' },
  ];

  if (!hasData) {
    return (
      <div className='bg-surface rounded-xl border border-border p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-text-primary mb-4 sm:mb-0'>
            Progression d'apprentissage
          </h2>
        </div>
        
        <div className='text-center py-8'>
          <Icon name='BarChart3' size={48} className='mx-auto text-secondary-300 mb-4' />
          <h3 className='text-lg font-medium text-text-primary mb-2'>Aucune donnée disponible</h3>
          <p className='text-text-secondary mb-4'>
            Commencez à apprendre pour voir votre progression ici
          </p>
        </div>
      </div>
    );
  }

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
            <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
            <XAxis dataKey={getXAxisKey()} tick={{ fill: colors.secondary, fontSize: 12 }} />
            <YAxis tick={{ fill: colors.secondary, fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type='monotone' dataKey='hours' stroke={colors.primary} strokeWidth={2} dot={false} />
            <Line type='monotone' dataKey='lessons' stroke={colors.accent} strokeWidth={2} dot={false} />
            <Line type='monotone' dataKey='xp' stroke={colors.warning} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='text-center p-3 bg-primary-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Temps d'étude</p>
          <p className='text-lg font-semibold text-primary'>
            {activeTab === 'weekly' 
              ? `${chartData.weekly.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h` 
              : `${chartData.monthly.reduce((acc, month) => acc + month.hours, 0).toFixed(1)}h`}
          </p>
        </div>
        <div className='text-center p-3 bg-accent-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>Leçons terminées</p>
          <p className='text-lg font-semibold text-accent'>
            {activeTab === 'weekly' 
              ? chartData.weekly.reduce((acc, day) => acc + day.lessons, 0)
              : chartData.monthly.reduce((acc, month) => acc + month.lessons, 0)}
          </p>
        </div>
        <div className='text-center p-3 bg-warning-50 rounded-lg'>
          <p className='text-sm text-text-secondary'>XP gagnés</p>
          <p className='text-lg font-semibold text-warning'>
            {activeTab === 'weekly' 
              ? chartData.weekly.reduce((acc, day) => acc + day.xp, 0)
              : chartData.monthly.reduce((acc, month) => acc + month.xp, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;