import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';

interface SessionSettings {
  rememberMe: boolean;
  rememberDuration: number; // in days
  autoLogoutMinutes: number;
  warningMinutes: number; // warning before auto-logout
}

interface SessionManagementState {
  lastActivity: Date;
  warningShown: boolean;
  sessionSettings: SessionSettings;
  timeUntilLogout: number; // in milliseconds
}

interface SessionWarning {
  show: boolean;
  timeRemaining: number; // in milliseconds
  onExtend: () => void;
  onLogout: () => void;
}

const DEFAULT_SETTINGS: SessionSettings = {
  rememberMe: false,
  rememberDuration: 7, // 7 days
  autoLogoutMinutes: 30, // 30 minutes
  warningMinutes: 5, // warn 5 minutes before logout
};

export const useSessionManagement = () => {
  const [state, setState] = useState<SessionManagementState>({
    lastActivity: new Date(),
    warningShown: false,
    sessionSettings: DEFAULT_SETTINGS,
    timeUntilLogout: DEFAULT_SETTINGS.autoLogoutMinutes * 60 * 1000,
  });

  const [sessionWarning, setSessionWarning] = useState<SessionWarning>({
    show: false,
    timeRemaining: 0,
    onExtend: () => {},
    onLogout: () => {},
  });

  // Update last activity
  const updateActivity = useCallback(() => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      lastActivity: now,
      warningShown: false,
      timeUntilLogout: prev.sessionSettings.autoLogoutMinutes * 60 * 1000,
    }));
    
    // Hide warning if shown
    if (sessionWarning.show) {
      setSessionWarning(prev => ({ ...prev, show: false }));
    }
  }, [sessionWarning.show]);

  // Set session preferences
  const setSessionPreferences = useCallback((settings: Partial<SessionSettings>) => {
    const newSettings = { ...state.sessionSettings, ...settings };
    setState(prev => ({
      ...prev,
      sessionSettings: newSettings,
      timeUntilLogout: newSettings.autoLogoutMinutes * 60 * 1000,
    }));

    // Store in localStorage for persistence
    try {
      localStorage.setItem('sessionSettings', JSON.stringify(newSettings));
    } catch (error) {
      log.warn('Failed to save session settings to localStorage', error);
    }
  }, [state.sessionSettings]);

  // Auto-logout function
  const performAutoLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      log.info('User automatically logged out due to inactivity');
    } catch (error) {
      log.error('Error during auto-logout', error);
    }
  }, []);

  // Extend session
  const extendSession = useCallback(() => {
    updateActivity();
    log.info('Session extended by user action');
  }, [updateActivity]);

  // Setup activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Load session settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sessionSettings');
      if (saved) {
        const settings = JSON.parse(saved) as SessionSettings;
        setState(prev => ({
          ...prev,
          sessionSettings: { ...DEFAULT_SETTINGS, ...settings },
        }));
      }
    } catch (error) {
      log.warn('Failed to load session settings from localStorage', error);
    }
  }, []);

  // Session timeout management
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeSinceActivity = now.getTime() - state.lastActivity.getTime();
      const warningThreshold = (state.sessionSettings.autoLogoutMinutes - state.sessionSettings.warningMinutes) * 60 * 1000;
      const logoutThreshold = state.sessionSettings.autoLogoutMinutes * 60 * 1000;

      if (timeSinceActivity >= logoutThreshold) {
        // Auto-logout
        performAutoLogout();
      } else if (timeSinceActivity >= warningThreshold && !state.warningShown) {
        // Show warning
        const timeRemaining = logoutThreshold - timeSinceActivity;
        setState(prev => ({ ...prev, warningShown: true }));
        setSessionWarning({
          show: true,
          timeRemaining,
          onExtend: extendSession,
          onLogout: performAutoLogout,
        });
      }

      // Update time until logout for UI
      setState(prev => ({
        ...prev,
        timeUntilLogout: Math.max(0, logoutThreshold - timeSinceActivity),
      }));
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [state.lastActivity, state.sessionSettings, state.warningShown, performAutoLogout, extendSession]);

  return {
    sessionSettings: state.sessionSettings,
    setSessionPreferences,
    updateActivity,
    extendSession,
    sessionWarning,
    timeUntilLogout: state.timeUntilLogout,
    isNearLogout: state.timeUntilLogout <= state.sessionSettings.warningMinutes * 60 * 1000,
  };
};