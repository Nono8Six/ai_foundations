/**
 * MASTERCLASS AUTHENTICATION CONTEXT V2
 * =====================================
 * Context d'authentification optimisé utilisant le nouveau AuthService
 * avec gestion des claims JWT et prévention des références circulaires
 */

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session, User, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import type { UserProfile } from '@frontend/types/user';
import type { AuthErrorWithCode, AuthErrorCode } from '@frontend/types/auth';

import { supabase } from '@core/supabase/client';
import { authService, type AuthState } from '@shared/services/authService';
import { isUserAdmin, type AuthClaims } from '@core/auth/claims';
import { useNavigate } from 'react-router-dom';
import { log } from '@libs/logger';
import { toast } from 'sonner';
import { createContextStrict } from "@shared/contexts/createContextStrict";

/**
 * Types et interfaces
 */
export interface AuthContextV2Value {
  // État principal
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  claims: AuthClaims | null;
  loading: boolean;
  authError: Error | null;

  // Méthodes d'authentification
  signUp: (args: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  
  signIn: (credentials: { 
    email: string; 
    password: string; 
  }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  
  signInWithGoogle: () => Promise<{ data: { provider: string; url: string } | null; error: Error | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;

  // Utilitaires
  isAdmin: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  clearAuthError: () => void;
}

/**
 * Fonction utilitaire pour créer une erreur d'authentification typée
 */
const createAuthError = (
  message: string,
  code?: AuthErrorCode,
  originalError?: AuthError
): AuthErrorWithCode => {
  const error = new Error(message) as AuthErrorWithCode;
  
  if (code !== undefined) {
    error.code = code;
  }
  
  if (originalError !== undefined) {
    error.originalError = {
      code: originalError.code,
    };
  }
  
  return error;
};

/**
 * Context et hook
 */
const [AuthContextV2, useAuthV2] = createContextStrict<AuthContextV2Value>();

/**
 * Provider principal
 */
export const AuthProviderV2 = ({ children }: { children: ReactNode }) => {
  // État local
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    claims: null,
    profile: null,
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  // Synchroniser l'état local avec le service d'authentification
  const syncState = useCallback(() => {
    const serviceState = authService.getState();
    setState(serviceState);
  }, []);

  // Initialisation
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        log.debug('🔄 Initializing AuthContextV2...');
        await authService.initialize();
        syncState();
      } catch (error) {
        log.error('❌ Error initializing AuthContextV2:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Auth initialization failed'),
          loading: false,
        }));
      }
    };

    initializeAuth();
  }, [syncState]);

  // Écouter les changements d'authentification
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      log.debug('🔄 Auth state change event:', event);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          log.debug('✅ User signed in, reinitializing auth service...');
          await authService.initialize();
          syncState();
          
          // Navigation pour la vérification email
          if (window.location.pathname === '/verify-email') {
            navigate('/espace');
          }
        } else if (event === 'SIGNED_OUT') {
          log.debug('🚪 User signed out');
          syncState();
        } else if (event === 'TOKEN_REFRESHED') {
          log.debug('🔄 Token refreshed, updating state...');
          syncState();
        } else if (event === 'USER_UPDATED') {
          log.debug('👤 User updated');
          if (window.location.pathname === '/verify-email') {
            navigate('/espace');
          }
        }
      } catch (error) {
        log.error('❌ Error handling auth state change:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Auth state change failed'),
        }));
      }
    });

    return () => {
      log.debug('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, [syncState, navigate]);

  // Afficher les erreurs via toast
  useEffect(() => {
    if (state.error) {
      toast.error(state.error.message);
    }
  }, [state.error]);

  // Méthodes d'authentification
  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    log.debug('📝 Signing up user:', email);
    
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (result.error) {
        const authErr = result.error instanceof Error ? result.error : new Error(String(result.error));
        log.error('❌ Error signing up:', authErr.message);
        setState(prev => ({ ...prev, error: authErr }));
        return { data: null, error: authErr };
      }

      log.info('✅ Sign up successful');
      return {
        data: {
          user: result.data?.user || null,
          session: result.data?.session || null,
        },
        error: null,
      };
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Unexpected error during sign up:', err);
      setState(prev => ({ ...prev, error: err }));
      return { data: null, error: err };
    }
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    log.debug('🔐 Signing in user:', email);
    
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        let userFriendlyMessage = 'Les identifiants fournis sont incorrects. Vérifiez votre email et mot de passe.';
        let errorCode: AuthErrorCode = 'invalid_credentials';

        if (result.error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Mot de passe incorrect.';
          errorCode = 'wrong_password';
        } else if (result.error.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.';
          errorCode = 'email_not_confirmed';
        } else if (result.error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer.';
          errorCode = 'too_many_requests';
        }

        const enhancedError = createAuthError(userFriendlyMessage, errorCode, result.error);
        log.error('❌ Sign in error:', enhancedError);
        setState(prev => ({ ...prev, error: enhancedError }));
        return { data: null, error: enhancedError };
      }

      log.info('✅ Sign in successful');
      return {
        data: {
          user: result.data?.user || null,
          session: result.data?.session || null,
        },
        error: null,
      };
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Unexpected error during sign in:', err);
      setState(prev => ({ ...prev, error: err }));
      return { data: null, error: err };
    }
  };

  const signInWithGoogle = async () => {
    log.debug('🔐 Signing in with Google...');
    
    try {
      const result = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`,
        },
      });

      if (result.error) {
        const authErr = result.error instanceof Error ? result.error : new Error(String(result.error));
        log.error('❌ Error signing in with Google:', authErr.message);
        setState(prev => ({ ...prev, error: authErr }));
        return { data: null, error: authErr };
      }

      log.info('✅ Google sign in initiated');
      return {
        data: result.data
          ? {
              provider: result.data.provider,
              url: result.data.url || `${window.location.origin}/user-dashboard`,
            }
          : null,
        error: null,
      };
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Unexpected error during Google sign in:', err);
      setState(prev => ({ ...prev, error: err }));
      return { data: null, error: err };
    }
  };

  const signOut = useCallback(async (): Promise<void> => {
    log.debug('🚪 Signing out user...');
    
    try {
      await authService.signOut();
      syncState();
      navigate('/login');
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Error signing out:', err);
      setState(prev => ({ ...prev, error: err }));
      throw err;
    }
  }, [syncState, navigate]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      log.error('❌ Error during logout:', err);
    }
  }, [signOut, navigate]);

  const resetPassword = async (email: string) => {
    log.debug('🔑 Sending reset password email for:', email);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const authErr = error instanceof Error ? error : new Error(String(error));
        setState(prev => ({ ...prev, error: authErr }));
        log.error('❌ Error resetting password:', authErr.message);
        throw authErr;
      }

      log.info('✅ Password reset email sent');
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      setState(prev => ({ ...prev, error: err }));
      throw err;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    log.debug('📧 Resending verification email for:', email);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        const authErr = error instanceof Error ? error : new Error(String(error));
        setState(prev => ({ ...prev, error: authErr }));
        log.error('❌ Error resending verification email:', authErr.message);
        throw authErr;
      }

      log.info('✅ Verification email resent');
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      setState(prev => ({ ...prev, error: err }));
      throw err;
    }
  };

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      await authService.refreshSession();
      syncState();
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Error refreshing session:', err);
      setState(prev => ({ ...prev, error: err }));
      throw err;
    }
  }, [syncState]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const updatedProfile = await authService.updateProfile(updates);
      syncState();
      return updatedProfile;
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Error updating profile:', err);
      setState(prev => ({ ...prev, error: err }));
      throw err;
    }
  }, [syncState]);

  const clearAuthError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Calculer les propriétés dérivées
  const isAdmin = Boolean(state.claims?.is_admin || isUserAdmin(state.user));
  const isAuthenticated = Boolean(state.user && state.session);

  // Valeur du contexte
  const value: AuthContextV2Value = {
    // État principal
    user: state.user,
    userProfile: state.profile,
    session: state.session,
    claims: state.claims,
    loading: state.loading,
    authError: state.error,

    // Méthodes d'authentification
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    logout,
    resetPassword,
    resendVerificationEmail,

    // Utilitaires
    isAdmin,
    isAuthenticated,
    refreshSession,
    updateProfile,
    clearAuthError,
  };

  return <AuthContextV2.Provider value={value}>{children}</AuthContextV2.Provider>;
};

export { useAuthV2 };