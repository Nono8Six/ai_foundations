import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressChart = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  // Mock data for different time periods
  const weeklyData = [
    { day: 'Lun', hours: 2.5, lessons: 3, xp: 150 },
    { day: 'Mar', hours: 1.8, lessons: 2, xp: 100 },
    { day: 'Mer', hours: 3.2, lessons: 4, xp: 200 },
    { day: 'Jeu', hours: 2.1, lessons: 2, xp: 120 },
    { day: 'Ven', hours: 4.0, lessons: 5, xp: 250 },
    { day: 'Sam', hours: 1.5, lessons: 2, xp: 100 },
    { day: 'Dim', hours: 2.8, lessons: 3, xp: 180 }
  ];

  const monthlyData = [
    { month: 'Jan', hours: 45, lessons: 28, xp: 1400 },
    { month: 'Fév', hours: 52, lessons: 32, xp: 1600 },
    { month: 'Mar', hours: 38, lessons: 24, xp: 1200 },
    { month: 'Avr', hours: 61, lessons: 38, xp: 1900 },
    { month: 'Mai', hours: 48, lessons: 30, xp: 1500 },
    { month: 'Juin', hours: 55, lessons: 34, xp: 1700 }
  ];

  const subjectData = [
    { name: 'IA Fondamentale', value: 35, color: '#3b82f6' },
    { name: 'Machine Learning', value: 25, color: '#10b981' },
    { name: 'Deep Learning', value: 20, color: '#f59e0b' },
    { name: 'Éthique IA', value: 15, color: '#ef4444' },
    { name: 'Autres', value: 5, color: '#64748b' }
  ];

  const getCurrentData = () => {
    return activeTab === 'weekly' ? weeklyData : monthlyData;
  };

  const getXAxisKey = () => {
    return activeTab === 'weekly' ? 'day' : 'month';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
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
    { id: 'monthly', label: 'Ces 6 mois', icon: 'TrendingUp' }
  ];

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 sm:mb-0">
          Progression d'apprentissage
        </h2>
        
        <div className="flex bg-secondary-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-surface text-primary shadow-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Temps d'étude et leçons complétées
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey={getXAxisKey()} 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="lessons" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-text-secondary">Heures d'étude</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Leçons complétées</span>
            </div>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Répartition par matière
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Temps']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4">
            {subjectData.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  <span className="text-sm text-text-secondary">{subject.name}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{subject.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Progression XP {activeTab === 'weekly' ? 'cette semaine' : 'ces 6 mois'}
          </h3>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={getXAxisKey()} 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                formatter={(value) => [`${value} XP`, 'Points gagnés']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="xp" 
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;