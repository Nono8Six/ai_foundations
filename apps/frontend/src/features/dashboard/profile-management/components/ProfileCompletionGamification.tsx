import React from 'react';
import Icon from '@shared/components/AppIcon';
import type { UserProfile } from '@frontend/types/user';
import { ActionXPBadge, XP_REWARDS } from './XPNotificationSystem';

type Profile = UserProfile;

interface ProfileCompletionGamificationProps {
  profile: Profile;
  onFieldFocus?: (field: string, points: number) => void;
}

interface ProfileField {
  key: keyof Profile;
  label: string;
  points: number;
  isCompleted: (profile: Profile) => boolean;
  icon: string;
  description: string;
}

const PROFILE_FIELDS: ProfileField[] = [
  {
    key: 'avatar_url',
    label: 'Photo de profil',
    points: XP_REWARDS.AVATAR_UPLOAD,
    isCompleted: (profile) => !!profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com'),
    icon: 'Camera',
    description: 'Ajoutez une photo personnalisée'
  },
  {
    key: 'phone',
    label: 'Numéro de téléphone',
    points: XP_REWARDS.PHONE_ADDED,
    isCompleted: (profile) => !!profile.phone && profile.phone.length >= 10,
    icon: 'Phone',
    description: 'Renseignez votre téléphone'
  },
  {
    key: 'profession',
    label: 'Profession',
    points: XP_REWARDS.PROFESSION_ADDED,
    isCompleted: (profile) => !!profile.profession && profile.profession.length >= 2,
    icon: 'Briefcase',
    description: 'Indiquez votre métier'
  },
  {
    key: 'company',
    label: 'Entreprise',
    points: XP_REWARDS.COMPANY_ADDED,
    isCompleted: (profile) => !!profile.company && profile.company.length >= 2,
    icon: 'Building',
    description: 'Précisez votre entreprise'
  }
];

const ProfileCompletionGamification: React.FC<ProfileCompletionGamificationProps> = ({
  profile,
  onFieldFocus
}) => {
  const completedFields = PROFILE_FIELDS.filter(field => field.isCompleted(profile));
  const totalPoints = PROFILE_FIELDS.reduce((sum, field) => sum + field.points, 0);
  const earnedPoints = completedFields.reduce((sum, field) => sum + field.points, 0);
  const completionPercentage = Math.round((earnedPoints / totalPoints) * 100);
  
  const pendingFields = PROFILE_FIELDS.filter(field => !field.isCompleted(profile));

  const formatLastUpdated = (updatedAt: string | null) => {
    if (!updatedAt) return 'Jamais modifié';
    
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };

  const getRarityColor = (percentage: number) => {
    if (percentage === 100) return 'from-yellow-400 to-yellow-600'; // Legendary
    if (percentage >= 75) return 'from-purple-400 to-purple-600'; // Epic
    if (percentage >= 50) return 'from-blue-400 to-blue-600'; // Rare
    if (percentage >= 25) return 'from-green-400 to-green-600'; // Uncommon
    return 'from-gray-400 to-gray-600'; // Common
  };

  const getRarityName = (percentage: number) => {
    if (percentage === 100) return 'Légendaire';
    if (percentage >= 75) return 'Épique';
    if (percentage >= 50) return 'Rare';
    if (percentage >= 25) return 'Inhabituel';
    return 'Commun';
  };

  return (
    <div className='space-y-6'>
      {/* Profile Completion Card */}
      <div className='bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className={`w-12 h-12 bg-gradient-to-r ${getRarityColor(completionPercentage)} rounded-full flex items-center justify-center`}>
              <Icon name='Trophy' size={24} className='text-white' />
            </div>
            <div>
              <h3 className='text-lg font-bold text-text-primary'>
                Profil {getRarityName(completionPercentage)}
              </h3>
              <p className='text-sm text-text-secondary'>
                {earnedPoints}/{totalPoints} points • {completionPercentage}% complet
              </p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-primary'>
              +{earnedPoints} XP
            </div>
            <div className='text-xs text-text-secondary'>
              Gagné par le profil
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className='relative w-full bg-secondary-200 rounded-full h-4 overflow-hidden mb-4'>
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getRarityColor(completionPercentage)} transition-all duration-1000 ease-out`}
            style={{ width: `${completionPercentage}%` }}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse'></div>
          </div>
          <div className='absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow'>
            {completionPercentage}%
          </div>
        </div>

        {/* Last Updated Info */}
        <div className='flex items-center gap-2 text-xs text-text-secondary'>
          <Icon name='Clock' size={14} />
          <span>
            Dernière modification: {formatLastUpdated(profile.updated_at)}
          </span>
        </div>
      </div>

      {/* Pending Tasks */}
      {pendingFields.length > 0 && (
        <div className='bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200'>
          <div className='flex items-center gap-2 mb-4'>
            <Icon name='Target' size={20} className='text-orange-500' />
            <h4 className='text-base font-semibold text-text-primary'>
              Missions disponibles
            </h4>
          </div>
          
          <div className='space-y-3'>
            {pendingFields.map((field) => (
              <div
                key={field.key}
                className='flex items-center justify-between p-3 bg-white/70 rounded-lg border border-orange-100 hover:border-orange-200 hover:bg-white transition-all cursor-pointer group'
                onClick={() => onFieldFocus?.(field.key as string, field.points)}
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors'>
                    <Icon name={field.icon} size={16} className='text-orange-600' />
                  </div>
                  <div>
                    <div className='font-medium text-text-primary text-sm'>
                      {field.label}
                    </div>
                    <div className='text-xs text-text-secondary'>
                      {field.description}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <ActionXPBadge 
                    action={field.key === 'avatar_url' ? 'AVATAR_UPLOAD' : 
                           field.key === 'phone' ? 'PHONE_ADDED' :
                           field.key === 'profession' ? 'PROFESSION_ADDED' : 'COMPANY_ADDED'} 
                    completed={false}
                  />
                  <Icon name='ChevronRight' size={16} className='text-text-secondary group-hover:text-primary transition-colors' />
                </div>
              </div>
            ))}
          </div>

          {completionPercentage === 100 && (
            <div className='mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                  <Icon name='CheckCircle' size={16} className='text-white' />
                </div>
                <div>
                  <div className='font-semibold text-green-800'>Profil parfait !</div>
                  <div className='text-sm text-green-600'>
                    Votre profil est maintenant 100% complet. Bravo ! 🎉
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionGamification;