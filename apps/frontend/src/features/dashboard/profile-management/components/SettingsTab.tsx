import React, { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/contexts/AuthContext';
import { getUserSettings, updateUserSettings } from '@shared/services/userService';
import { toast } from 'sonner';
import type { 
  UserSettings,
  NotificationSettings,
  NotificationSettingKey,
  PrivacySettings,
  PrivacySettingKey,
  LearningPreferences,
  LearningPreferenceKey,
  CookiePreferences,
  CookiePreferenceKey,
} from '@frontend/types/userSettings';
import Icon from '@shared/components/AppIcon';
import { log } from '@libs/logger';
import { CookieService } from '@shared/services/cookieService';

const SettingsTab: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    reminderNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showProgress: false,
    allowMessages: false,
  });

  const [learningPreferences, setLearningPreferences] = useState<LearningPreferences>({
    dailyGoal: 30,
    preferredDuration: 'medium',
    difficultyProgression: 'adaptive',
    language: 'fr',
    autoplay: true,
  });

  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
    acceptedAt: null,
    lastUpdated: null,
  });

  // Load user settings on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const settings = await getUserSettings(user.id);

        if (settings) {
          if (settings.notification_settings) {
            setNotificationSettings(settings.notification_settings as NotificationSettings);
          }
          if (settings.privacy_settings) {
            setPrivacySettings(settings.privacy_settings as PrivacySettings);
          }
          if (settings.learning_preferences) {
            setLearningPreferences(settings.learning_preferences as LearningPreferences);
          }
          if (settings.cookie_preferences) {
            setCookiePreferences(settings.cookie_preferences as CookiePreferences);
          }
        }
      } catch (error) {
        log.error('Error loading user settings', { error });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, [user]);


  const handleSaveSettings = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder les paramètres');
      return;
    }

    log.debug('=== DÉBUT DE LA SAUVEGARDE DES PARAMÈTRES ===');
    log.debug(`User ID: ${user.id}`);
    
    try {
      setIsSubmitting(true);

      const settingsData: Partial<UserSettings> = {
        notification_settings: notificationSettings,
        privacy_settings: privacySettings,
        learning_preferences: learningPreferences,
        cookie_preferences: cookiePreferences,
      };

      log.debug('Données à sauvegarder: %o', settingsData);

      // Afficher une notification de chargement
      const loadingToast = toast.loading('Sauvegarde des paramètres en cours...');
      
      try {
        // Sauvegarder les paramètres
        log.debug('Appel à updateUserSettings...');
        const result = await updateUserSettings(user.id, settingsData);
        log.debug('Résultat de updateUserSettings: %o', result);
        
        if (!result) {
          log.error('ERREUR: Aucune donnée retournée par updateUserSettings');
          throw new Error('Aucune donnée retournée par updateUserSettings');
        }
        
        // Mettre à jour la notification pour indiquer le succès
        toast.success('Paramètres sauvegardés avec succès !', {
          id: loadingToast,
          duration: 3000,
        });
        
        log.debug('=== SAUVEGARDE RÉUSSIE ===');
        log.debug('Rafraîchissement des paramètres depuis la base de données...');
        
        // Rafraîchir les paramètres depuis la base de données
        try {
          log.debug('Appel à getUserSettings...');
          const updatedSettings = await getUserSettings(user.id);
          log.debug('Paramètres récupérés après sauvegarde: %o', updatedSettings);
          
          if (updatedSettings) {
            log.debug('Mise à jour du state local avec les nouvelles données...');
            if (updatedSettings.notification_settings) {
              log.debug('Mise à jour des paramètres de notification');
              setNotificationSettings(updatedSettings.notification_settings as NotificationSettings);
            }
            if (updatedSettings.privacy_settings) {
              log.debug('Mise à jour des paramètres de confidentialité');
              setPrivacySettings(updatedSettings.privacy_settings as PrivacySettings);
            }
            if (updatedSettings.learning_preferences) {
              log.debug('Mise à jour des préférences d\'apprentissage');
              setLearningPreferences(updatedSettings.learning_preferences as LearningPreferences);
            }
            if (updatedSettings.cookie_preferences) {
              log.debug('Mise à jour des préférences de cookies');
              setCookiePreferences(updatedSettings.cookie_preferences as CookiePreferences);
            }
            log.debug('=== MISE À JOUR DU STATE TERMINÉE ===');
          } else {
            log.warn('AUCUNE DONNÉE: Aucun paramètre mis à jour reçu de la base de données');
          }
        } catch (refreshError) {
          log.error('ERREUR lors du rafraîchissement des paramètres: %o', refreshError);
          log.error('Error refreshing settings after save', { error: refreshError });
          // Ne pas afficher d'erreur à l'utilisateur, les paramètres ont peut-être été sauvegardés
        }
      } catch (error) {
        log.error('Error saving settings', { error });
        toast.error('Erreur lors de la sauvegarde des paramètres. Veuillez réessayer.', {
          id: loadingToast,
          duration: 5000,
        });
      }
    } catch (error) {
      log.error('Error in save settings process', { error });
      toast.error('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationChange = (setting: NotificationSettingKey): void => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePrivacyChange = <K extends PrivacySettingKey>(
    setting: K,
    value: PrivacySettings[K],
  ): void => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleLearningPreferenceChange = <K extends LearningPreferenceKey>(
    setting: K,
    value: LearningPreferences[K],
  ): void => {
    setLearningPreferences(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleCookiePreferenceChange = (setting: CookiePreferenceKey): void => {
    if (setting === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [setting]: setting === 'acceptedAt' || setting === 'lastUpdated' 
        ? new Date().toISOString() 
        : !prev[setting],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleDeleteAccount = (): void => {
    // Simulate account deletion
    log.info('Account deletion requested by user');
    setShowDeleteConfirm(false);
  };

  const exportData = (): void => {
    // Simulate data export
    const userData = {
      profile: 'User profile data...',
      progress: 'Learning progress data...',
      achievements: 'Achievement data...',
      settings: {
        notifications: notificationSettings,
        privacy: privacySettings,
        learning: learningPreferences,
      },
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mes-donnees-ai-foundations.json';
    link.click();
  };

  const resetCookiePreferences = async (): Promise<void> => {
    toast.promise(
      (async () => {
        await CookieService.resetCookiePreferences(user?.id || null);
        
        // Reset local state
        setCookiePreferences({
          essential: true,
          analytics: false,
          marketing: false,
          functional: false,
          acceptedAt: null,
          lastUpdated: null,
        });
      })(),
      {
        loading: 'Réinitialisation des préférences de cookies...',
        success: () => 'Préférences de cookies réinitialisées. La bannière de cookies apparaîtra à nouveau lors de votre prochaine visite sur la page d\'accueil.',
        error: (error) => {
          log.error('Error resetting cookie preferences', { error });
          return 'Erreur lors de la réinitialisation des préférences de cookies.';
        },
      }
    );
  };

  const clearAllData = (): void => {
    toast.custom((t) => (
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-surface shadow-lg border border-border">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Icon name="AlertTriangle" size={20} className="text-warning-500" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">Effacer toutes les données locales</p>
              <p className="mt-1 text-sm text-text-secondary">
                Êtes-vous sûr de vouloir effacer toutes les données locales ? Cela inclut les préférences, le cache et les données hors ligne.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-border rounded-md text-sm font-medium text-text-primary bg-surface hover:bg-secondary-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t);
                    
                    // Show loading toast
                    const loadingToast = toast.loading('Nettoyage des données...');
                    
                    // Clear all data
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Clear service worker cache if available
                    if ('caches' in window) {
                      caches.keys().then(names => {
                        names.forEach(name => {
                          caches.delete(name);
                        });
                      });
                    }
                    
                    // Update loading toast to success
                    toast.success('Toutes les données locales ont été effacées. La page va se recharger.', {
                      id: loadingToast,
                      duration: 2000,
                      onAutoClose: () => window.location.reload()
                    });
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-error-600 hover:bg-error-700"
                >
                  Tout effacer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity, // Don't auto-dismiss
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Icon aria-hidden='true' name='Loader2' size={24} className='animate-spin text-primary' />
        <span className='ml-2 text-text-secondary'>Chargement des paramètres...</span>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h3 className='text-lg font-semibold text-text-primary'>Paramètres</h3>
        <p className='text-text-secondary text-sm mt-1'>
          Gérez vos préférences de compte, notifications et confidentialité
        </p>
      </div>

      <div className='space-y-8'>
        {/* Notification Settings */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon aria-hidden='true' name='Bell' size={20} className='mr-2' />
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
                    {key === 'reminderNotifications' && 'Rappels pour maintenir votre série active'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => handleNotificationChange(key as NotificationSettingKey)}
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
            <Icon aria-hidden='true' name='BookOpen' size={20} className='mr-2' />
            Préférences d&rsquo;apprentissage
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
                {(['short', 'medium', 'long'] as const).map(duration => (
                  <button
                    key={duration}
                    type='button'
                    onClick={() =>
                      handleLearningPreferenceChange('preferredDuration', duration)
                    }
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
                Langue de l&rsquo;interface
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
            <Icon aria-hidden='true' name='Shield' size={20} className='mr-2' />
            Confidentialité
          </h4>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-2'>
                Visibilité du profil
              </label>
              <div className='grid grid-cols-2 gap-3'>
                {(['private', 'public'] as const).map(visibility => (
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
                      {key === 'allowMessages' && "Recevoir des messages d&rsquo;autres utilisateurs"}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => handlePrivacyChange(key as PrivacySettingKey, !value)}
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

        {/* Cookie Management */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon aria-hidden='true' name='Cookie' size={20} className='mr-2' />
            Gestion des cookies
          </h4>
          <div className='space-y-4'>
            <p className='text-sm text-text-secondary mb-4'>
              Gérez vos préférences de cookies pour améliorer votre expérience de navigation.
            </p>
            
            {Object.entries(cookiePreferences)
              .filter(([key]) => !['acceptedAt', 'lastUpdated'].includes(key))
              .map(([key, value]) => (
                <div key={key} className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-text-primary'>
                      {key === 'essential' && 'Cookies essentiels'}
                      {key === 'analytics' && 'Cookies analytiques'}
                      {key === 'marketing' && 'Cookies marketing'}
                      {key === 'functional' && 'Cookies fonctionnels'}
                    </p>
                    <p className='text-xs text-text-secondary'>
                      {key === 'essential' && 'Nécessaires au fonctionnement du site (obligatoires)'}
                      {key === 'analytics' && 'Nous aident à comprendre comment vous utilisez le site'}
                      {key === 'marketing' && 'Utilisés pour personnaliser les publicités'}
                      {key === 'functional' && 'Améliorent votre expérience avec des fonctionnalités avancées'}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleCookiePreferenceChange(key as CookiePreferenceKey)}
                    disabled={key === 'essential'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-primary' : 'bg-secondary-300'
                    } ${key === 'essential' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            
            {cookiePreferences.acceptedAt && (
              <div className='mt-4 p-3 bg-secondary-50 rounded-lg'>
                <p className='text-xs text-text-secondary'>
                  Dernière mise à jour : {new Date(cookiePreferences.acceptedAt).toLocaleString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-4 flex items-center'>
            <Icon aria-hidden='true' name='Database' size={20} className='mr-2' />
            Gestion des données
          </h4>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-secondary-50 rounded-lg'>
              <div>
                <p className='text-sm font-medium text-text-primary'>Exporter mes données</p>
                <p className='text-xs text-text-secondary'>
                  Télécharger une copie de toutes vos données
                </p>
              </div>
              <button
                type='button'
                onClick={exportData}
                className='inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-primary bg-surface hover:bg-secondary-50 transition-colors'
              >
                <Icon aria-hidden='true' name='Download' size={16} className='mr-2' />
                Exporter
              </button>
            </div>

            <div className='flex items-center justify-between p-4 bg-warning-50 rounded-lg'>
              <div>
                <p className='text-sm font-medium text-text-primary'>Réinitialiser les cookies</p>
                <p className='text-xs text-text-secondary'>
                  Effacer vos préférences de cookies et réafficher la bannière
                </p>
              </div>
              <button
                type='button'
                onClick={resetCookiePreferences}
                className='inline-flex items-center px-4 py-2 border border-warning-300 rounded-lg text-sm font-medium text-warning-700 bg-warning-100 hover:bg-warning-200 transition-colors'
              >
                <Icon aria-hidden='true' name='Cookie' size={16} className='mr-2' />
                Réinitialiser
              </button>
            </div>

            <div className='flex items-center justify-between p-4 bg-error-50 rounded-lg'>
              <div>
                <p className='text-sm font-medium text-error-700'>Effacer toutes les données locales</p>
                <p className='text-xs text-error-600'>
                  Supprimer cache, préférences et données hors ligne (nécessite rechargement)
                </p>
              </div>
              <button
                type='button'
                onClick={clearAllData}
                className='inline-flex items-center px-4 py-2 border border-error-300 rounded-lg text-sm font-medium text-error-700 bg-error-100 hover:bg-error-200 transition-colors'
              >
                <Icon aria-hidden='true' name='Trash2' size={16} className='mr-2' />
                Effacer tout
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className='bg-error-50 rounded-lg border border-error-200 p-6'>
          <h4 className='text-base font-semibold text-error-700 mb-4 flex items-center'>
            <Icon aria-hidden='true' name='AlertTriangle' size={20} className='mr-2' />
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
            type='button'
            onClick={handleSaveSettings}
            disabled={isSubmitting}
            className='inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50'
          >
            {isSubmitting && (
              <Icon aria-hidden='true' name='Loader2' size={16} className='mr-2 animate-spin' />
            )}
            {isSubmitting ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-surface rounded-lg max-w-md w-full p-6'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mr-4'>
                <Icon aria-hidden='true' name='AlertTriangle' size={24} className='text-error' />
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
