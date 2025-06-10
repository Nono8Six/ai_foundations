import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import RecentActivity from './components/RecentActivity';
import UserEngagementChart from './components/UserEngagementChart';
import PopularCoursesChart from './components/PopularCoursesChart';
import GeographicDistribution from './components/GeographicDistribution';
import PerformanceMetrics from './components/PerformanceMetrics';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Mock data for dashboard metrics
  const dashboardMetrics = {
    totalUsers: 12847,
    activeUsers: 8932,
    completionRate: 78.5,
    revenue: 245680,
    newUsersToday: 156,
    coursesCompleted: 2341,
    averageSessionTime: '24m 32s',
    systemUptime: '99.8%',
  };

  const quickStats = [
    {
      id: 1,
      title: 'Utilisateurs totaux',
      value: dashboardMetrics.totalUsers.toLocaleString('fr-FR'),
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Apprenants actifs',
      value: dashboardMetrics.activeUsers.toLocaleString('fr-FR'),
      change: '+8.2%',
      changeType: 'positive',
      icon: 'UserCheck',
      color: 'bg-emerald-500',
    },
    {
      id: 3,
      title: 'Taux de completion',
      value: `${dashboardMetrics.completionRate}%`,
      change: '+3.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Revenus',
      value: `€${dashboardMetrics.revenue.toLocaleString('fr-FR')}`,
      change: '+15.7%',
      changeType: 'positive',
      icon: 'Euro',
      color: 'bg-amber-500',
    },
  ];

  const navigationItems = [
    { name: 'Tableau de bord', path: '/admin-dashboard', icon: 'LayoutDashboard', active: true },
    { name: 'Gestion utilisateurs', path: '/user-management-admin', icon: 'Users' },
    {
      name: 'Gestion contenu',
      path: '/cms',
      icon: 'BookOpen',
    },
    { name: "Vue d\'ensemble", path: '/program-overview', icon: 'GraduationCap' },
    { name: 'Profil utilisateur', path: '/user-profile-management', icon: 'User' },
  ];

  const timeRanges = [
    { value: '24h', label: '24 heures' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
  ];

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-medium transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b border-border'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
              <Icon name='GraduationCap' size={20} color='white' />
            </div>
            <span className='text-lg font-semibold text-text-primary'>AI Foundations</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden p-1 rounded-md hover:bg-secondary-100 transition-colors'
          >
            <Icon name='X' size={20} />
          </button>
        </div>

        <nav className='mt-6 px-3'>
          <div className='space-y-1'>
            {navigationItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
                }`}
              >
                <Icon name={item.icon} size={18} className='mr-3' />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className='absolute bottom-6 left-3 right-3'>
          <div className='bg-secondary-50 rounded-lg p-4'>
            <div className='flex items-center space-x-3 mb-2'>
              <Image
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
                alt='Admin Avatar'
                className='w-8 h-8 rounded-full object-cover'
              />
              <div>
                <p className='text-sm font-medium text-text-primary'>Admin User</p>
                <p className='text-xs text-text-secondary'>Administrateur</p>
              </div>
            </div>
            <Link
              to='/user-profile-management'
              className='text-xs text-primary hover:text-primary-700 transition-colors'
            >
              Voir le profil
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='lg:pl-64'>
        {/* Top navigation */}
        <header className='bg-surface shadow-subtle border-b border-border'>
          <div className='flex items-center justify-between h-16 px-6'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setSidebarOpen(true)}
                className='lg:hidden p-2 rounded-md hover:bg-secondary-100 transition-colors'
              >
                <Icon name='Menu' size={20} />
              </button>
              <h1 className='text-xl font-semibold text-text-primary'>
                Tableau de bord administrateur
              </h1>
            </div>

            <div className='flex items-center space-x-4'>
              {/* Global search */}
              <div className='relative hidden md:block'>
                <Icon
                  name='Search'
                  size={18}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary'
                />
                <input
                  type='text'
                  placeholder='Rechercher...'
                  className='pl-10 pr-4 py-2 w-64 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>

              {/* Time range selector */}
              <select
                value={selectedTimeRange}
                onChange={e => setSelectedTimeRange(e.target.value)}
                className='px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Notifications */}
              <button className='relative p-2 rounded-lg hover:bg-secondary-100 transition-colors'>
                <Icon name='Bell' size={20} />
                <span className='absolute top-1 right-1 w-2 h-2 bg-error rounded-full'></span>
              </button>

              {/* Profile dropdown */}
              <div className='relative'>
                <button className='flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors'>
                  <Image
                    src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
                    alt='Admin Avatar'
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <Icon name='ChevronDown' size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className='p-6'>
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
                    <Icon name={stat.icon} size={24} color='white' />
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
                <Icon name='UserPlus' size={20} className='text-primary mr-3' />
                <span className='text-sm font-medium text-text-primary'>Ajouter utilisateur</span>
              </Link>
              <Link
                to='/cms'
                className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'
              >
                <Icon name='Plus' size={20} className='text-primary mr-3' />
                <span className='text-sm font-medium text-text-primary'>Créer cours</span>
              </Link>
              <button className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'>
                <Icon name='Download' size={20} className='text-primary mr-3' />
                <span className='text-sm font-medium text-text-primary'>Exporter données</span>
              </button>
              <button className='flex items-center p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'>
                <Icon name='Settings' size={20} className='text-primary mr-3' />
                <span className='text-sm font-medium text-text-primary'>Paramètres</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
