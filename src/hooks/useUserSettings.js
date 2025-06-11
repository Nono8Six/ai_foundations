import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to manage user settings
 * @returns {Object} User settings and functions to update them
 */
const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notification_settings: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true,
      achievementAlerts: true,
      reminderNotifications: true,
    },
    privacy_settings: {
      profileVisibility: 'private',
      showProgress: false,
      showAchievements: true,
      allowMessages: false,
    },
    learning_preferences: {
      dailyGoal: 30,
      preferredDuration: 'medium',
      difficultyProgression: 'adaptive',
      language: 'fr',
      autoplay: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load settings from Supabase
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get settings from Supabase
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          // If no settings exist yet, create default settings
          if (error.code === 'PGRST116') {
            const { data: newSettings, error: createError } = await supabase
              .from('user_settings')
              .insert([{ user_id: user.id }])
              .select()
              .single();

            if (createError) throw createError;
            setSettings(newSettings);
          } else {
            throw error;
          }
        } else if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error loading user settings:', err);
        setError(err);
        
        // Fallback to localStorage if database fails
        const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings({
              notification_settings: parsedSettings.notifications || settings.notification_settings,
              privacy_settings: parsedSettings.privacy || settings.privacy_settings,
              learning_preferences: parsedSettings.learning || settings.learning_preferences,
            });
          } catch (parseError) {
            console.error('Error parsing saved settings:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Update notification settings
  const updateNotificationSettings = async (newSettings) => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // Update in Supabase
      const { data, error } = await supabase.rpc('update_user_settings', {
        p_user_id: user.id,
        p_notification_settings: newSettings,
      });

      if (error) throw error;

      // Update local state
      setSettings(prev => ({
        ...prev,
        notification_settings: newSettings,
      }));

      // Backup to localStorage
      saveToLocalStorage({
        ...getLocalStorageSettings(),
        notifications: newSettings,
      });

      return data;
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError(err);
      
      // Still update local state for better UX
      setSettings(prev => ({
        ...prev,
        notification_settings: newSettings,
      }));
      
      // Backup to localStorage
      saveToLocalStorage({
        ...getLocalStorageSettings(),
        notifications: newSettings,
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update privacy settings
  const updatePrivacySettings = async (newSettings) => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // Update in Supabase
      const { data, error } = await supabase.rpc('update_user_settings', {
        p_user_id: user.id,
        p_privacy_settings: newSettings,
      });

      if (error) throw error;

      // Update local state
      setSettings(prev => ({
        ...prev,
        privacy_settings: newSettings,
      }));

      // Backup to localStorage
      saveToLocalStorage({
        ...getLocalStorageSettings(),
        privacy: newSettings,
      });

      return data;
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      setError(err);
      
      // Still update local state for better UX
      setSettings(prev => ({
        ...prev,
        privacy_settings: newSettings,
      }));
      
      // Backup to localStorage
      saveToLocalStorage({
        ...getLocalStorageSettings(),
        privacy: newSettings,
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update learning preferences
  const updateLearningPreferences = async (newSettings) => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // Update in Supabase
      const { data, error } = await supabase.rpc('update_user_settings', {
        p_user_id: user.id,
        p_learning_preferences: newSettings,
      });

      if (error) throw error;

      // Update local state
      setSettings(prev => ({
        ...prev,
        learning_preferences: newSettings,
      }));

      // Backup to localStorage
      saveToLocalStorage({
        ...getLocalStorageSettings(),
        learning: newSettings,
      });

      return data;
    } catch (err) {
      console.error('Error updating learning preferences:', err);
      setError(err);
      
      // Still update local state for better UX
      setSettings(prev => ({
        ...prev,
        learning_preferences: newSettings,
      }));
      
      // Backup to localStorage
      saveToLocalStorage({
        ...getLocalStorageSettings(),
        learning: newSettings,
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper to get settings from localStorage
  const getLocalStorageSettings = () => {
    if (!user) return {};
    
    try {
      const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
      return savedSettings ? JSON.parse(savedSettings) : {};
    } catch (err) {
      console.error('Error getting settings from localStorage:', err);
      return {};
    }
  };

  // Helper to save settings to localStorage
  const saveToLocalStorage = (settingsData) => {
    if (!user) return;
    
    try {
      localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settingsData));
    } catch (err) {
      console.error('Error saving settings to localStorage:', err);
    }
  };

  return {
    settings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateLearningPreferences,
    loading,
    error,
  };
};

export default useUserSettings;