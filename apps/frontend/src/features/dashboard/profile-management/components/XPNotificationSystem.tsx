import React from 'react';
import { toast } from 'sonner';
import Icon from '@shared/components/AppIcon';

/**
 * XP Point System - Points awarded for profile completion actions
 */
export const XP_REWARDS = {
  AVATAR_UPLOAD: 15,
  PHONE_ADDED: 10,
  PROFESSION_ADDED: 10,
  COMPANY_ADDED: 5,
  PROFILE_COMPLETION_BONUS: 20, // Bonus when profile is 100% complete
} as const;

/**
 * XP Calculation Functions
 */
export const calculateXPReward = (field: keyof typeof XP_REWARDS): number => {
  return XP_REWARDS[field];
};

export const calculateTotalProfileXP = (profile: {
  avatar_url?: string | null;
  phone?: string | null;
  profession?: string | null;
  company?: string | null;
}): number => {
  let totalXP = 0;
  
  // Avatar upload XP
  if (profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com')) {
    totalXP += XP_REWARDS.AVATAR_UPLOAD;
  }
  
  // Phone XP
  if (profile.phone && profile.phone.length >= 10) {
    totalXP += XP_REWARDS.PHONE_ADDED;
  }
  
  // Profession XP
  if (profile.profession && profile.profession.trim().length > 0) {
    totalXP += XP_REWARDS.PROFESSION_ADDED;
  }
  
  // Company XP
  if (profile.company && profile.company.trim().length > 0) {
    totalXP += XP_REWARDS.COMPANY_ADDED;
  }
  
  // Completion bonus if all fields are filled
  const hasAvatar = profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com');
  const hasPhone = profile.phone && profile.phone.length >= 10;
  const hasProfession = profile.profession && profile.profession.trim().length > 0;
  const hasCompany = profile.company && profile.company.trim().length > 0;
  
  if (hasAvatar && hasPhone && hasProfession && hasCompany) {
    totalXP += XP_REWARDS.PROFILE_COMPLETION_BONUS;
  }
  
  return totalXP;
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
          Total: {totalXP} XP • Continuez sur votre lancée !
        </div>
      </div>
    </div>,
    {
      duration: 8000,
      position: 'top-center',
      className: 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg',
    }
  );
};

/**
 * Action XP Display Component
 */
interface ActionXPBadgeProps {
  action: keyof typeof XP_REWARDS;
  completed?: boolean;
  className?: string;
}

export const ActionXPBadge: React.FC<ActionXPBadgeProps> = ({ 
  action, 
  completed = false, 
  className = '' 
}) => {
  const points = XP_REWARDS[action];
  
  return (
    <div 
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
        completed 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200'
      } ${className}`}
    >
      <Icon 
        name={completed ? "Check" : "Zap"} 
        size={12} 
        className={completed ? "text-green-600" : "text-primary-600"} 
      />
      <span>{completed ? "Gagné" : `+${points}`} XP</span>
    </div>
  );
};

/**
 * XP Progress Indicator Component
 */
interface XPProgressIndicatorProps {
  currentXP: number;
  currentLevel: number;
  nextLevelXP: number;
  className?: string;
}

export const XPProgressIndicator: React.FC<XPProgressIndicatorProps> = ({ 
  currentXP, 
  currentLevel, 
  nextLevelXP,
  className = '' 
}) => {
  const progressPercentage = Math.min((currentXP / nextLevelXP) * 100, 100);
  const xpToNext = Math.max(nextLevelXP - currentXP, 0);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon name="Trophy" size={16} className="text-accent" />
          <span className="font-medium text-text-primary">Niveau {currentLevel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="font-medium text-text-primary">{currentXP.toLocaleString()} XP</span>
        </div>
      </div>
      
      <div className="relative w-full bg-secondary-200 rounded-full h-2">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>{currentXP} XP</span>
        <span>{xpToNext > 0 ? `${xpToNext} XP vers niveau ${currentLevel + 1}` : `Niveau ${currentLevel} atteint !`}</span>
        <span>{nextLevelXP} XP</span>
      </div>
    </div>
  );
};

export default {
  XP_REWARDS,
  calculateXPReward,
  calculateTotalProfileXP,
  showXPRewardNotification,
  showLevelUpNotification,
  ActionXPBadge,
  XPProgressIndicator,
};