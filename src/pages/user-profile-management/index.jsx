import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import PersonalInfoTab from './components/PersonalInfoTab';
import LearningStatsTab from './components/LearningStatsTab';
import SettingsTab from './components/SettingsTab';

const UserProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');

  // Mock user data
  const userData = {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+33 6 12 34 56 78",
    profession: "Comptable",
    company: "Cabinet Expertise Comptable",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinDate: "2024-01-15",
    level: 12,
    xp: 2450,
    nextLevelXp: 2800,
    streak: 15,
    totalLearningTime: 45.5,
    coursesCompleted: 8,
    certificatesEarned: 3,
    achievements: [
      {
        id: 1,
        name: "Premier Pas",
        description: "Complétez votre première leçon",
        icon: "Trophy",
        unlockedDate: "2024-01-16",
        category: "Débutant"
      },
      {
        id: 2,
        name: "Série de 7",
        description: "Maintenez une série de 7 jours",
        icon: "Flame",
        unlockedDate: "2024-01-23",
        category: "Constance"
      },
      {
        id: 3,
        name: "Expert IA",
        description: "Complétez le module avancé d\'IA",
        icon: "Brain",
        unlockedDate: "2024-02-10",
        category: "Expertise"
      }
    ]
  };

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: 'User' },
    { id: 'stats', label: 'Statistiques d\'apprentissage', icon: 'BarChart3' },
    { id: 'settings', label: 'Paramètres', icon: 'Settings' }
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
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/user-dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-primary">AI Foundations</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/user-dashboard" className="text-text-secondary hover:text-primary transition-colors">
                Tableau de bord
              </Link>
              <Link to="/program-overview" className="text-text-secondary hover:text-primary transition-colors">
                Programmes
              </Link>
              <Link to="/lesson-viewer" className="text-text-secondary hover:text-primary transition-colors">
                Leçons
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-secondary-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/user-dashboard" className="text-text-secondary hover:text-primary transition-colors">
              Tableau de bord
            </Link>
            <Icon name="ChevronRight" size={16} className="text-text-secondary" />
            <span className="text-text-primary font-medium">Profil</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-surface rounded-xl shadow-subtle border border-border p-6">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image 
                      src={userData.avatar} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-4 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <Icon name="Camera" size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">{userData.name}</h2>
                <p className="text-text-secondary text-sm">{userData.profession}</p>
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">Niveau {userData.level}</span>
                  <span className="text-sm text-text-secondary">{userData.xp}/{userData.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Flame" size={16} className="text-orange-500" />
                    <span className="text-sm text-text-secondary">Série actuelle</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{userData.streak} jours</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="BookOpen" size={16} className="text-primary" />
                    <span className="text-sm text-text-secondary">Cours terminés</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{userData.coursesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Award" size={16} className="text-accent" />
                    <span className="text-sm text-text-secondary">Certificats</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{userData.certificatesEarned}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {/* Tab Navigation */}
            <div className="bg-surface rounded-xl shadow-subtle border border-border mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={tab.icon} size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManagement;