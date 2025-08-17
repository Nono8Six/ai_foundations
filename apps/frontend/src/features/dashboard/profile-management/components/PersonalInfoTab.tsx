import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { updateUserProfile } from '@shared/services/userService';
import Icon from '@shared/components/AppIcon';
import PhoneInput from '@shared/components/PhoneInput';
import { validateAndFormatFrenchPhone, cleanPhoneForStorage } from '@shared/utils/phoneFormatter';
import { log } from '@libs/logger';
import { useAuth } from '@features/auth/contexts/AuthContext';
// import ProfileCompletionGamification from './ProfileCompletionGamification';
import { showXPRewardNotification, showLevelUpNotification } from './XPNotificationSystem';
import { XPRpc, XPError, makeIdempotencyKey } from '@shared/services/xp-rpc';
// import { useIdempotentXPAction } from '@shared/hooks/useIdempotentAction';
import type { UserProfile } from '@frontend/types/user';

// Component to dynamically display XP value for a specific action
const DynamicXPBadge: React.FC<{ sourceType: string; actionType: string; fallback?: number }> = ({ 
  sourceType, 
  actionType, 
  fallback = 0 
}) => {
  const [xpValue, setXpValue] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchXPValue() {
      try {
        setLoading(true);
        const value = await XPRpc.getXPValue(sourceType, actionType);
        setXpValue(value);
      } catch (error) {
        if (error instanceof XPError && error.isCode('xp_rule_missing')) {
          setXpValue(fallback);
        } else {
          log.error(`Error fetching XP value for ${sourceType}:${actionType}:`, error);
          setXpValue(fallback);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchXPValue();
  }, [sourceType, actionType, fallback]);

  if (loading) {
    return <span>(...)</span>;
  }

  return <span>{xpValue}</span>;
};

// Component to dynamically calculate profile completion XP total
const ProfileXPTotal: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [totalXP, setTotalXP] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function calculateTotalXP() {
      try {
        setLoading(true);
        let total = 0;
        
        // Check each profile field and get XP value from RPC
        const hasCustomAvatar = profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com');
        
        if (hasCustomAvatar) {
          const avatarXP = await XPRpc.getXPValue('profile', 'avatar_upload');
          total += avatarXP;
        }
        
        if (profile.phone) {
          const phoneXP = await XPRpc.getXPValue('profile', 'phone_added');
          total += phoneXP;
        }
        
        if (profile.profession) {
          const professionXP = await XPRpc.getXPValue('profile', 'profession_added');
          total += professionXP;
        }
        
        if (profile.company) {
          const companyXP = await XPRpc.getXPValue('profile', 'company_added');
          total += companyXP;
        }
        
        // Check for completion bonus if all fields are filled
        if (hasCustomAvatar && profile.phone && profile.profession && profile.company) {
          try {
            const bonusXP = await XPRpc.getXPValue('profile', 'completion_bonus');
            total += bonusXP;
          } catch (error) {
            // Completion bonus might not exist, continue without it
            if (error instanceof XPError && !error.isCode('xp_rule_missing')) {
              throw error;
            }
          }
        }
        
        setTotalXP(total);
      } catch (error) {
        log.error('Error calculating profile XP total:', error);
        setTotalXP(0); // Fallback to 0 on error
      } finally {
        setLoading(false);
      }
    }

    calculateTotalXP();
  }, [profile.avatar_url, profile.phone, profile.profession, profile.company]);

  if (loading) {
    return (
      <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold'>
        Calcul...
      </span>
    );
  }

  return (
    <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold'>
      {totalXP} XP total
    </span>
  );
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  profession: string;
  company: string;
}

