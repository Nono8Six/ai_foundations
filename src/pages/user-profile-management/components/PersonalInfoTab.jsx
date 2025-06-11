import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PersonalInfoTab = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userData.avatar);
  const { updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      profession: userData.profession || '',
      company: userData.company || '',
    },
  });

  const onSubmit = async data => {
    try {
      setIsSubmitting(true);
      
      // Prepare the update data
      const updates = {
        full_name: data.name,
        // We don't update email here as it's managed by auth
        // Add other fields if they're added to the profiles table
      };
      
      // Update the profile in Supabase
      await updateProfile(updates);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    reset();
    setAvatarPreview(userData.avatar);
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
            <Icon name='Edit' size={16} className='mr-2' />
            Modifier
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
                  <Icon name='Camera' size={12} />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />
                </label>
              )}
            </div>
            <div>
              <p className='text-sm text-text-primary font-medium mb-1'>
                {isEditing ? 'Choisissez une nouvelle photo de profil' : 'Votre photo de profil'}
              </p>
              <p className='text-xs text-text-secondary'>
                {isEditing ? 'JPG, PNG ou GIF. Taille maximale de 2MB.' : 'Utilisée pour personnaliser votre expérience'}
              </p>
            </div>
          </div>
        </div>

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
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              } ${errors.name ? 'border-error' : ''}`}
            />
            {errors.name && <p className='mt-1 text-xs text-error'>{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>
              Adresse e-mail *
            </label>
            <input
              type='email'
              {...register('email', {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse e-mail invalide',
                },
              })}
              disabled={true} // Email is always disabled as it's managed by auth
              className='w-full px-3 py-2 border border-transparent bg-secondary-50 text-text-secondary rounded-lg text-sm'
            />
            {errors.email && <p className='mt-1 text-xs text-error'>{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>Téléphone</label>
            <input
              type='tel'
              {...register('phone')}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              }`}
            />
          </div>

          {/* Profession */}
          <div>
            <label className='block text-sm font-medium text-text-primary mb-2'>Profession</label>
            <input
              type='text'
              {...register('profession')}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              }`}
            />
          </div>

          {/* Company */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-text-primary mb-2'>Entreprise</label>
            <input
              type='text'
              {...register('company')}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                isEditing
                  ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary bg-surface'
                  : 'border-transparent bg-secondary-50 text-text-secondary'
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className='flex items-center justify-end space-x-4 pt-6 border-t border-border'>
            <button
              type='button'
              onClick={handleCancel}
              className='px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary-50 transition-colors'
            >
              Annuler
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50'
            >
              {isSubmitting && <Icon name='Loader2' size={16} className='mr-2 animate-spin' />}
              Enregistrer
            </button>
          </div>
        )}
      </form>

      {/* Account Information */}
      <div className='bg-secondary-50 rounded-lg p-6'>
        <h4 className='text-base font-medium text-text-primary mb-4'>Informations du compte</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-text-secondary'>Date d'inscription:</span>
            <span className='ml-2 text-text-primary font-medium'>
              {new Date(userData.joinDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div>
            <span className='text-text-secondary'>Statut du compte:</span>
            <span className='ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700'>
              <Icon name='CheckCircle' size={12} className='mr-1' />
              Actif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;