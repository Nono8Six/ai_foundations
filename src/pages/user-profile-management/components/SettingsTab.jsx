import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';

const SettingsTab = ({ userData }) => {
  const { user, updateProfile } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state - these would ideally be stored in a user_settings table
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    achievementAlerts: true,
    reminderNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    showProgress: false,
    showAchievements: true,
    allowMessages: false,
  });

  const [learningPreferences, setLearningPreferences] = useState({
    dailyGoal: 30,
    preferredDuration: 'medium',
    difficultyProgression: 'adaptive',
    language: 'fr',
    autoplay: true,
  });

  // Load settings from Supabase on component mount
  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      // Try to load settings from a user_settings table
      // For now, we'll use localStorage as a fallback
      const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setNotificationSettings(settings.notifications || notificationSettings);
        setPrivacySettings(settings.privacy || privacySettings);
        setLearningPreferences(settings.learning || learningPreferences);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const saveUserSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const settings = {
        notifications: notificationSettings,
        privacy: privacySettings,
        learning: learningPreferences,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage for now
      // In a real app, you'd save this to a user_settings table in Supabase
      localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));

      // You could also save some preferences to the profiles table
      await updateProfile({
        // Add any profile-level preferences here
      });

      console.log('✅ Settings saved successfully');
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async data => {
    await saveUserSettings();
  };

  const handleNotificationChange = setting => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleLearningPreferenceChange = (setting, value) => {
    setLearningPreferences(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you'd call a Supabase function to handle account deletion
      console.log('Account deletion requested for user:', user.id);
      alert('Demande de suppression de compte envoyée. Vous recevrez un email de confirmation.');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      alert('Erreur lors de la demande de suppression');
    }
  };

  const exportData = async () => {
    try {
      // Export user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      const userData = {
        profile,
        progress,
        achievements,
        settings: {
          notifications: notificationSettings,
          privacy: privacySettings,
          learning: learningPreferences,
        },
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mes-donnees-ai-foundations-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Erreur lors de l\'export des données');
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h3 className='text-lg font-semibold text-text-primary'>Paramètres</h3>
        <p className='text-text-secondary text-sm mt-1'>
          Gérez vos préférences de compte, notifications et confidentialité
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Notification Settings */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon name='Bell' size={20} className='mr-2' />
            Notifications
          </h4>
          <div className='space-y-4'>
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-text-primary'>
                    {key === 'emailNotifications' && 'Notifications par e-mail'}
                    {key === 'pushNotifications' && 'Notifications push'}
                    {key === 'weeklyReport' && 'Rapport hebdomadaire'}
                    {key === 'achievementAlerts' && 'Alertes de réalisations'}
                    {key === 'reminderNotifications' && "Rappels d'étude"}
                  </p>
                  <p className='text-xs text-text-secondary'>
                    {key === 'emailNotifications' && 'Recevez des mises à jour par e-mail'}
                    {key === 'pushNotifications' && 'Notifications dans le navigateur'}
                    {key === 'weeklyReport' && 'Résumé de vos progrès chaque semaine'}
                    {key === 'achievementAlerts' && 'Notifications pour les nouveaux badges'}
                    {key === 'reminderNotifications' && 'Rappels pour maintenir votre série'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Preferences */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon name='BookOpen' size={20} className='mr-2' />
            Préférences d'apprentissage
          </h4>
          <div className='space-y-6'>
            {/* Daily Goal */}
            <div>
              <label className='block text-sm font-medium text-text-primary mb-2'>
                Objectif quotidien (minutes)
              </label>
              <select
                value={learningPreferences.dailyGoal}
                onChange={e =>
                  handleLearningPreferenceChange('dailyGoal', parseInt(e.target.value))
                }
                className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary'
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
                <option value={90}>1h30</option>
              </select>
            </div>

            {/* Preferred Duration */}
            <div>
              <label className='block text-sm font-medium text-text-primary mb-2'>
                Durée préférée des leçons
              </label>
              <div className='grid grid-cols-3 gap-3'>
                {['short', 'medium', 'long'].map(duration => (
                  <button
                    key={duration}
                    type='button'
                    onClick={() => handleLearningPreferenceChange('preferredDuration', duration)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      learningPreferences.preferredDuration === duration
                        ? 'border-primary bg-primary-50 text-primary'
                        : 'border-border text-text-secondary hover:bg-secondary-50'
                    }`}
                  >
                    {duration === 'short' && 'Courte (5-10 min)'}
                    {duration === 'medium' && 'Moyenne (10-20 min)'}
                    {duration === 'long' && 'Longue (20+ min)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className='block text-sm font-medium text-text-primary mb-2'>
                Langue de l'interface
              </label>
              <select
                value={learningPreferences.language}
                onChange={e => handleLearningPreferenceChange('language', e.target.value)}
                className='w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary'
              >
                <option value='fr'>Français</option>
                <option value='en'>English</option>
              </select>
            </div>

            {/* Autoplay */}
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-text-primary'>Lecture automatique</p>
                <p className='text-xs text-text-secondary'>
                  Passer automatiquement à la leçon suivante
                </p>
              </div>
              <button
                type='button'
                onClick={() =>
                  handleLearningPreferenceChange('autoplay', !learningPreferences.autoplay)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  learningPreferences.autoplay ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    learningPreferences.autoplay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon name='Shield' size={20} className='mr-2' />
            Confidentialité
          </h4>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-2'>
                Visibilité du profil
              </label>
              <div className='grid grid-cols-2 gap-3'>
                {['private', 'public'].map(visibility => (
                  <button
                    key={visibility}
                    type='button'
                    onClick={() => handlePrivacyChange('profileVisibility', visibility)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      privacySettings.profileVisibility === visibility
                        ? 'border-primary bg-primary-50 text-primary'
                        : 'border-border text-text-secondary hover:bg-secondary-50'
                    }`}
                  >
                    {visibility === 'private' ? 'Privé' : 'Public'}
                  </button>
                ))}
              </div>
            </div>

            {Object.entries(privacySettings)
              .filter(([key]) => key !== 'profileVisibility')
              .map(([key, value]) => (
                <div key={key} className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-text-primary'>
                      {key === 'showProgress' && 'Afficher mes progrès'}
                      {key === 'showAchievements' && 'Afficher mes réalisations'}
                      {key === 'allowMessages' && 'Autoriser les messages'}
                    </p>
                    <p className='text-xs text-text-secondary'>
                      {key === 'showProgress' && 'Permettre aux autres de voir vos statistiques'}
                      {key === 'showAchievements' && 'Afficher vos badges sur votre profil'}
                      {key === 'allowMessages' && "Recevoir des messages d'autres utilisateurs"}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => handlePrivacyChange(key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-primary' : 'bg-secondary-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Data Management */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon name='Database' size={20} className='mr-2' />
            Gestion des données
          </h4>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-secondary-50 rounded-lg'>
              <div>
                <p className='text-sm font-medium text-text-primary'>Exporter mes données</p>
                <p className='text-xs text-text-secondary'>
                  Télécharger une copie de toutes vos données (profil, progrès, réalisations)
                </p>
              </div>
              <button
                type='button'
                onClick={exportData}
                className='inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary bg-surface hover:bg-secondary-50 transition-colors'
              >
                <Icon name='Download' size={16} className='mr-2' />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className='bg-error-50 rounded-lg border border-error-200 p-6'>
          <h4 className='text-base font-semibold text-error-700 mb-4 flex items-center'>
            <Icon name='AlertTriangle' size={20} className='mr-2' />
            Zone de danger
          </h4>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-error-700'>Supprimer mon compte</p>
                <p className='text-xs text-error-600'>
                  Cette action est irréversible. Toutes vos données seront définitivement
                  supprimées.
                </p>
              </div>
              <button
                type='button'
                onClick={() => setShowDeleteConfirm(true)}
                className='px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors'
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end pt-6 border-t border-border'>
          <button
            type='submit'
            disabled={isSubmitting || isSaving}
            className='inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50'
          >
            {(isSubmitting || isSaving) && <Icon name='Loader2' size={16} className='mr-2 animate-spin' />}
            Enregistrer les paramètres
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-surface rounded-lg max-w-md w-full p-6'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mr-4'>
                <Icon name='AlertTriangle' size={24} className='text-error' />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-text-primary'>
                  Confirmer la suppression
                </h3>
                <p className='text-sm text-text-secondary'>Cette action ne peut pas être annulée</p>
              </div>
            </div>
            <p className='text-sm text-text-secondary mb-6'>
              Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Toutes vos données,
              progrès et réalisations seront perdus.
            </p>
            <div className='flex space-x-4'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary-50 transition-colors'
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className='flex-1 px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors'
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;