export interface PersonalInfoTabProps {
  userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    phone?: string | null;
    profession?: string | null;
    company?: string | null;
    joinDate?: string;
  };
  profile?: UserProfile;
  isEditingFromHero?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  avatarPreview?: string;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ 
  userData, 
  profile,
  isEditingFromHero = false, 
  onEditingChange,
  avatarPreview: externalAvatarPreview
}) => {
  const { refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string>(userData.avatar);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Remove custom refs since react-hook-form provides its own refs
  
  // Use external editing state if provided, otherwise use internal state
  const effectiveIsEditing = isEditingFromHero !== undefined ? isEditingFromHero : isEditing;
  const effectiveAvatarPreview = externalAvatarPreview || localAvatarPreview;
  
  // Sync with external editing state
  React.useEffect(() => {
    if (isEditingFromHero !== undefined) {
      setIsEditing(isEditingFromHero);
    }
  }, [isEditingFromHero]);
  
  // Handle field focus from gamification
  const handleFieldFocus = (fieldName: string, points: number) => {
    if (!effectiveIsEditing && onEditingChange) {
      onEditingChange(true);
    } else if (!effectiveIsEditing) {
      setIsEditing(true);
    }
    
    setFocusedField(fieldName);
    
    // Focus the field after a short delay to allow for state updates
    setTimeout(() => {
      if (fieldName === 'phone' || fieldName === 'profession' || fieldName === 'company') {
        setFocus(fieldName as keyof FormData);
      }
    }, 300);
    
    // Show toast with gamification message
    import('sonner').then(({ toast }) => {
      toast.success(`🎯 Complétez ce champ pour gagner +${points} XP !`, {
        duration: 4000,
        description: 'Chaque information ajoutée améliore votre profil'
      });
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
    setValue,
    clearErrors,
    setFocus,
  } = useForm<FormData>({
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone ?? '',
      profession: userData.profession ?? '',
      company: userData.company ?? '',
    },
  });

  // Removed idempotent action wrapper for simplicity - can be re-added later

  // Update form values when userData changes - AFTER useForm initialization
  React.useEffect(() => {
    if (userData.name) { // Only reset when userData is loaded
      reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone ?? '',
        profession: userData.profession ?? '',
        company: userData.company ?? '',
      });
    }
  }, [userData.name, userData.email, userData.phone, userData.profession, userData.company, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
      try {
        setIsSubmitting(true);

        // Le téléphone est optionnel, ne pas bloquer la sauvegarde

      // Prepare the update data - Normalize strings and avoid empty strings in DB
      const updates = {
        full_name: data.name.trim(),
        phone: data.phone?.trim() ? cleanPhoneForStorage(data.phone.trim()) : null,
        profession: data.profession?.trim() || null,
        company: data.company?.trim() || null,
        // Add avatar_url if it was changed
        ...(effectiveAvatarPreview !== userData.avatar && { avatar_url: effectiveAvatarPreview }),
      };

      log.debug('🚀 Starting profile update submission');
      log.debug('📝 Form data received:', { data });
      log.debug('👤 Current userData:', { userData });
      log.debug('💾 Updates to be sent:', { updates });
      

      // Track what fields are being changed for better feedback
      const changedFields = [];
      
      // Normalize values for comparison - handle null vs empty string issues
      const normalizeValue = (value: string | null | undefined) => {
        return value?.trim() || null;
      };
      
      // Current vs new values (normalized)
      const currentValues = {
        name: userData.name || '',
        phone: normalizeValue(userData.phone),
        profession: normalizeValue(userData.profession),
        company: normalizeValue(userData.company)
      };
      
      const newValues = {
        name: data.name.trim(),
        phone: normalizeValue(data.phone),
        profession: normalizeValue(data.profession),
        company: normalizeValue(data.company)
      };
      
      // Detailed comparison logging
      log.debug('🔍 COMPARISON ANALYSIS:');
      log.debug('Current values:', currentValues);
      log.debug('New values:', newValues);
      
      
      if (newValues.name !== currentValues.name) {
        changedFields.push('Nom');
        log.debug('✅ Name changed:', currentValues.name, '→', newValues.name);
      }
      if (newValues.phone !== currentValues.phone) {
        changedFields.push('Téléphone');
        log.debug('✅ Phone changed:', currentValues.phone, '→', newValues.phone);
      }
      if (newValues.profession !== currentValues.profession) {
        changedFields.push('Profession');
        log.debug('✅ Profession changed:', currentValues.profession, '→', newValues.profession);
      }
      if (newValues.company !== currentValues.company) {
        changedFields.push('Entreprise');
        log.debug('✅ Company changed:', currentValues.company, '→', newValues.company);
      }

      log.debug('🔄 Final changed fields detected:', { changedFields });
      

      // Update the profile in Supabase using service
      const updatedProfile = await updateUserProfile(userData.id, updates);
      log.debug('✅ Profile update completed:', { updatedProfile });
      
      // Verify the update was successful by checking the returned data
      if (updatedProfile) {
        log.debug('📊 Verification - Updated profile contains:', {
          profession: updatedProfile.profession,
          company: updatedProfile.company,
          professionFilled: !!updatedProfile.profession,
          companyFilled: !!updatedProfile.company
        });
      }

      log.info('Profile updated successfully', { userId: userData.id });
      
      // Update editing state
      if (onEditingChange) {
        onEditingChange(false);
      } else {
        setIsEditing(false);
      }

      // Force profile refresh and update form with new data
      try {
        log.debug('🔄 Refreshing user profile after successful update...');
        await refreshUserProfile();
        log.debug('✅ User profile refreshed successfully after update');
        
        // Force form reset with updated values after a short delay to ensure context update
        setTimeout(() => {
          log.debug('🔁 Forcing form reset with saved values');
          // Use the updatedProfile data to reset the form with the actual saved values
          if (updatedProfile) {
            reset({
              name: updatedProfile.full_name || userData.name,
              email: updatedProfile.email || userData.email, 
              phone: updatedProfile.phone || '',
              profession: updatedProfile.profession || '',
              company: updatedProfile.company || ''
            });
            log.debug('✅ Form reset with updated profile data');
          }
        }, 500);
        
      } catch (refreshError) {
        log.warn('⚠️ Failed to refresh profile, forcing hard refresh:', refreshError);
        // Show warning toast but still try to continue
        toast.warning('Rafraîchissement échoué', {
          description: 'La page va se recharger pour afficher les modifications'
        });
        
        // Fallback to page reload after showing the success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      
      // Show XP notifications for newly completed fields (RPC-only approach)
      const isPhoneCompleted = !userData.phone && data.phone;
      const isProfessionCompleted = !userData.profession && data.profession;
      const isCompanyCompleted = !userData.company && data.company;
      const isAvatarCompleted = effectiveAvatarPreview !== userData.avatar && !effectiveAvatarPreview.includes('ui-avatars.com');
      
      let totalXPEarned = 0;
      const actionsCompleted = [];
      
      // Get XP values from RPC (NO hardcoded values)
      try {
        if (isPhoneCompleted) {
          const phoneXP = await XPRpc.getXPValue('profile', 'phone_added');
          totalXPEarned += phoneXP;
          actionsCompleted.push('Téléphone ajouté');
          showXPRewardNotification('Téléphone ajouté', phoneXP, 'Communication facilitée');
        }
        
        if (isProfessionCompleted) {
          const professionXP = await XPRpc.getXPValue('profile', 'profession_added');
          totalXPEarned += professionXP;
          actionsCompleted.push('Profession renseignée');
          showXPRewardNotification('Profession renseignée', professionXP, 'Profil professionnel enrichi');
        }
        
        if (isCompanyCompleted) {
          const companyXP = await XPRpc.getXPValue('profile', 'company_added');
          totalXPEarned += companyXP;
          actionsCompleted.push('Entreprise précisée');
          showXPRewardNotification('Entreprise précisée', companyXP, 'Expérience professionnelle détaillée');
        }
        
        if (isAvatarCompleted) {
          const avatarXP = await XPRpc.getXPValue('profile', 'avatar_upload');
          totalXPEarned += avatarXP;
          actionsCompleted.push('Photo de profil ajoutée');
          showXPRewardNotification('Photo de profil ajoutée', avatarXP, 'Profil personnalisé');
        }
        
        // Check for level up using RPC (NO hardcoded 100 XP per level)
        if (totalXPEarned > 0) {
          const oldLevel = profile?.level || 1;
          const oldXP = profile?.xp || 0;
          const newXP = oldXP + totalXPEarned;
          
          const newLevelInfo = await XPRpc.computeLevelInfo(newXP);
          
          if (newLevelInfo.level > oldLevel) {
            setTimeout(() => {
              showLevelUpNotification(newLevelInfo.level, newXP);
            }, 1500);
          }
        }
        
      } catch (error) {
        if (error instanceof XPError && error.isCode('xp_rule_missing')) {
          // Rule missing - explicit error, no fallback
          log.error('XP rule missing for profile action:', error.details);
          toast.error('Configuration XP manquante', {
            description: 'Veuillez configurer les règles XP dans la table xp_sources'
          });
        } else {
          log.error('Error calculating XP rewards:', error);
          toast.error('Erreur XP', {
            description: 'Impossible de calculer les récompenses XP'
          });
        }
      }
      
      // Enhanced success toast with field changes and XP
      if (actionsCompleted.length > 0) {
        toast.success('🎉 Profil mis à jour avec succès !', {
          description: `${actionsCompleted.join(', ')} • +${totalXPEarned} XP gagnés !`
        });
      } else if (changedFields.length > 0) {
        toast.success('✅ Profil mis à jour avec succès', {
          description: `Champs modifiés: ${changedFields.join(', ')}`
        });
      } else {
        // Even if no changes detected, the form was submitted so show success
        // This handles edge cases where detection logic might fail
        toast.success('✅ Profil sauvegardé avec succès', {
          description: 'Modifications enregistrées'
        });
        log.warn('⚠️ No changes detected but form was submitted - possible detection logic issue');
      }
    } catch (error) {
      log.error('Error updating profile', { error, userId: userData.id });
      setError('root', {
        type: 'manual',
        message: 'Erreur lors de la mise à jour du profil. Veuillez réessayer.',
      });
      throw error; // Re-throw for idempotent action error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avatar change is now handled by parent component via externalOnAvatarChange

  const handleCancel = () => {
    reset();
    setLocalAvatarPreview(userData.avatar);
    clearErrors();
    
    if (onEditingChange) {
      onEditingChange(false);
    } else {
      setIsEditing(false);
    }
  };

  // Helper function to determine if field should be highlighted
  const getFieldHighlightClass = (fieldName: string) => {
    const isHighlighted = focusedField === fieldName;
    const baseClass = effectiveIsEditing
      ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
      : 'border-transparent bg-secondary-50 text-text-secondary';
    
    if (isHighlighted && effectiveIsEditing) {
      return 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-lg transform scale-[1.02] transition-all duration-300';
    }
    
    return `${baseClass  } transition-all duration-300`;
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-text-primary'>Informations personnelles</h3>
        <p className='text-text-secondary text-sm mt-1'>
          Gérez vos informations de profil et vos préférences de compte
        </p>
      </div>
      
      {/* Gamification Section - Show completion helper when editing */}
      {effectiveIsEditing && profile && (() => {
        // Calculer les champs manquants
        const missingFields = [];
        const hasCustomAvatar = profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com');
        
        if (!profile.phone) missingFields.push({ key: 'phone', label: 'Téléphone', sourceType: 'profile', actionType: 'phone_added', icon: 'Phone' });
        if (!profile.profession) missingFields.push({ key: 'profession', label: 'Profession', sourceType: 'profile', actionType: 'profession_added', icon: 'Briefcase' });
        if (!profile.company) missingFields.push({ key: 'company', label: 'Entreprise', sourceType: 'profile', actionType: 'company_added', icon: 'Building' });
        if (!hasCustomAvatar) missingFields.push({ key: 'avatar', label: 'Photo de profil', sourceType: 'profile', actionType: 'avatar_upload', icon: 'Camera' });

        // Si le profil est complet, afficher un message de félicitations
        if (missingFields.length === 0) {
          return (
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Icon name='Trophy' size={20} className='text-green-600' />
                <h4 className='text-base font-semibold text-text-primary'>
                  🎉 Profil complet !
                </h4>
              </div>
              <p className='text-sm text-green-700 mb-3'>
                Félicitations ! Votre profil est maintenant complet à 100%. Vous gagnez le maximum d'XP pour votre profil !
              </p>
              <div className='flex items-center gap-2 text-sm text-green-600'>
                <Icon name='Award' size={16} className='text-green-600' />
                <span className='font-medium'>Profil complet</span>
                <ProfileXPTotal profile={profile} />
              </div>
            </div>
          );
        }

        // Sinon, afficher les améliorations disponibles
        return (
          <div className='bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Icon name='Target' size={20} className='text-orange-500' />
              <h4 className='text-base font-semibold text-text-primary'>
                Améliorations disponibles ({missingFields.length} restant{missingFields.length > 1 ? 's' : ''})
              </h4>
            </div>
            <p className='text-sm text-text-secondary mb-4'>
              Complétez les champs suivants pour gagner plus d'XP et améliorer votre profil :
            </p>
            <div className='flex flex-wrap gap-2'>
              {missingFields.filter(field => field.key !== 'avatar').map(field => (
                <button
                  key={field.key}
                  onClick={() => handleFieldFocus(field.key, 0)} // XP value passed as 0 since it's dynamic
                  className='inline-flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg border border-orange-100 hover:border-orange-200 hover:bg-white transition-all text-sm'
                >
                  <Icon name={field.icon} size={14} className='text-orange-600' />
                  <span>{field.label} (+<DynamicXPBadge sourceType={field.sourceType} actionType={field.actionType} fallback={10} /> XP)</span>
                </button>
              ))}
              {missingFields.find(field => field.key === 'avatar') && (
                <div className='inline-flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg border border-orange-100 text-sm opacity-75'>
                  <Icon name='Camera' size={14} className='text-orange-600' />
                  <span>Photo de profil (+<DynamicXPBadge sourceType="profile" actionType="avatar_upload" fallback={15} /> XP)</span>
                  <span className='text-xs text-gray-500'>(via bouton modifier)</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' autoComplete="off">
        {/* Champs cachés pour confondre l'autofill */}
        <div style={{ display: 'none' }}>
          <input type="text" name="username" autoComplete="username" />
          <input type="password" name="password" autoComplete="current-password" />
        </div>
        

        {/* Error Message */}
        {errors.root && (
          <div className='bg-error-50 border border-error-200 rounded-lg p-4'>
            <div className='flex items-center'>
              <Icon aria-hidden='true' name='AlertCircle' size={20} className='text-error mr-2' />
              <p className='text-sm text-error-700'>{errors.root.message}</p>
            </div>
          </div>
        )}

        {/* Personal Information Form */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>
              Nom complet *
            </label>
            <input
              type='text'
              {...register('name', {
                required: 'Le nom est requis',
                minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' },
              })}
              disabled={!effectiveIsEditing}
              autoComplete="name"
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                effectiveIsEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              } ${errors.name ? 'border-error' : ''}`}
            />
            {errors.name && (
              <p className='mt-1 text-xs text-error'>
                {errors.name.message as React.ReactNode}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>
              Adresse e-mail *
            </label>
            <input
              type='email'
              {...register('email')}
              disabled={true} // Email is always disabled as it's managed by auth
              autoComplete="email"
              className='w-full px-3 py-2 border border-transparent bg-secondary-50 text-text-secondary rounded-lg text-sm'
            />
            <p className='mt-1 text-xs text-text-secondary'>L&rsquo;email ne peut pas être modifié ici</p>
          </div>

          {/* Phone */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>
              Téléphone
              {effectiveIsEditing && (
                <span className='text-xs text-text-secondary ml-1 font-normal'>
                  (Format français)
                </span>
              )}
            </label>
            {effectiveIsEditing ? (
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <div className={focusedField === 'phone' ? 'transform scale-[1.02] transition-all duration-300' : 'transition-all duration-300'}>
                    <PhoneInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue('phone', value);
                        if (focusedField === 'phone') {
                          setFocusedField(null); // Clear highlight when user starts typing
                        }
                      }}
                      disabled={false}
                      showValidationIcon={true}
                      showTypeHint={true}
                      className={focusedField === 'phone' 
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-lg'
                        : 'focus:border-primary focus:ring-1 focus:ring-primary'
                      }
                    />
                  </div>
                )}
              />
            ) : (
              <div className='w-full px-3 py-2 border border-transparent bg-secondary-50 rounded-lg text-sm min-h-[38px] flex items-center'>
                {userData.phone ? (
                  <div className="flex items-center gap-2">
                    <Icon name="Phone" size={14} className="text-text-tertiary" />
                    <span className="font-mono tracking-wide text-text-primary">
                      {validateAndFormatFrenchPhone(userData.phone).formatted}
                    </span>
                    <span className="text-xs text-success bg-success-50 px-2 py-1 rounded-full">
                      Vérifié
                    </span>
                  </div>
                ) : (
                  <span className="text-text-tertiary italic">Aucun numéro renseigné</span>
                )}
              </div>
            )}
          </div>

          {/* Profession */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>Profession</label>
            {effectiveIsEditing ? (
              <input
                type='text'
                {...register('profession')}
                autoComplete="organization-title"
                onFocus={() => setFocusedField(null)} // Clear highlight when user focuses
                className={`w-full px-3 py-2 border rounded-lg text-sm ${getFieldHighlightClass('profession')}`}
                placeholder='Ex: Développeur, Comptable, etc.'
              />
            ) : (
              <div className='w-full px-3 py-2 border border-transparent bg-secondary-50 rounded-lg text-sm min-h-[38px] flex items-center'>
                {userData.profession ? (
                  <div className="flex items-center gap-2">
                    <Icon name="Briefcase" size={14} className="text-text-tertiary" />
                    <span className="text-text-primary">{userData.profession}</span>
                  </div>
                ) : userData.profession === '' ? (
                  <span className="text-amber-600 italic flex items-center gap-1">
                    <Icon name="AlertTriangle" size={12} />
                    Champ vide (à compléter)
                  </span>
                ) : (
                  <span className='text-text-tertiary italic'>Ex: Développeur, Comptable, etc.</span>
                )}
              </div>
            )}
          </div>

          {/* Company */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-text-primary mb-2'>Entreprise</label>
            {effectiveIsEditing ? (
              <input
                type='text'
                {...register('company')}
                autoComplete="organization"
                onFocus={() => setFocusedField(null)} // Clear highlight when user focuses
                className={`w-full px-3 py-2 border rounded-lg text-sm ${getFieldHighlightClass('company')}`}
                placeholder='Ex: Mon Entreprise SARL'
              />
            ) : (
              <div className='w-full px-3 py-2 border border-transparent bg-secondary-50 rounded-lg text-sm min-h-[38px] flex items-center'>
                {userData.company ? (
                  <div className="flex items-center gap-2">
                    <Icon name="Building" size={14} className="text-text-tertiary" />
                    <span className="text-text-primary">{userData.company}</span>
                  </div>
                ) : userData.company === '' ? (
                  <span className="text-amber-600 italic flex items-center gap-1">
                    <Icon name="AlertTriangle" size={12} />
                    Champ vide (à compléter)
                  </span>
                ) : (
                  <span className='text-text-tertiary italic'>Ex: Mon Entreprise SARL</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {effectiveIsEditing && (
          <div className='flex items-center justify-end space-x-4 pt-6 border-t border-border'>
            <button
              type='button'
              onClick={handleCancel}
              disabled={isSubmitting}
              className='px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary-50 transition-colors disabled:opacity-50'
            >
              Annuler
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50'
            >
              {isSubmitting && (
                <Icon aria-hidden='true' name='Loader2' size={16} className='mr-2 animate-spin' />
              )}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        )}
      </form>

      {/* Account Information */}
      <div className='bg-secondary-50 rounded-lg p-6'>
        <h4 className='text-base font-medium text-text-primary mb-4'>Informations du compte</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-text-secondary'>Date d&rsquo;inscription:</span>
            <span className='ml-2 text-text-primary font-medium'>
              {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('fr-FR') : 'Non disponible'}
            </span>
          </div>
          <div>
            <span className='text-text-secondary'>Statut du compte:</span>
            <span className='ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700'>
              <Icon aria-hidden='true' name='CheckCircle' size={12} className='mr-1' />
              Actif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
