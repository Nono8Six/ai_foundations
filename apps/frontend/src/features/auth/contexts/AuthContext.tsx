// src/context/AuthContext.tsx
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  Session,
  User,
  SupabaseClient,
  AuthError,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import type { UserProfile } from '@frontend/types/user';

import { supabase, startTokenMonitoring, stopTokenMonitoring } from '@core/supabase/client';
import { safeQuery } from '@core/supabase/utils';
import { useNavigate } from 'react-router-dom';
import { log } from '@libs/logger';
import type { AuthErrorWithCode, AuthErrorCode } from '@frontend/types/auth';
import { toast } from 'sonner';
import { createContextStrict } from "@shared/contexts/createContextStrict";
import { setAuthErrorHandler } from '@core/supabase/interceptor';
import { fetchUserProfile } from '@shared/services/userService';
import { StreakService } from '@shared/services/streakService';

const supabaseClient = supabase as SupabaseClient<Database>;

/**
 * Creates a type-safe AuthErrorWithCode for exactOptionalPropertyTypes
 * Modern TypeScript 5.8+ utility function
 */
const createAuthError = (
  message: string, 
  code?: AuthErrorCode | undefined,
  originalError?: AuthError | undefined
): AuthErrorWithCode => {
  const error = new Error(message) as AuthErrorWithCode;
  
  // Explicitly handle undefined for exactOptionalPropertyTypes
  if (code !== undefined) {
    error.code = code;
  }
  
  if (originalError !== undefined) {
    error.originalError = {
      code: originalError.code
    };
  }
  
  return error;
};

