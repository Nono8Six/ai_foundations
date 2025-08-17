import React, { useState, useEffect } from 'react';
import Icon from '@shared/components/AppIcon';
import type { UserProfile } from '@frontend/types/user';
import { ActionXPBadge } from './XPNotificationSystem';
import { XPRulesService } from '@shared/services/xpRulesService';
import { log } from '@libs/logger';

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
  sourceType: string;
  actionType: string;
}

// Configuration des champs profil - PLUS de hardcoding
// Les points XP viennent de xp_sources via RPC
const PROFILE_FIELDS_CONFIG: Omit<ProfileField, 'points'>[] = [
  {
    key: 'avatar_url',
    label: 'Photo de profil',
    isCompleted: (profile) => !!profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com'),
    icon: 'Camera',
    description: 'Ajoutez une photo personnalisée',
    sourceType: 'profile',
    actionType: 'avatar_upload'
  },
  {
    key: 'phone',
    label: 'Numéro de téléphone',
    isCompleted: (profile) => !!profile.phone && profile.phone.length >= 10,
    icon: 'Phone',
    description: 'Renseignez votre téléphone',
    sourceType: 'profile',
    actionType: 'phone_added'
  },
  {
    key: 'profession',
    label: 'Profession',
    isCompleted: (profile) => !!profile.profession && profile.profession.length >= 2,
    icon: 'Briefcase',
    description: 'Indiquez votre métier',
    sourceType: 'profile',
    actionType: 'profession_added'
  },
  {
    key: 'company',
    label: 'Entreprise',
    isCompleted: (profile) => !!profile.company && profile.company.length >= 2,
    icon: 'Building',
    description: 'Précisez votre entreprise',
    sourceType: 'profile',
    actionType: 'company_added'
  }
];

const ProfileCompletionGamification: React.FC<ProfileCompletionGamificationProps> = ({
  profile,
  onFieldFocus
}) => {
  const [profileFields, setProfileFields] = useState<ProfileField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les points XP depuis xp_sources au montage
  useEffect(() => {
    const loadXPValues = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fieldsWithPoints: ProfileField[] = await Promise.all(
          PROFILE_FIELDS_CONFIG.map(async (fieldConfig) => {
            try {
              const points = await XPRulesService.getXPValue(fieldConfig.sourceType, fieldConfig.actionType);
              return { ...fieldConfig, points };
            } catch (error) {
              log.error(`Failed to load XP value for ${fieldConfig.sourceType}:${fieldConfig.actionType}:`, error);
              // Si une règle est manquante, on skip ce champ plutôt que de planter
              return null;
            }
          })
        );
        
        // Filtrer les champs null (règles XP manquantes)
        const validFields = fieldsWithPoints.filter(Boolean) as ProfileField[];
        
        if (validFields.length === 0) {
          throw new Error('Aucune règle XP trouvée pour les champs du profil');
        }
        
        setProfileFields(validFields);
      } catch (error) {
        log.error('Error loading profile XP values:', error);
        setError(error instanceof Error ? error.message : 'Erreur de chargement des règles XP');
      } finally {
        setIsLoading(false);
      }
    };

    loadXPValues();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || profileFields.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="AlertTriangle" size={20} className="text-red-500" />
          <h3 className="font-semibold text-red-800">Erreur de chargement</h3>
        </div>
        <p className="text-red-600 text-sm mb-3">
          {error || 'Impossible de charger les informations de gamification du profil.'}
        </p>
        <p className="text-red-500 text-xs">
          Vérifiez que les règles XP pour les champs profil sont configurées dans xp_sources.
        </p>
      </div>
    );
  }

  // Calculs avec les données chargées
  const completedFields = profileFields.filter(field => field.isCompleted(profile));
  const totalPoints = profileFields.reduce((sum, field) => sum + field.points, 0);
  const earnedPoints = completedFields.reduce((sum, field) => sum + field.points, 0);
  const completionPercentage = Math.round((earnedPoints / totalPoints) * 100);
  
  const pendingFields = profileFields.filter(field => !field.isCompleted(profile));

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
    if (percentage >= 25) return 'Peu commun';
    return 'Commun';
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
      {/* Header with completion stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRarityColor(completionPercentage)} flex items-center justify-center shadow-lg`}>
            <Icon name="User" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              Profil {getRarityName(completionPercentage)}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">
                {completedFields.length}/{profileFields.length} champs complétés
              </span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {earnedPoints}<span className="text-sm font-normal text-text-secondary">/{totalPoints} XP</span>
          </div>
          <span className="text-xs text-text-secondary">
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
                    xpValue={field.points}
                    size="sm"
                    variant="warning"
                  />
                  <Icon name='ChevronRight' size={16} className='text-text-secondary group-hover:text-primary transition-colors' />
                </div>
              </div>
            ))}
          </div>

          {completionPercentage === 100 && (
            <div className='mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200'>
              <div className='flex items-center gap-2 mb-2'>
                <Icon name='Trophy' size={18} className='text-green-600' />
                <span className='font-semibold text-green-800'>Profil Parfait !</span>
              </div>
              <p className='text-sm text-green-700'>
                Félicitations ! Votre profil est maintenant complet. 
                Vous bénéficiez du bonus de complétion maximum.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Completed Fields */}
      {completedFields.length > 0 && (
        <div className='mt-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Icon name='CheckCircle' size={20} className='text-green-500' />
            <h4 className='text-base font-semibold text-text-primary'>
              Champs complétés ({completedFields.length})
            </h4>
          </div>
          
          <div className='grid gap-3'>
            {completedFields.map((field) => (
              <div key={field.key} className='flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                    <Icon name={field.icon} size={16} className='text-green-600' />
                  </div>
                  <div>
                    <div className='font-medium text-text-primary text-sm'>
                      {field.label}
                    </div>
                    <div className='text-xs text-green-600'>
                      ✓ Complété
                    </div>
                  </div>
                </div>
                <ActionXPBadge 
                  xpValue={field.points}
                  size="sm"
                  variant="success"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Progression</span>
          <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 bg-gradient-to-r ${getRarityColor(completionPercentage)} transition-all duration-500 ease-out`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionGamification;