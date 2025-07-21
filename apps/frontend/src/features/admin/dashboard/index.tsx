import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@shared/components/AppIcon';
import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';
import RecentActivity from './components/RecentActivity';
import UserEngagementChart from './components/UserEngagementChart';
import PopularCoursesChart from './components/PopularCoursesChart';
import GeographicDistribution from './components/GeographicDistribution';
import PerformanceMetrics from './components/PerformanceMetrics';

const AdminDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0, // Placeholder
    revenue: 'N/A', // Placeholder
    newUsersToday: 0,
    coursesCompleted: 0, // Placeholder
    averageSessionTime: '0m 0s',
    systemUptime: 'N/A', // Placeholder
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Total Users
        const { count: totalUsersCount, error: totalUsersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (totalUsersError) throw totalUsersError;

        // Fetch Active Users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: activeUsersData, error: activeUsersError } = await supabase
          .from('activity_log')
          .select('user_id', { count: 'exact' })
          .gte('created_at', sevenDaysAgo.toISOString());
        if (activeUsersError) throw activeUsersError;
        const activeUsersCount = activeUsersData ? activeUsersData.length : 0;

        // Fetch New Users Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const { count: newUsersTodayCount, error: newUsersTodayError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString());
        if (newUsersTodayError) throw newUsersTodayError;

        // Fetch Average Session Time
        const { data: sessionData, error: sessionError } = await supabase
          .from('user_sessions')
          .select('duration_minutes');
        if (sessionError) throw sessionError;
        const validSessions = sessionData.filter(s => s.duration_minutes !== null);
        const avgSessionTime =
          validSessions.length > 0
            ? validSessions.reduce((acc, curr) => acc + (curr.duration_minutes ?? 0), 0) /
              validSessions.length
            : 0;

        setDashboardData({
          totalUsers: totalUsersCount || 0,
          activeUsers: activeUsersCount || 0,
          newUsersToday: newUsersTodayCount || 0,
          averageSessionTime: `${Math.round(avgSessionTime)}m 0s`, // Simplified display
          completionRate: 0, // Placeholder
          revenue: 'N/A', // Placeholder
          coursesCompleted: 0, // Placeholder
          systemUptime: 'N/A', // Placeholder
        });
      } catch (error) {
        log.error('Error fetching dashboard data:', error);
        // Set default/error state for dashboardData if needed
        setDashboardData({
          totalUsers: 0,
          activeUsers: 0,
          completionRate: 0,
          revenue: 'N/A',
          newUsersToday: 0,
          coursesCompleted: 0,
          averageSessionTime: 'Error',
          systemUptime: 'N/A',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // dashboardMetrics will now be derived from dashboardData state
  const dashboardMetrics = dashboardData;

  const quickStats = [
    {
      id: 1,
      title: 'Utilisateurs totaux',
      value: dashboardMetrics.totalUsers.toLocaleString('fr-FR'),
      change: '+12.5%', // Placeholder - will need logic for change %
      changeType: 'positive',
      icon: 'Users',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Apprenants actifs',
      value: dashboardMetrics.activeUsers.toLocaleString('fr-FR'),
      change: '+8.2%', // Placeholder
      changeType: 'positive',
      icon: 'UserCheck',
      color: 'bg-emerald-500',
    },
    {
      id: 3,
      title: 'Taux de completion',
      value: `${dashboardMetrics.completionRate}%`, // Placeholder
      change: '+3.1%', // Placeholder
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Revenus',
      value:
        dashboardMetrics.revenue === 'N/A'
          ? 'N/A'
          : `€${(dashboardMetrics.revenue as unknown as number).toLocaleString('fr-FR')}`, // Placeholder
      change: '+15.7%', // Placeholder
      changeType: 'positive',
      icon: 'Euro',
      color: 'bg-amber-500',
    },
  ];
  const timeRanges = [
    { value: '24h', label: '24 heures' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
  ];

  return (
    <div className='min-h-screen bg-background'>
      {/* Dashboard content */}
      <main className='p-6'>
        {/* Page header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-text-primary mb-2'>
                Tableau de bord administrateur
              </h1>
              <p className="text-text-secondary">
                Vue d&apos;ensemble des performances et de l&apos;activité de la plateforme
              </p>
            </div>
            
            <div className='flex items-center space-x-4'>
              {/* Global search */}
              <div className='relative hidden md:block'>
                <Icon
                  aria-hidden='true'
                  name='Search'
                  size={18}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary'
                />
                <input
                  type='text'
                  placeholder='Rechercher...'
                  className='pl-10 pr-4 py-2 w-64 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface'
                />
              </div>

              {/* Time range selector */}
              <select
                value={selectedTimeRange}
                onChange={e => setSelectedTimeRange(e.target.value)}
                className='px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-surface'
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Notifications */}
              <button className='relative p-2 rounded-lg hover:bg-secondary-100 transition-colors'>
                <Icon name='Bell' size={20} aria-label='Notifications' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-error rounded-full'></span>
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <p className='text-xl text-text-secondary'>Chargement des données...</p>
          </div>
        ) : (
          <>
            {/* Quick stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {quickStats.map(stat => (
                <div
                  key={stat.id}
                  className='bg-surface rounded-lg p-6 shadow-subtle border border-border'
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-text-secondary mb-1'>{stat.title}</p>
                      <p className='text-2xl font-bold text-text-primary'>{stat.value}</p>
                      <div className='flex items-center mt-2'>
                        <span
                          className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`}
                        >
                          {stat.change}
                        </span>
                        <span className='text-xs text-text-secondary ml-1'>
                          vs période précédente
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon aria-hidden='true' name={stat.icon} size={24} color='white' />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <UserEngagementChart timeRange={selectedTimeRange} />
              <PopularCoursesChart />
            </div>

            {/* Geographic distribution and performance */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
              <div className='lg:col-span-2'>
                <GeographicDistribution />
              </div>
              <PerformanceMetrics metrics={dashboardMetrics} />
            </div>

            {/* Recent activity */}
            <RecentActivity />

            {/* Quick actions */}
            <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
              <h3 className='text-lg font-semibold text-text-primary mb-4'>Actions rapides</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Link
                  to='/user-management-admin'
                  className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'
                >
                  <Icon
                    aria-hidden='true'
                    name='UserPlus'
                    size={20}
                    className='text-primary mr-3'
                  />
                  <span className='text-sm font-medium text-text-primary'>Ajouter utilisateur</span>
                </Link>
                <Link
                  to='/cms'
                  className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'
                >
                  <Icon aria-hidden='true' name='Plus' size={20} className='text-primary mr-3' />
                  <span className='text-sm font-medium text-text-primary'>Créer cours</span>
                </Link>
                <button className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'>
                  <Icon
                    aria-hidden='true'
                    name='Download'
                    size={20}
                    className='text-primary mr-3'
                  />
                  <span className='text-sm font-medium text-text-primary'>Exporter données</span>
                </button>
                <button className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'>
                  <Icon
                    aria-hidden='true'
                    name='Settings'
                    size={20}
                    className='text-primary mr-3'
                  />
                  <span className='text-sm font-medium text-text-primary'>Paramètres</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
