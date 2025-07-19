/**
 * MASTERCLASS AUTHENTICATION HOOK
 * ================================
 * Hook personnalisé pour une gestion optimisée de l'authentification
 * avec support des claims JWT et prévention des références circulaires
 */

import { useCallback, useEffect } from 'react';
import { useAuthV2 } from '@frontend/context/AuthContextV2';
import { withAdminCheck, type AuthClaims } from '@frontend/lib/auth-claims';
import { log } from '@libs/logger';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@frontend/types/user';

/**
 * Interface pour les méthodes d'authentification
 */
export interface AuthMethods {
  // Authentification de base
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  
  // Gestion des mots de passe
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  
  // Gestion des profils
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  refreshSession: () => Promise<void>;
  
  // Utilitaires
  clearError: () => void;
  checkAdminAccess: <T>(operation: () => Promise<T>) => Promise<T>;
}

/**
 * Interface pour l'état d'authentification
 */
export interface AuthState {
  // État principal
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  claims: AuthClaims | null;
  
  // État de chargement et erreurs
  loading: boolean;
  error: Error | null;
  
  // Propriétés dérivées
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Informations d'utilisateur
  userEmail: string | null;
  userName: string | null;
  userAvatar: string | null;
}

/**
 * Hook principal d'authentification
 */
export const useAuthMasterclass = () => {
  const authContext = useAuthV2();
  // Forcer une mise à jour périodique pour s'assurer que l'état est synchronisé
  useEffect(() => {
    const interval = setInterval(() => {
      // La mise à jour est gérée par le contexte d'authentification
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // État d'authentification
  const authState: AuthState = {
    user: authContext.user,
    profile: authContext.userProfile,
    session: authContext.session,
    claims: authContext.claims,
    loading: authContext.loading,
    error: authContext.authError,
    isAuthenticated: authContext.isAuthenticated,
    isAdmin: authContext.isAdmin,
    userEmail: authContext.user?.email || null,
    userName: authContext.userProfile?.full_name || authContext.user?.user_metadata?.full_name || null,
    userAvatar: authContext.userProfile?.avatar_url || null,
  };

  // Méthodes d'authentification simplifiées
  const authMethods: AuthMethods = {
    signIn: useCallback(async (email: string, password: string): Promise<boolean> => {
      try {
        const result = await authContext.signIn({ email, password });
        return result.error === null;
      } catch (error) {
        log.error('❌ Error in useAuthMasterclass.signIn:', error);
        return false;
      }
    }, [authContext]),

    signUp: useCallback(async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
      try {
        const result = await authContext.signUp({ email, password, firstName, lastName });
        return result.error === null;
      } catch (error) {
        log.error('❌ Error in useAuthMasterclass.signUp:', error);
        return false;
      }
    }, [authContext]),

    signInWithGoogle: useCallback(async (): Promise<boolean> => {
      try {
        const result = await authContext.signInWithGoogle();
        return result.error === null;
      } catch (error) {
        log.error('❌ Error in useAuthMasterclass.signInWithGoogle:', error);
        return false;
      }
    }, [authContext]),

    signOut: useCallback(async (): Promise<void> => {
      try {
        await authContext.signOut();
      } catch (error) {
        log.error('❌ Error in useAuthMasterclass.signOut:', error);
      }
    }, [authContext]),

    resetPassword: useCallback(async (email: string): Promise<void> => {
      await authContext.resetPassword(email);
    }, [authContext]),

    resendVerificationEmail: useCallback(async (email: string): Promise<void> => {
      await authContext.resendVerificationEmail(email);
    }, [authContext]),

    updateProfile: useCallback(async (updates: Partial<UserProfile>): Promise<UserProfile> => {
      return authContext.updateProfile(updates);
    }, [authContext]),

    refreshSession: useCallback(async (): Promise<void> => {
      await authContext.refreshSession();
    }, [authContext]),

    clearError: useCallback((): void => {
      authContext.clearAuthError();
    }, [authContext]),

    checkAdminAccess: useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
      return withAdminCheck(authContext.user, operation);
    }, [authContext.user]),
  };

  return {
    ...authState,
    ...authMethods,
  };
};

/**
 * Hook pour vérifier les permissions administrateur
 */
export const useAdminAccess = () => {
  const { user, isAdmin, isAuthenticated } = useAuthMasterclass();

  const checkAdminAccess = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    return operation();
  }, [isAuthenticated, isAdmin]);

  const requireAdmin = useCallback((redirectTo?: string) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    if (!isAdmin) {
      if (redirectTo) {
        window.location.href = redirectTo;
      }
      throw new Error('Admin access required');
    }
  }, [isAuthenticated, isAdmin]);

  return {
    isAdmin,
    isAuthenticated,
    user,
    checkAdminAccess,
    requireAdmin,
  };
};

/**
 * Hook pour la gestion des erreurs d'authentification
 */
export const useAuthError = () => {
  const { error, clearError } = useAuthMasterclass();

  const hasError = Boolean(error);
  const errorMessage = error?.message || null;

  const isAuthError = useCallback((error: unknown): error is Error => {
    return error instanceof Error && (
      error.message.includes('authentication') ||
      error.message.includes('token') ||
      error.message.includes('session') ||
      error.message.includes('unauthorized')
    );
  }, []);

  return {
    hasError,
    error,
    errorMessage,
    clearError,
    isAuthError,
  };
};

/**
 * Hook pour la synchronisation des claims
 */
export const useClaimsSync = () => {
  const { user, claims, refreshSession } = useAuthMasterclass();

  const syncClaims = useCallback(async () => {
    if (!user) return null;

    try {
      // Vérifier si les claims sont disponibles et synchronisés
      if (claims && claims.is_admin !== null) {
        await refreshSession();
      }
      
      return claims;
    } catch (error) {
      log.error('❌ Error syncing claims:', error);
      return null;
    }
  }, [user, claims, refreshSession]);

  return {
    claims,
    syncClaims,
  };
};

/**
 * Hook pour la gestion des sessions
 */
export const useSessionManager = () => {
  const { session, refreshSession, user } = useAuthMasterclass();

  const isSessionValid = useCallback((): boolean => {
    if (!session) return false;

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at || 0;
    
    return expiresAt > now;
  }, [session]);

  const getTimeUntilExpiry = useCallback((): number => {
    if (!session) return 0;

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at || 0;
    
    return Math.max(0, expiresAt - now);
  }, [session]);

  const ensureValidSession = useCallback(async (): Promise<boolean> => {
    if (!isSessionValid()) {
      try {
        await refreshSession();
        return true;
      } catch (error) {
        log.error('❌ Error refreshing session:', error);
        return false;
      }
    }
    return true;
  }, [isSessionValid, refreshSession]);

  return {
    session,
    user,
    isSessionValid,
    getTimeUntilExpiry,
    ensureValidSession,
    refreshSession,
  };
};