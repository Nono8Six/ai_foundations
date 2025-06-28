import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';
import Icon from '@frontend/components/AppIcon';
import Image from '@frontend/components/AppImage';
import PersonalInfoTab from './components/PersonalInfoTab';
import LearningStatsTab from './components/LearningStatsTab';
import SettingsTab from './components/SettingsTab';

const UserProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['personal', 'stats', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Use real user data instead of mock data
  const userData = {
    id: user?.id || '',
    name: userProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'Utilisateur',
    email: user?.email || '',
    phone: '', // This would need to be added to the profiles table if needed
    profession: '', // This would need to be added to the profiles table if needed
    company: '', // This would need to be added to the profiles table if needed
    avatar:
      userProfile?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'User')}&background=1e40af&color=fff`,
    joinDate: user?.created_at || new Date().toISOString(),
    level: userProfile?.level || 1,
    xp: userProfile?.xp || 0,
    nextLevelXp: Math.floor(100 * Math.pow(userProfile?.level || 1, 1.5)),
    streak: userProfile?.current_streak || 0,
    totalLearningTime: 0, // This would need to be calculated from user progress
    coursesCompleted: 0, // This would need to be calculated from user progress
    certificatesEarned: 0, // This would need to be calculated from achievements
    achievements: [], // This would come from the achievements table
  };

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: 'User' },
    { id: 'stats', label: "Statistiques d'apprentissage", icon: 'BarChart3' },
    { id: 'settings', label: 'Paramètres', icon: 'Settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab userData={userData} />;
      case 'stats':
        return <LearningStatsTab userData={userData} />;
      case 'settings':
        return <SettingsTab userData={userData} />;
      default:
        return <PersonalInfoTab userData={userData} />;
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          {/* Profile Sidebar */}
          <div className='lg:col-span-3 mb-8 lg:mb-0'>
            <div className='bg-surface rounded-xl shadow-subtle border border-border p-6'>
              {/* Avatar Section */}
              <div className='text-center mb-6'>
                <div className='relative inline-block'>
                  <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                    <Image
                      src={userData.avatar}
                      alt={userData.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
                <h2 className='text-xl font-semibold text-text-primary mb-1'>{userData.name}</h2>
                <p className='text-text-secondary text-sm'>{userData.email}</p>
              </div>

              {/* Level Progress */}
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-text-primary'>
                    Niveau {userData.level}
                  </span>
                  <span className='text-sm text-text-secondary'>
                    {userData.xp}/{userData.nextLevelXp} XP
                  </span>
                </div>
                <div className='w-full bg-secondary-200 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300'
                    style={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Icon aria-hidden='true' name='Flame' size={16} className='text-orange-500' />
                    <span className='text-sm text-text-secondary'>Série actuelle</span>
                  </div>
                  <span className='text-sm font-medium text-text-primary'>
                    {userData.streak} jours
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Icon aria-hidden='true' name='BookOpen' size={16} className='text-primary' />
                    <span className='text-sm text-text-secondary'>Cours terminés</span>
                  </div>
                  <span className='text-sm font-medium text-text-primary'>
                    {userData.coursesCompleted}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Icon aria-hidden='true' name='Award' size={16} className='text-accent' />
                    <span className='text-sm text-text-secondary'>Certificats</span>
                  </div>
                  <span className='text-sm font-medium text-text-primary'>
                    {userData.certificatesEarned}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='lg:col-span-9'>
            {/* Tab Navigation */}
            <div className='bg-surface rounded-xl shadow-subtle border border-border mb-6'>
              <div className='border-b border-border'>
                <nav className='flex space-x-8 px-6' aria-label='Tabs'>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        navigate(`/profile?tab=${tab.id}`, { replace: true });
                      }}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                      }`}
                    >
                      <div className='flex items-center space-x-2'>
                        <Icon aria-hidden='true' name={tab.icon} size={16} />
                        <span className='hidden sm:inline'>{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className='p-6'>{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManagement;