export interface AuthContextValue {
  signUp: (_args: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  signIn: (_credentials: { email: string; password: string }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  signInWithGoogle: () => Promise<{ data: { provider: string; url: string } | null; error: Error | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (_email: string) => Promise<void>;
  resendVerificationEmail: (_email: string) => Promise<void>;
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  authError: Error | null;
  profileError: Error | null;
  isAdmin: boolean;
  refreshUserProfile: () => Promise<void>;
  clearAuthError: () => void;
  clearProfileError: () => void;
}

const [AuthContext, useAuth] = createContextStrict<AuthContextValue>();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const clearAuthError = () => setAuthError(null);
  const clearProfileError = () => setProfileError(null);
  
  // Refresh user profile method
  const refreshUserProfile = useCallback(async () => {
    if (!user) {
      log.warn('Cannot refresh profile: no user logged in');
      return;
    }
    
    try {
      log.debug('🔄 Refreshing user profile...');
      const profile = await fetchUserProfile(user);
      setUserProfile(profile);
      setProfileError(null);
      log.debug('✅ User profile refreshed successfully:', profile);
    } catch (err) {
      const error = typeof err === 'string' ? new Error(err) : (err as Error);
      log.error('❌ Failed to refresh user profile:', error);
      setProfileError(error);
    }
  }, [user]);

  // Sign Out
  const signOut = useCallback(async (): Promise<void> => {
    log.debug('🚪 Signing out user...');
    setLoading(true);

    try {
      // Arrêter le monitoring des tokens avant de se déconnecter
      stopTokenMonitoring();
      
      await supabaseClient.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setAuthError(null);
      setProfileError(null);
      log.debug('✅ User signed out successfully');
      navigate('/login');
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('❌ Error signing out:', err);
      setAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Set up automatic sign out handler for authentication errors
  useEffect(() => {
    const handleAuthError = async () => {
      log.warn('🔐 Authentication error detected, signing out user...');
      await signOut();
    };
    
    setAuthErrorHandler(handleAuthError);
  }, [signOut]);

  useEffect(() => {
    const error = authError ?? profileError;
    if (error) {
      toast.error(error.message);
    }
  }, [authError, profileError]);

  useEffect(() => {
    // Get session on initial load
    const getInitialSession = async () => {
      try {
        log.debug('🔍 Getting initial session...');
        const { data, error } = await safeQuery<{ session: Session | null }, AuthError>(() =>
          supabaseClient.auth.getSession()
        );
        if (error) throw error;
        const { session } = data ?? {};
        log.debug('📋 Initial session:', session);
        setSession(session ?? null);
        setUser(session?.user ?? null);
        
        // Si une session existe, démarrer le monitoring des tokens
        if (session?.user) {
          log.debug('🔍 Starting token monitoring for existing session');
          startTokenMonitoring();
        }
      } catch (err) {
        const error = typeof err === 'string' ? new Error(err) : (err as Error);
        log.error('❌ Error getting initial session:', error.message);
        setAuthError(error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth subscription
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        log.debug('🔄 Auth state change event:', event);
        log.debug('📋 Auth state change session:', session);
        log.debug('⏰ Timestamp:', new Date().toISOString());

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          log.debug('✅ User signed in');
          // Démarrer le monitoring des tokens
          startTokenMonitoring();
          if (window.location.pathname === '/verify-email') {
            navigate('/espace');
          }
        } else if (event === 'SIGNED_OUT') {
          log.debug('🚪 User signed out, clearing profile...');
          setUserProfile(null);
          // Arrêter le monitoring des tokens
          stopTokenMonitoring();
        } else if (event === 'TOKEN_REFRESHED') {
          log.debug('🔄 Token refreshed');
        } else if (event === 'USER_UPDATED') {
          log.debug('👤 User updated');
          if (window.location.pathname === '/verify-email') {
            navigate('/espace');
          }
        }
      }
    );

    return () => {
      log.debug('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, [navigate]);





  useEffect(() => {
    if (!user || !session) return;
    
    const loadProfile = async () => {
      log.debug('👤 User detected with valid session, fetching profile...');
      log.debug('📋 User ID:', user.id);
      log.debug('📋 Session access token exists:', !!session.access_token);
      log.debug('📋 Session expires at:', session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'never');
      
      // Vérifier si la session n'est pas expirée
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        log.warn('⚠️ Session is expired, attempting refresh...');
        try {
          const refreshResult = await supabaseClient.auth.refreshSession();
          if (refreshResult.error) {
            log.error('❌ Session refresh failed:', refreshResult.error);
            setProfileError(new Error('Session expired - please sign in again'));
            return;
          }
          log.debug('✅ Session refreshed successfully');
        } catch (refreshErr) {
          log.error('❌ Session refresh attempt failed:', refreshErr);
          setProfileError(new Error('Session expired - please sign in again'));
          return;
        }
      }
      
      // Ajouter un délai pour permettre au token d'être complètement établi
      await new Promise<void>((resolve) => { setTimeout(resolve, 100); });
      
      try {
        const profile = await fetchUserProfile(user);
        setUserProfile(profile);
        setProfileError(null); // Clear any previous errors
        log.debug('✅ User profile loaded successfully:', profile);
        
        // Mettre à jour le streak lors de la connexion
        try {
          await StreakService.updateUserStreak(user.id);
          log.debug('🔥 User streak updated successfully');
        } catch (streakError) {
          log.warn('⚠️ Failed to update user streak:', streakError);
          // Ne pas faire échouer la connexion pour un problème de streak
        }
      } catch (err) {
        const error = typeof err === 'string' ? new Error(err) : (err as Error);
        log.error('❌ Failed to fetch user profile:', error);
        log.error('❌ Error details:', error.message);
        
        // Si c'est une erreur d'authentification, forcer la déconnexion
        if (error.message.includes('Authentication failed') || error.message.includes('sign in again')) {
          log.warn('🚪 Authentication error detected, signing out...');
          await signOut();
        } else {
          setProfileError(error);
        }
      }
    };
    
    void loadProfile();
  }, [user, session, signOut]);

  // Sign Up with email
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
    setLoading(true);

    try {
      const result = await supabaseClient.auth.signUp({
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
        log.error('Error signing up:', authErr.message);
        setAuthError(authErr);
        return { data: null, error: authErr };
      }

      log.info('✅ Sign up successful');
      return {
        data: {
          user: result.data?.user || null,
          session: result.data?.session || null,
        },
        error: null
      };
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('Unexpected error during sign up:', err);
      setAuthError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign In with email
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    log.debug('🔐 Signing in user:', email);
    setLoading(true);

    try {
      const result = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        let userFriendlyMessage =
          'Les identifiants fournis sont incorrects. Vérifiez votre email et mot de passe.';
        let errorCode: AuthErrorCode = 'invalid_credentials';

        if (result.error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Mot de passe incorrect.';
          errorCode = 'wrong_password';
        } else if (result.error.message.includes('Email not confirmed')) {
          userFriendlyMessage =
            'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.';
          errorCode = 'email_not_confirmed';
        } else if (result.error.message.includes('Too many requests')) {
          userFriendlyMessage =
            'Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer.';
          errorCode = 'too_many_requests';
        } else if (result.error.message.includes('signup_disabled')) {
          userFriendlyMessage =
            "Les inscriptions sont temporairement désactivées. Contactez l'administrateur.";
          errorCode = 'network_error';
        } else if (result.error.message.includes('email_address_invalid')) {
          userFriendlyMessage = "L'adresse email fournie n'est pas valide.";
          errorCode = 'invalid_credentials';
        } else {
          errorCode = 'unknown_error';
        }

        // Create type-safe error using utility function
        const enhancedError = createAuthError(
          userFriendlyMessage,
          errorCode,
          result.error
        );

        // Error is already properly typed and configured

        log.error('Sign in error:', enhancedError);
        setAuthError(enhancedError);
        return { data: null, error: enhancedError };
      }

      log.info('✅ Sign in successful');
      return {
        data: {
          user: result.data?.user || null,
          session: result.data?.session || null,
        },
        error: null
      };
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('Unexpected error during sign in:', err);
      setAuthError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    log.debug('🔐 Signing in with Google...');
    setLoading(true);

    try {
      const result = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`,
        },
      });

      if (result.error) {
        const authErr = result.error instanceof Error ? result.error : new Error(String(result.error));
        log.error('Error signing in with Google:', authErr.message);
        setAuthError(authErr);
        return { data: null, error: authErr };
      }

      log.info('✅ Google sign in initiated');
      return {
        data: result.data
          ? {
              provider: result.data.provider,
              url: result.data.url || `${window.location.origin}/user-dashboard`
            }
          : null,
        error: null
      };
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      log.error('Unexpected error during Google sign in:', err);
      setAuthError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };


  // Logout helper used by UI
  const logout = async (): Promise<void> => {
    try {
      log.debug('🚪 Logout initiated...');
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      log.error('❌ Erreur lors de la déconnexion:', err);
    } finally {
      log.debug('🧹 Cleaning up user state...');
      setUser(null);
      setUserProfile(null);
    }
  };



  // Reset password
  const resetPassword = async (email: string) => {
    log.debug('🔑 Sending reset password email for:', email);
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const authErr = error instanceof Error ? error : new Error(String(error));
        setAuthError(authErr);
        log.error('Error resetting password:', authErr.message);
        throw authErr;
      }

      log.info('✅ Password reset email sent');
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      setAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    log.debug('📧 Resending verification email for:', email);
    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        const authErr = error instanceof Error ? error : new Error(String(error));
        setAuthError(authErr);
        log.error('Error resending verification email:', authErr.message);
        throw authErr;
      }

      log.info('✅ Verification email resent');
    } catch (error) {
      const err = typeof error === 'string' ? new Error(error) : (error as Error);
      setAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = Boolean(userProfile?.is_admin);

  const value: AuthContextValue = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    logout,
    resetPassword,
    resendVerificationEmail,
    user,
    userProfile,
    session,
    loading,
    authError,
    profileError,
    isAdmin,
    clearAuthError,
    clearProfileError,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth };
