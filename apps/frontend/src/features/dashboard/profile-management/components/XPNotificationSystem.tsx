import React from 'react';
import { toast } from 'sonner';
import Icon from '@shared/components/AppIcon';
import { XPRulesService } from '@shared/services/xpRulesService';
import { log } from '@libs/logger';

/**
 * XP Point System - REFACTORÉ P4
 * PLUS de hardcoding: toutes les valeurs viennent de xp_sources via RPC
 */

/**
 * Récupère la valeur XP pour une action profile depuis xp_sources
 * REMPLACE l'ancien XP_REWARDS hardcodé
 */
export const getProfileXPReward = async (field: string): Promise<number> => {
  try {
    // Mapping des champs vers les actions XP dans xp_sources
    const actionMap: Record<string, { sourceType: string; actionType: string }> = {
      'AVATAR_UPLOAD': { sourceType: 'profile', actionType: 'avatar_upload' },
      'PHONE_ADDED': { sourceType: 'profile', actionType: 'phone_added' },
      'PROFESSION_ADDED': { sourceType: 'profile', actionType: 'profession_added' },
      'COMPANY_ADDED': { sourceType: 'profile', actionType: 'company_added' },
      'PROFILE_COMPLETION_BONUS': { sourceType: 'profile', actionType: 'completion_bonus' }
    };

    const action = actionMap[field];
    if (!action) {
      throw new Error(`Unknown profile field: ${field}`);
    }

    const xpValue = await XPRulesService.getXPValue(action.sourceType, action.actionType);
    return xpValue;
  } catch (error) {
    log.error(`Failed to get XP reward for ${field}:`, error);
    throw error;
  }
};

/**
 * Version synchrone pour compatibility (utilise cache)
 * OBSOLÈTE: à remplacer par getProfileXPReward async
 */
export const calculateXPReward = async (field: string): Promise<number> => {
  return getProfileXPReward(field);
};

/**
 * Calcule le XP total du profil depuis les règles xp_sources
 * REMPLACE calculateTotalProfileXP hardcodé
 */
export const calculateTotalProfileXP = async (profile: {
  avatar_url?: string | null;
  phone?: string | null;
  profession?: string | null;
  company?: string | null;
}): Promise<number> => {
  let totalXP = 0;
  
  try {
    // Avatar upload XP
    if (profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com')) {
      totalXP += await XPRulesService.getXPValue('profile', 'avatar_upload');
    }
    
    // Phone XP
    if (profile.phone && profile.phone.length >= 10) {
      totalXP += await XPRulesService.getXPValue('profile', 'phone_added');
    }
    
    // Profession XP
    if (profile.profession && profile.profession.trim().length > 0) {
      totalXP += await XPRulesService.getXPValue('profile', 'profession_added');
    }
    
    // Company XP
    if (profile.company && profile.company.trim().length > 0) {
      totalXP += await XPRulesService.getXPValue('profile', 'company_added');
    }
    
    // Profile completion bonus (all fields completed)
    const allFieldsCompleted = (
      profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com') &&
      profile.phone && profile.phone.length >= 10 &&
      profile.profession && profile.profession.trim().length > 0 &&
      profile.company && profile.company.trim().length > 0
    );
    
    if (allFieldsCompleted) {
      totalXP += await XPRulesService.getXPValue('profile', 'completion_bonus');
    }
    
    return totalXP;
  } catch (error) {
    log.error('Error calculating total profile XP:', error);
    throw error;
  }
};

/**
 * Toast Notification Functions for XP Rewards
 */
export const showXPRewardNotification = (action: string, points: number, description?: string) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
        <Icon name="Zap" size={16} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-text-primary">
          +{points} XP gagnés !
        </div>
        <div className="text-sm text-text-secondary">
          {action} {description && `• ${description}`}
        </div>
      </div>
    </div>,
    {
      duration: 5000,
      position: 'top-right',
      className: 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200',
    }
  );
};

export const showLevelUpNotification = (newLevel: number, totalXP: number) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
        <Icon name="Trophy" size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-lg text-text-primary">
          🎉 Niveau {newLevel} atteint !
        </div>
        <div className="text-sm text-text-secondary">
          Vous avez maintenant {totalXP} XP au total
        </div>
      </div>
    </div>,
    {
      duration: 8000,
      position: 'top-center',
      className: 'bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20',
    }
  );
};

export const showProfileCompletionReward = async (earnedXP: number) => {
  try {
    const bonusXP = await XPRulesService.getXPValue('profile', 'completion_bonus');
    
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="CheckCircle" size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-text-primary">
            🏆 Profil Complet !
          </div>
          <div className="text-sm text-text-secondary">
            +{earnedXP} XP gagnés + {bonusXP} XP de bonus
          </div>
        </div>
      </div>,
      {
        duration: 10000,
        position: 'top-center',
        className: 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200',
      }
    );
  } catch (error) {
    log.error('Error showing profile completion reward:', error);
    // Fallback notification sans bonus
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="CheckCircle" size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-text-primary">
            🏆 Profil Complet !
          </div>
          <div className="text-sm text-text-secondary">
            +{earnedXP} XP gagnés
          </div>
        </div>
      </div>
    );
  }
};

/**
 * Action XP Badge Component
 */
interface ActionXPBadgeProps {
  xpValue: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
  showIcon?: boolean;
}

export const ActionXPBadge: React.FC<ActionXPBadgeProps> = ({ 
  xpValue, 
  size = 'md', 
  variant = 'default',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-700',
    warning: 'bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 text-amber-700'
  };

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  return (
    <div className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {showIcon && <Icon name="Zap" size={iconSize} />}
      <span>+{xpValue} XP</span>
    </div>
  );
};