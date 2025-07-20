/**
 * AI Foundations LMS - Admin Mode Hook
 * Gestion intelligente du mode admin avec persistance et contexte URL
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';

/* ================================
   TYPES ET INTERFACES
   ================================ */

interface AdminModeContextValue {
  adminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (enabled: boolean) => void;
  isAdminRoute: boolean;
  canAccessAdmin: boolean;
}

interface AdminModeProviderProps {
  children: ReactNode;
}

/* ================================
   CONTEXTE ADMIN MODE
   ================================ */

const AdminModeContext = createContext<AdminModeContextValue | undefined>(undefined);

const ADMIN_MODE_STORAGE_KEY = 'ai-foundations-admin-mode';

/* ================================
   PROVIDER ADMIN MODE
   ================================ */

export const AdminModeProvider = ({ children }: AdminModeProviderProps) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  
  // État du mode admin
  const [adminMode, setAdminModeState] = useState<boolean>(false);
  
  // Vérifications
  const canAccessAdmin = Boolean(userProfile?.is_admin);
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Initialisation depuis localStorage
  useEffect(() => {
    if (!canAccessAdmin) {
      setAdminModeState(false);
      localStorage.removeItem(ADMIN_MODE_STORAGE_KEY);
      return;
    }

    const stored = localStorage.getItem(ADMIN_MODE_STORAGE_KEY);
    if (stored === 'true') {
      setAdminModeState(true);
    }
  }, [canAccessAdmin]);

  // Auto-activation si route admin
  useEffect(() => {
    if (canAccessAdmin && isAdminRoute && !adminMode) {
      setAdminModeState(true);
      localStorage.setItem(ADMIN_MODE_STORAGE_KEY, 'true');
    }
  }, [canAccessAdmin, isAdminRoute, adminMode]);

  // Fonctions de contrôle
  const setAdminMode = useCallback((enabled: boolean) => {
    if (!canAccessAdmin) return;
    
    setAdminModeState(enabled);
    if (enabled) {
      localStorage.setItem(ADMIN_MODE_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_MODE_STORAGE_KEY);
    }
  }, [canAccessAdmin]);

  const toggleAdminMode = useCallback(() => {
    setAdminMode(!adminMode);
  }, [adminMode, setAdminMode]);

  const value: AdminModeContextValue = {
    adminMode,
    toggleAdminMode,
    setAdminMode,
    isAdminRoute,
    canAccessAdmin,
  };

  return (
    <AdminModeContext.Provider value={value}>
      {children}
    </AdminModeContext.Provider>
  );
};

/* ================================
   HOOK D'UTILISATION
   ================================ */

export const useAdminMode = (): AdminModeContextValue => {
  const context = useContext(AdminModeContext);
  if (!context) {
    throw new Error('useAdminMode must be used within AdminModeProvider');
  }
  return context;
};

export default useAdminMode;