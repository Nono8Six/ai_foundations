import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth/contexts/AuthContext';
import Icon from '@shared/components/AppIcon';
import PersonalInfoTab from './components/PersonalInfoTab';
import StatsPage from './components/StatsPage';
import SettingsTab from './components/SettingsTab';
import HeroProfile from './components/HeroProfile';
import { XPAdapter } from '@shared/services/xp-adapter';

const UserProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [nextLevelXp, setNextLevelXp] = useState<number>(0);
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

  // Initialize avatar preview
  React.useEffect(() => {
    const defaultAvatar = userProfile?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'User')}&background=1e40af&color=fff`;
    setAvatarPreview(defaultAvatar);
  }, [userProfile?.avatar_url, userProfile?.full_name, user?.email]);

  // Compute next level XP
  useEffect(() => {
    const computeNextLevelXp = async () => {
      if (userProfile?.xp !== undefined) {
        try {
          const levelInfo = await XPAdapter.getLevelInfo(userProfile.xp || 0);
          setNextLevelXp(levelInfo.xpForNextLevel);
        } catch (error) {
          console.error('Failed to compute level info:', error);
          setNextLevelXp(0);
        }
      }
    };

    computeNextLevelXp();
  }, [userProfile?.xp]);

  // Use real user data from userProfile
  const userData = {
    id: user?.id || '',
    name: userProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'Utilisateur',
    email: user?.email || '',
    phone: userProfile?.phone || null, // Keep null values to distinguish from empty strings
    profession: userProfile?.profession || null, // Keep null values to distinguish from empty strings
    company: userProfile?.company || null, // Keep null values to distinguish from empty strings
    avatar:
      userProfile?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'User')}&background=1e40af&color=fff`,
    joinDate: user?.created_at || new Date().toISOString(),
    level: userProfile?.level || 1,
    xp: userProfile?.xp || 0,
    nextLevelXp,
    streak: userProfile?.current_streak || 0,
    totalLearningTime: 0, // This would need to be calculated from user progress
    coursesCompleted: 0, // This would need to be calculated from user progress
    certificatesEarned: 0,
  };

  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: 'User' },
    { id: 'stats', label: "Statistiques d'apprentissage", icon: 'BarChart3' },
    { id: 'settings', label: 'Paramètres', icon: 'Settings' },
  ];

  // Handle avatar change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        // Import toast dynamically to avoid module issues
        import('sonner').then(({ toast }) => {
          toast.error('La taille du fichier ne doit pas dépasser 2MB');
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        import('sonner').then(({ toast }) => {
          toast.error('Veuillez sélectionner un fichier image valide');
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setAvatarPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return userProfile ? (
          <PersonalInfoTab 
            userData={userData}
            profile={userProfile}
            isEditingFromHero={isEditingProfile}
            onEditingChange={setIsEditingProfile}
            avatarPreview={avatarPreview}
          />
        ) : (
          <div className="p-4 text-gray-500">Chargement du profil utilisateur...</div>
        );
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <PersonalInfoTab userData={userData} />;
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20'>
        {/* Hero Profile Section */}
        <HeroProfile
          userData={userData}
          isEditing={isEditingProfile}
          avatarPreview={avatarPreview}
          onAvatarChange={handleAvatarChange}
          onEditToggle={handleEditToggle}
        />

        {/* Tab Navigation and Content */}
        <div className='bg-surface rounded-xl shadow-subtle border border-border'>
          <div className='border-b border-border'>
            <nav className='flex justify-center space-x-8 px-6' aria-label='Tabs'>
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
  );
};

export default UserProfileManagement;
