import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const LearningStatsTab = ({ userData }) => {
  // Mock learning data
  const weeklyProgress = [
    { day: 'Lun', minutes: 45, xp: 120 },
    { day: 'Mar', minutes: 60, xp: 180 },
    { day: 'Mer', minutes: 30, xp: 90 },
    { day: 'Jeu', minutes: 75, xp: 200 },
    { day: 'Ven', minutes: 90, xp: 250 },
    { day: 'Sam', minutes: 120, xp: 300 },
    { day: 'Dim', minutes: 40, xp: 110 }
  ];

  const monthlyStats = [
    { month: 'Jan', completed: 2, started: 3 },
    { month: 'Fév', completed: 3, started: 4 },
    { month: 'Mar', completed: 3, started: 2 }
  ];

  const skillDistribution = [
    { name: 'IA Générale', value: 35, color: '#3b82f6' },
    { name: 'Machine Learning', value: 25, color: '#10b981' },
    { name: 'Automatisation', value: 20, color: '#f59e0b' },
    { name: 'Analyse de données', value: 20, color: '#ef4444' }
  ];

  const streakHistory = [
    { week: 'S1', streak: 5 },
    { week: 'S2', streak: 7 },
    { week: 'S3', streak: 12 },
    { week: 'S4', streak: 15 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary">Statistiques d'apprentissage</h3>
        <p className="text-text-secondary text-sm mt-1">
          Suivez vos progrès et analysez vos performances d'apprentissage
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-600 text-sm font-medium">Temps total</p>
              <p className="text-2xl font-bold text-primary-700">{userData.totalLearningTime}h</p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-6 border border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-600 text-sm font-medium">Cours terminés</p>
              <p className="text-2xl font-bold text-accent-700">{userData.coursesCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Série actuelle</p>
              <p className="text-2xl font-bold text-orange-700">{userData.streak} jours</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Icon name="Flame" size={24} color="white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Niveau actuel</p>
              <p className="text-2xl font-bold text-purple-700">{userData.level}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Icon name="Trophy" size={24} color="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-base font-semibold text-text-primary mb-4">Progrès hebdomadaire</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-base font-semibold text-text-primary mb-4">Évolution XP</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-base font-semibold text-text-primary mb-4">Répartition des compétences</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
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
          <div className="grid grid-cols-2 gap-2 mt-4">
            {skillDistribution.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: skill.color }}
                ></div>
                <span className="text-xs text-text-secondary">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak History */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h4 className="text-base font-semibold text-text-primary mb-4">Historique des séries</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streakHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="streak" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h4 className="text-base font-semibold text-text-primary mb-6">Réalisations débloquées</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userData.achievements.map((achievement) => (
            <div key={achievement.id} className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-4 border border-secondary-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={achievement.icon} size={24} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-text-primary mb-1">{achievement.name}</h5>
                  <p className="text-xs text-text-secondary mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      {achievement.category}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {new Date(achievement.unlockedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h4 className="text-base font-semibold text-text-primary mb-4">Objectifs d'apprentissage</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Target" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Objectif quotidien</p>
                <p className="text-xs text-text-secondary">30 minutes par jour</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-accent">75%</p>
              <p className="text-xs text-text-secondary">22.5/30 min</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Objectif mensuel</p>
                <p className="text-xs text-text-secondary">Terminer 3 cours</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-success">100%</p>
              <p className="text-xs text-text-secondary">3/3 cours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatsTab;