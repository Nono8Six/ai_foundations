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
import { setRememberMePreference } from '@core/supabase/storage';
import { rbacApi, type SystemRole } from '@frontend/data/rbacApi';
import { useSessionManagement } from '@shared/hooks/useSessionManagement';
// Profile management aligned with DB (no XP/level coupling)
import { profileApi } from '@frontend/data/profileApi';
import { ROUTES } from '@shared/constants/routes';

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
  signIn: (_credentials: { email: string; password: string; remember?: boolean }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
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
  rolesLoading: boolean;
  roles: SystemRole[];
  hasRole: (role: SystemRole) => boolean;
  hasAnyRole: (roles: SystemRole[]) => boolean;
  permissionsLoading: boolean;
  permissions: string[];
  hasPermission: (perm: string) => boolean;
  hasAnyPermission: (perms: string[]) => boolean;
  refreshUserProfile: () => Promise<void>;
  clearAuthError: () => void;
  clearProfileError: () => void;
  refreshUserRoles: () => Promise<void>;
  refreshUserPermissions: () => Promise<void>;
}

const [AuthContext, useAuth] = createContextStrict<AuthContextValue>();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Session management integration
  const sessionManagement = useSessionManagement();
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
      const profile = await profileApi.getProfile(user.id);
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
      setRoles([]);
      setAuthError(null);
      setProfileError(null);
      log.debug('✅ User signed out successfully');
      navigate(ROUTES.login);
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
          // Note: Ne pas faire d'appels API ici - attendre onAuthStateChange
          // pour garantir que le JWT token est correctement attaché
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

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
          log.debug('✅ User signed in');
          // Démarrer le monitoring des tokens
          startTokenMonitoring();
          
          // DÉLAI CRITIQUE : Attendre que le JWT token soit complètement attaché
          // Augmenté à 200ms pour OAuth flows plus robuste
          setTimeout(() => {
            // Charger les rôles
            void (async () => {
              try {
                setRolesLoading(true);
                const fetched = await rbacApi.getUserRoles(session.user!.id);
                setRoles(fetched);
              log.debug('🔐 Roles loaded (SIGNED_IN):', fetched);
            } catch (e) {
              log.warn('Could not load user roles on sign-in', e);
              setRoles([]);
            } finally {
              setRolesLoading(false);
            }
          })();
          
          // Charger les permissions
          void (async () => {
            try {
              setPermissionsLoading(true);
              const perms = await rbacApi.getUserPermissions(session.user!.id);
              setPermissions(perms);
              log.debug('🔐 Permissions loaded (SIGNED_IN):', perms);
            } catch (e) {
              log.warn('Could not load user permissions on sign-in', e);
              setPermissions([]);
            } finally {
              setPermissionsLoading(false);
            }
          })();
          
          // Redirection post-auth contrôlée (vers espace)
          // Ne rediriger que depuis les pages d'authentification, pas depuis la page d'accueil
          if (
            window.location.pathname === '/verify-email' ||
            window.location.pathname === '/login'
          ) {
            navigate(ROUTES.postAuth);
          }
          }, 200); // 200ms pour laisser le JWT token se propager complètement
        } else if (event === 'SIGNED_OUT') {
          log.debug('🚪 User signed out, clearing profile...');
          setUserProfile(null);
          // Arrêter le monitoring des tokens
          stopTokenMonitoring();
          setRoles([]);
          setPermissions([]);
        } else if (event === 'USER_UPDATED') {
          log.debug('👤 User updated');
          if (window.location.pathname === '/verify-email') {
            navigate(ROUTES.postAuth);
          }
          // Best-effort: si l'email est confirmé, marquer profiles.email_verified = true
          const u = session?.user;
          if (u?.email_confirmed_at) {
            void (async () => {
              try {
                await supabaseClient.from('profiles').update({ email_verified: true }).eq('id', u.id);
              } catch (e) {
                log.warn('Could not update profiles.email_verified', e);
              }
            })();
          }
        } else if (event === 'PASSWORD_RECOVERY') {
          log.debug('🔑 PASSWORD_RECOVERY event - navigating to /reset-password');
          navigate('/reset-password');
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
      await new Promise<void>((resolve) => { setTimeout(resolve, 150); });
      
      try {
        // Ensure profile exists then load it
        await profileApi.ensureProfile(user);
        const profile = await profileApi.getProfile(user.id);
        setUserProfile(profile);
        setProfileError(null);
        log.debug('✅ User profile loaded successfully:', profile);
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
        
        // Handle specific error cases
        let userFriendlyMessage = authErr.message;
        if (authErr.message.includes('User already registered') || authErr.message.includes('already registered')) {
          userFriendlyMessage = 'Cette adresse email est déjà utilisée. Essayez de vous connecter ou utilisez "Mot de passe oublié".';
        } else if (authErr.message.includes('email') && authErr.message.includes('invalid')) {
          userFriendlyMessage = 'Adresse email invalide.';
        } else if (authErr.message.includes('password')) {
          userFriendlyMessage = 'Le mot de passe ne respecte pas les exigences de sécurité.';
        } else if (authErr.message.includes('signup disabled') || authErr.message.includes('signups not allowed')) {
          userFriendlyMessage = 'Les inscriptions sont temporairement désactivées. Contactez le support.';
        }
        
        const friendlyError = new Error(userFriendlyMessage);
        log.error('Error signing up:', authErr.message);
        setAuthError(friendlyError);
        return { data: null, error: friendlyError };
      }

      // Check if user was actually created (not just existing user)
      if (!result.data?.user) {
        // This can happen when email already exists but signup "succeeds"
        const existingUserError = new Error('Cette adresse email est déjà utilisée. Essayez de vous connecter ou utilisez "Mot de passe oublié".');
        log.warn('Signup returned success but no user - email likely already exists');
        setAuthError(existingUserError);
        return { data: null, error: existingUserError };
      }

      // CRITICAL: If user exists but no session, it means email already exists
      // This is Supabase security behavior: returns fake user object but no session for existing emails
      if (result.data?.user && !result.data?.session) {
        const existingUserError = new Error('Cet email est déjà utilisé. Connectez-vous ou récupérez votre mot de passe.');
        log.warn('🚫 EXISTING EMAIL DETECTED - Signup blocked', {
          email,
          hasUser: !!result.data?.user,
          hasSession: !!result.data?.session,
          userId: result.data?.user?.id
        });
        setAuthError(existingUserError);
        return { data: null, error: existingUserError };
      }

      // Now we can safely log success since we passed all validations
      log.info('✅ Sign up successful - New user created', { 
        userId: result.data.user.id, 
        hasSession: !!result.data.session,
        userCreatedAt: result.data.user.created_at,
        emailConfirmedAt: result.data.user.email_confirmed_at 
      });

      // Debug: Log full result for investigation
      console.log('FULL SIGNUP RESULT:', {
        data: result.data,
        user: result.data?.user,
        session: result.data?.session,
        userDetails: result.data?.user ? {
          id: result.data.user.id,
          email: result.data.user.email,
          created_at: result.data.user.created_at,
          email_confirmed_at: result.data.user.email_confirmed_at,
          last_sign_in_at: result.data.user.last_sign_in_at
        } : null
      });

      // If a session is available immediately (e.g., email confirmation disabled),
      // provision the profile right away to guarantee backend profile creation.
      try {
        const u = result.data?.user ?? null;
        const s = result.data?.session ?? null;
        if (u && s) {
          await profileApi.ensureProfile(u);
          log.debug('👤 Profile provisioned at signup');
        }
      } catch (e) {
        log.warn('Profile provisioning at signup failed (will retry after login)', e);
      }
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
    remember,
  }: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    log.debug('🔐 Signing in user:', email);
    setLoading(true);

    try {
      // Apply remember-me preference before authentication so storage persists accordingly
      if (typeof remember === 'boolean') {
        setRememberMePreference(remember);
      }
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
      // Roles will be loaded via onAuthStateChange
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
          scopes: 'openid email profile',
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
          ? { provider: result.data.provider, url: result.data.url || `${window.location.origin}` }
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
      // Use main client for password reset
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
  const hasRole = useCallback((role: SystemRole) => roles.includes(role), [roles]);
  const hasAnyRole = useCallback(
    (required: SystemRole[]) => required.some(r => roles.includes(r)),
    [roles]
  );
  const hasPermission = useCallback((perm: string) => permissions.includes(perm), [permissions]);
  const hasAnyPermission = useCallback(
    (perms: string[]) => perms.some(p => permissions.includes(p)),
    [permissions]
  );

  const refreshUserRoles = useCallback(async () => {
    if (!user) return;
    try {
      const fetched = await rbacApi.getUserRoles(user.id);
      setRoles(fetched);
      log.debug('🔐 Roles refreshed:', fetched);
    } catch (e) {
      log.warn('Could not refresh user roles', e);
      setRoles([]);
    }
  }, [user]);
  const refreshUserPermissions = useCallback(async () => {
    if (!user) return;
    try {
      const perms = await rbacApi.getUserPermissions(user.id);
      setPermissions(perms);
      log.debug('🔐 Permissions refreshed:', perms);
    } catch (e) {
      log.warn('Could not refresh user permissions', e);
      setPermissions([]);
    }
  }, [user]);

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
    rolesLoading,
    permissionsLoading,
    roles,
    hasRole,
    hasAnyRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    clearAuthError,
    clearProfileError,
    refreshUserProfile,
    refreshUserRoles,
    refreshUserPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth };
