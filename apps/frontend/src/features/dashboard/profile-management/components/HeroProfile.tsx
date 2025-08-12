import React, { ChangeEvent } from 'react';
import Icon from '@shared/components/AppIcon';
import Image from '@shared/components/AppImage';

interface HeroProfileProps {
  userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    streak: number;
    coursesCompleted: number;
    certificatesEarned: number;
    joinDate: string;
    profession?: string | null;
    company?: string | null;
  };
  isEditing: boolean;
  avatarPreview: string;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEditToggle: () => void;
}

// Utility functions for XP rarity system - Updated for modern 2025 design

const getRarityName = (xp: number) => {
  if (xp >= 500) return 'Maître Mythique';
  if (xp >= 200) return 'Expert Légendaire';
  if (xp >= 100) return 'Apprenant Épique';
  if (xp >= 50) return 'Étudiant Rare';
  if (xp >= 25) return 'Novice Prometteur';
  return 'Apprenti Débutant';
};

const HeroProfile: React.FC<HeroProfileProps> = ({
  userData,
  isEditing,
  avatarPreview,
  onAvatarChange,
  onEditToggle,
}) => {
  return (
    <div className='bg-surface rounded-xl shadow-subtle border border-border p-4 sm:p-6 lg:p-8 mb-6'>
      {/* Main Profile Section */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6'>
        {/* Left Side: Avatar + Basic Info */}
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full lg:w-auto'>
          {/* Avatar with Edit Functionality */}
          <div className='relative flex-shrink-0 group'>
            <div className='w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden ring-4 ring-primary/10 transition-all duration-300 group-hover:ring-primary/20 group-hover:shadow-lg'>
              <Image
                src={avatarPreview}
                alt={userData.name}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
              />
            </div>
            {isEditing && (
              <label className='absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 hover:scale-110 transition-all duration-300 shadow-lg animate-pulse hover:animate-none'>
                <Icon aria-hidden='true' name='Camera' size={12} className='sm:hidden' />
                <Icon aria-hidden='true' name='Camera' size={14} className='hidden sm:block' />
                <input
                  type='file'
                  accept='image/*'
                  onChange={onAvatarChange}
                  className='hidden'
                  autoComplete="off"
                />
              </label>
            )}
          </div>

          {/* Name, Email & Status */}
          <div className='flex flex-col text-center sm:text-left flex-1 min-w-0'>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-1 truncate'>
              {userData.name}
            </h1>
            <p className='text-text-secondary mb-2 text-sm sm:text-base truncate'>
              {userData.email}
            </p>
            {(userData.profession || userData.company) && (
              <div className='text-sm text-text-secondary mb-3 space-y-1'>
                {userData.profession && (
                  <p className='truncate'>
                    <Icon name='Briefcase' size={12} className='inline mr-1 opacity-70' />
                    {userData.profession}
                  </p>
                )}
                {userData.company && (
                  <p className='truncate'>
                    <Icon name='Building' size={12} className='inline mr-1 opacity-70' />
                    {userData.company}
                  </p>
                )}
              </div>
            )}
            <div className='flex items-center justify-center sm:justify-start gap-2'>
              <div className='relative'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <div className='absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping'></div>
              </div>
              <span className='text-sm text-text-secondary'>En ligne</span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Button */}
        {!isEditing && (
          <button
            onClick={onEditToggle}
            className='inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary bg-surface hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition-all duration-300 self-start group'
          >
            <Icon aria-hidden='true' name='Edit' size={16} className='mr-2 transition-transform duration-300 group-hover:rotate-12' />
            Modifier le profil
          </button>
        )}
      </div>

      {/* XP Progress Bar Section - Compact Modern 2025 */}
      <div className='relative bg-gradient-to-r from-amber-50/90 to-orange-50/80 rounded-xl p-4 border border-amber-200/60 mt-6 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] group'>
        <div className='flex items-center justify-between'>
          {/* Left: Level & XP Info */}
          <div className='flex items-center gap-3'>
            <div className='relative w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6'>
              <Icon name='Trophy' size={20} className='text-white' />
              <div className='absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
            <div>
              <div className='text-sm font-bold text-gray-800'>
                Niveau {userData.level} • {getRarityName(userData.xp)}
              </div>
              <div className='text-xs text-gray-600'>
                {userData.xp} / {userData.nextLevelXp} XP
              </div>
            </div>
          </div>

          {/* Right: Next Level Info */}
          <div className='text-right'>
            <div className='text-sm font-bold text-orange-600'>
              Plus que {userData.nextLevelXp - userData.xp} XP
            </div>
            <div className='text-xs text-gray-500'>
              pour niveau {userData.level + 1}
            </div>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <div className='mt-3'>
          <div 
            className='relative w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner'
            role="progressbar"
            aria-valuenow={userData.xp}
            aria-valuemin={0}
            aria-valuemax={userData.nextLevelXp}
            aria-label={`XP: ${userData.xp} sur ${userData.nextLevelXp}`}
          >
            <div
              className='absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden'
              style={{ width: `${Math.min((userData.xp / userData.nextLevelXp) * 100, 100)}%` }}
            >
              {/* Animated shimmer effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse'></div>
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent'></div>
            </div>
            
            {/* XP Gain Indicator - appears on recent gains */}
            {userData.xp > 0 && (
              <div className='absolute -top-8 right-0 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 opacity-0 animate-bounce group-hover:opacity-100 transition-opacity duration-300'>
                +{userData.xp} XP
              </div>
            )}
          </div>
          
          {/* Progress percentage tooltip */}
          <div className='flex justify-between items-center mt-1'>
            <span className='text-xs text-gray-500'>
              {Math.round((userData.xp / userData.nextLevelXp) * 100)}% vers niveau suivant
            </span>
            <span className='text-xs text-gray-500'>
              {userData.xp} / {userData.nextLevelXp} XP
            </span>
          </div>
        </div>
      </div>


      {/* Horizontal Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8'>
        <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg border border-orange-200 transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-orange-300 cursor-pointer group'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-12'>
              <Icon aria-hidden='true' name='Flame' size={16} className='text-white sm:hidden' />
              <Icon aria-hidden='true' name='Flame' size={20} className='text-white hidden sm:block' />
            </div>
            <div className='min-w-0'>
              <div className='text-base sm:text-lg font-bold text-text-primary'>
                {userData.streak}
              </div>
              <div className='text-xs text-text-secondary truncate'>
                série active
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-blue-300 cursor-pointer group'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110'>
              <Icon aria-hidden='true' name='BookOpen' size={16} className='text-white sm:hidden' />
              <Icon aria-hidden='true' name='BookOpen' size={20} className='text-white hidden sm:block' />
            </div>
            <div className='min-w-0'>
              <div className='text-base sm:text-lg font-bold text-text-primary'>
                {userData.coursesCompleted}
              </div>
              <div className='text-xs text-text-secondary truncate'>
                cours terminés
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-lg border border-yellow-200 transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-yellow-300 cursor-pointer group'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-12'>
              <Icon aria-hidden='true' name='Award' size={16} className='text-white sm:hidden' />
              <Icon aria-hidden='true' name='Award' size={20} className='text-white hidden sm:block' />
            </div>
            <div className='min-w-0'>
              <div className='text-base sm:text-lg font-bold text-text-primary'>
                {userData.certificatesEarned}
              </div>
              <div className='text-xs text-text-secondary truncate'>
                certificats
              </div>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-green-300 cursor-pointer group'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110'>
              <Icon aria-hidden='true' name='Calendar' size={16} className='text-white sm:hidden' />
              <Icon aria-hidden='true' name='Calendar' size={20} className='text-white hidden sm:block' />
            </div>
            <div className='min-w-0'>
              <div className='text-base sm:text-lg font-bold text-text-primary'>
                {Math.floor((Date.now() - new Date(userData.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className='text-xs text-text-secondary truncate'>
                jours membre
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;