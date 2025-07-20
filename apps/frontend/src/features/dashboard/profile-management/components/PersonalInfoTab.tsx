import React, { useState, ChangeEvent } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { updateUserProfile } from '@shared/services/userService';
import Icon from '@shared/components/AppIcon';
import Image from '@shared/components/AppImage';
import PhoneInput from '@shared/components/PhoneInput';
import { validateAndFormatFrenchPhone, cleanPhoneForStorage } from '@shared/utils/phoneFormatter';
import { log } from '@libs/logger';

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
    joinDate?: string; // Added missing joinDate property
  };
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(userData.avatar);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      profession: userData.profession || '',
      company: userData.company || '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);

      // Le téléphone est optionnel, ne pas bloquer la sauvegarde

      // Prepare the update data
      const updates = {
        full_name: data.name,
        phone: data.phone ? cleanPhoneForStorage(data.phone) : null,
        profession: data.profession || null,
        company: data.company || null,
        // Add avatar_url if it was changed
        ...(avatarPreview !== userData.avatar && { avatar_url: avatarPreview }),
      };

      log.debug('Submitting profile updates', { updates });

      // Update the profile in Supabase using service
      await updateUserProfile(userData.id, updates);

      log.info('Profile updated successfully', { userId: userData.id });
      setIsEditing(false);

      // Show success message
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      log.error('Error updating profile', { error, userId: userData.id });
      setError('root', {
        type: 'manual',
        message: 'Erreur lors de la mise à jour du profil. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La taille du fichier ne doit pas dépasser 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image valide');
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

  const handleCancel = () => {
    reset();
    setAvatarPreview(userData.avatar);
    clearErrors();
    setIsEditing(false);
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Informations personnelles</h3>
          <p className='text-text-secondary text-sm mt-1'>
            Gérez vos informations de profil et vos préférences de compte
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary bg-surface hover:bg-secondary-50 transition-colors'
          >
            <Icon aria-hidden='true' name='Edit' size={16} className='mr-2' />
            Modifier
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' autoComplete="off">
        {/* Champs cachés pour confondre l'autofill */}
        <div style={{ display: 'none' }}>
          <input type="text" name="username" autoComplete="username" />
          <input type="password" name="password" autoComplete="current-password" />
        </div>
        
        {/* Avatar Upload */}
        <div className='bg-secondary-50 rounded-lg p-6'>
          <h4 className='text-base font-medium text-text-primary mb-4'>Photo de profil</h4>
          <div className='flex items-center space-x-6'>
            <div className='relative'>
              <div className='w-20 h-20 rounded-full overflow-hidden'>
                <Image
                  src={avatarPreview}
                  alt='Avatar preview'
                  className='w-full h-full object-cover'
                />
              </div>
              {isEditing && (
                <label className='absolute bottom-0 right-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors'>
                  <Icon aria-hidden='true' name='Camera' size={12} />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                    autoComplete="off"
                  />
                </label>
              )}
            </div>
            <div>
              <p className='text-sm text-text-primary font-medium mb-1'>
                {isEditing ? 'Choisissez une nouvelle photo de profil' : 'Votre photo de profil'}
              </p>
              <p className='text-xs text-text-secondary'>
                {isEditing
                  ? 'JPG, PNG ou GIF. Taille maximale de 2MB.'
                  : 'Utilisée pour personnaliser votre expérience'}
              </p>
            </div>
          </div>
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
              disabled={!isEditing}
              autoComplete="name"
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
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
              {isEditing && (
                <span className='text-xs text-text-secondary ml-1 font-normal'>
                  (Format français)
                </span>
              )}
            </label>
            {isEditing ? (
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue('phone', value);
                    }}
                    disabled={false}
                    showValidationIcon={true}
                    showTypeHint={true}
                    className="focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                )}
              />
            ) : (
              <input
                type='tel'
                value={userData.phone ? validateAndFormatFrenchPhone(userData.phone).formatted : ''}
                disabled={true}
                autoComplete="tel"
                className='w-full px-3 py-2 border border-transparent bg-secondary-50 text-text-secondary rounded-lg text-sm'
                placeholder='Aucun numéro renseigné'
              />
            )}
          </div>

          {/* Profession */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>Profession</label>
            <input
              type='text'
              {...register('profession')}
              disabled={!isEditing}
              autoComplete="organization-title"
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              }`}
              placeholder='Ex: Développeur, Comptable, etc.'
            />
          </div>

          {/* Company */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-text-primary mb-2'>Entreprise</label>
            <input
              type='text'
              {...register('company')}
              disabled={!isEditing}
              autoComplete="organization"
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              }`}
              placeholder='Ex: Mon Entreprise SARL'
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
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
