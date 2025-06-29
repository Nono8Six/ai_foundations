// src/context/AuthContext.tsx
const toJson = (v: unknown): Json => v as Json;

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  Session,
  User,
  SupabaseClient,
  AuthError,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import type { Database, Json } from '@frontend/types/database.types';
import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
} from '@frontend/types/rpc.types';
import type { UserProfile } from '@frontend/types/user';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { log } from '@libs/logger';
import type { AuthErrorWithCode } from '@frontend/types/auth';

// Déclaration du type UserSettings aligné sur ta table user_settings (DB et TS)
export interface UserSettings {
  id: string;
  user_id: string;
  notification_settings: Record<string, unknown>;
  privacy_settings: Record<string, unknown>;
  learning_preferences: Record<string, unknown>;
  created_at: string | null;
  updated_at: string | null;
}

const supabaseClient = supabase as SupabaseClient<Database>;

export interface AuthContextValue {
  signUp: (args: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  signIn: (args: { email: string; password: string }) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
  signInWithGoogle: () => Promise<{ data: { provider: string; url: string } | null; error: Error | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (updates: UpdateUserProfilePayload['profile_data']) => Promise<UpdateUserProfileResponse>;
  updateUserSettings: (updates: Partial<UserSettings>) => Promise<UserSettings | null>;
  getUserSettings: () => Promise<UserSettings | null>;
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: unknown;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

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

        if (session?.user) {
          log.debug('👤 User found, fetching profile...');
          await fetchUserProfile(session.user.id).catch(err => {
            log.error('Failed to fetch user profile:', err);
          });
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        log.error('❌ Error getting initial session:', error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth subscription
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        log.debug('🔄 Auth state change event:', event);
        log.debug('📋 Auth state change session:', session);
        log.debug('⏰ Timestamp:', new Date().toISOString());

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          log.debug('✅ User signed in, fetching profile...');
          await fetchUserProfile(session.user.id);
          if (window.location.pathname === '/verify-email') {
            navigate('/espace');
          }
        } else if (event === 'SIGNED_OUT') {
          log.debug('🚪 User signed out, clearing profile...');
          setUserProfile(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      log.debug('🔍 Fetching profile for user:', userId);
      const { data: profileData, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId);

      if (error) {
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error fetching profile:', authError.message);
        return;
      }

      if (!profileData || profileData.length === 0) {
        log.debug('⚠️ No profile found for user, creating default...');
        // Try to create a default profile
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || 'User',
          level: 1,
          xp: 0,
          current_streak: 0,
          is_admin: false,
          avatar_url: null,
          phone: null,
          profession: null,
          company: null,
          last_completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: newProfileData, error: createError } = await supabaseClient
          .from('profiles')
          .insert([defaultProfile])
          .select()
          .single();

        if (createError) {
          const authError = createError instanceof Error ? createError : new Error(String(createError));
          setError(authError);
          log.error('Error creating profile:', authError.message);
          return;
        }

        if (newProfileData) {
          log.info('✅ Default profile created:', newProfileData);
          setUserProfile(newProfileData as UserProfile);
        }
        return;
      }

      if (profileData && profileData.length > 0) {
        const profile = profileData[0] as UserProfile;
        setUserProfile(profile);
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error in fetchUserProfile');
      log.error('❌ Unexpected error in fetchUserProfile:', err);
      setError(err);
    }
  };

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
        const authError = result.error instanceof Error ? result.error : new Error(String(result.error));
        log.error('Error signing up:', authError.message);
        setError(authError);
        return { data: null, error: authError };
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
      const err = error instanceof Error ? error : new Error('Unknown error during sign up');
      log.error('Unexpected error during sign up:', err);
      setError(err);
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
        const enhancedError: AuthErrorWithCode = new Error(userFriendlyMessage);
        enhancedError.originalError = result.error;

        if (result.error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Mot de passe incorrect.';
          enhancedError.code = 'wrong_password';
        } else if (result.error.message.includes('Email not confirmed')) {
          userFriendlyMessage =
            'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.';
          enhancedError.code = 'email_not_confirmed';
        } else if (result.error.message.includes('Too many requests')) {
          userFriendlyMessage =
            'Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer.';
        } else if (result.error.message.includes('signup_disabled')) {
          userFriendlyMessage =
            "Les inscriptions sont temporairement désactivées. Contactez l'administrateur.";
        } else if (result.error.message.includes('email_address_invalid')) {
          userFriendlyMessage = "L'adresse email fournie n'est pas valide.";
        }

        enhancedError.message = userFriendlyMessage;
        enhancedError.code = enhancedError.code || 'invalid_credentials';

        log.error('Sign in error:', enhancedError);
        setError(enhancedError);
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
      const err = error instanceof Error ? error : new Error('Unknown error during sign in');
      log.error('Unexpected error during sign in:', err);
      setError(err);
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
        const authError = result.error instanceof Error ? result.error : new Error(String(result.error));
        log.error('Error signing in with Google:', authError.message);
        setError(authError);
        return { data: null, error: authError };
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
      const err = error instanceof Error ? error : new Error('Unknown error during Google sign in');
      log.error('Unexpected error during Google sign in:', err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    log.debug('🚪 Signing out user...');
    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error signing out:', authError.message);
        throw authError;
      }

      log.info('✅ Sign out successful');
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during sign out');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout helper used by UI
  const logout = async (): Promise<void> => {
    try {
      log.debug('🚪 Logout initiated...');
      await signOut();
    } catch (err) {
      log.error('❌ Erreur lors de la déconnexion:', err);
    } finally {
      log.debug('🧹 Cleaning up user state...');
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('authToken');
      log.debug('🏠 Navigating to home...');
      navigate('/');
    }
  };

  // Update user profile using RPC function
  const updateProfile = useCallback(
    async (
      updates: UpdateUserProfilePayload['profile_data']
    ): Promise<UpdateUserProfileResponse> => {
      log.debug('📝 Updating profile:', updates);

      if (!user) {
        const error = new Error('No user is currently signed in');
        setError(error);
        log.error('Error updating profile:', error.message);
        throw error;
      }

      if (!updates) {
        throw new Error('Profile data is required for update');
      }

      try {
        const { data, error } = await supabaseClient.rpc('update_user_profile', {
          profile_data: updates,
          user_id: user.id,
        });

        if (error) throw error;

        const profileData = (Array.isArray(data) ? data[0] : data) as UpdateUserProfileResponse;

        if (profileData) {
          log.info('✅ Profile updated successfully:', profileData);
          setUserProfile({
            ...userProfile,
            ...profileData,
            id: user.id,
            email: user.email || '',
          } as UserProfile);
          return profileData;
        }

        throw new Error('No data returned from update_user_profile');
      } catch (error) {
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error updating profile:', authError.message);
        throw authError;
      }
    },
    [user, userProfile]
  );

  // Get user settings (pour user courant)
  const getUserSettings = async (): Promise<UserSettings | null> => {
    if (!user) return null;
    try {
      log.debug('⚙️ Fetching user settings for user:', user.id);
      const { data, error } = await supabaseClient
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error fetching user settings:', authError.message);
        return null;
      }

      if (data && data.length > 0) {
        const settings = data[0];
        log.debug('✅ User settings found:', settings);

        const typedSettings: UserSettings = {
          id: settings.id,
          user_id: settings.user_id,
          notification_settings: (settings.notification_settings as Record<string, unknown>) || {},
          privacy_settings: (settings.privacy_settings as Record<string, unknown>) || {},
          learning_preferences: (settings.learning_preferences as Record<string, unknown>) || {},
          created_at: settings.created_at || null,
          updated_at: settings.updated_at || null,
        };

        return typedSettings;
      }

      // Si aucun paramétrage existant, créer les settings par défaut
      log.debug('⚠️ No user settings found, creating default settings...');
      const defaultSettings = {
        user_id: user.id,
        notification_settings: toJson({ email: true, push: true }),
        privacy_settings: toJson({ show_email: false, show_activity: true }),
        learning_preferences: toJson({ difficulty: 'beginner', theme: 'light' }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: newSettings, error: createError } = await supabaseClient
        .from('user_settings')
        .insert([defaultSettings])
        .select()
        .single();

      if (createError) {
        const authError = createError instanceof Error ? createError : new Error(String(createError));
        setError(authError);
        log.error('Error creating default user settings:', authError.message);
        return null;
      }

      log.info('✅ Default user settings created:', newSettings);

      return {
        id: newSettings.id,
        user_id: newSettings.user_id,
        notification_settings: (newSettings.notification_settings as Record<string, unknown>) || {},
        privacy_settings: (newSettings.privacy_settings as Record<string, unknown>) || {},
        learning_preferences: (newSettings.learning_preferences as Record<string, unknown>) || {},
        created_at: newSettings.created_at || null,
        updated_at: newSettings.updated_at || null,
      };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error in getUserSettings');
      log.error('❌ Unexpected error in getUserSettings:', err);
      setError(err);
      return null;
    }
  };

  // Update user settings (pour user courant)
  const updateUserSettings = async (
    updates: Partial<UserSettings>
  ): Promise<UserSettings | null> => {
    if (!user) return null;
    try {
      log.debug('⚙️ Updating user settings for user:', user.id, updates);

      // Récupère les settings existants (pour merge)
      const current = await getUserSettings();

      const merged = {
        ...current,
        ...updates,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseClient
  .from('user_settings')
  .update({
    notification_settings: toJson(merged.notification_settings),
    privacy_settings: toJson(merged.privacy_settings),
    learning_preferences: toJson(merged.learning_preferences),
    updated_at: merged.updated_at,
  })
  .eq('user_id', user.id)
  .select();

      if (error) {
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error updating user settings:', authError.message);
        return null;
      }

      if (data && data.length > 0) {
        const updated = data[0];
        log.info('✅ User settings updated:', updated);

        const typedSettings: UserSettings = {
          id: updated.id,
          user_id: updated.user_id,
          notification_settings: (updated.notification_settings as Record<string, unknown>) || {},
          privacy_settings: (updated.privacy_settings as Record<string, unknown>) || {},
          learning_preferences: (updated.learning_preferences as Record<string, unknown>) || {},
          created_at: updated.created_at || null,
          updated_at: updated.updated_at || null,
        };

        return typedSettings;
      }

      return null;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error in updateUserSettings');
      log.error('❌ Unexpected error in updateUserSettings:', err);
      setError(err);
      return null;
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
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error resetting password:', authError.message);
        throw authError;
      }

      log.info('✅ Password reset email sent');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during reset password');
      setError(err);
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
        const authError = error instanceof Error ? error : new Error(String(error));
        setError(authError);
        log.error('Error resending verification email:', authError.message);
        throw authError;
      }

      log.info('✅ Verification email resent');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during resend verification');
      setError(err);
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
    updateProfile,
    updateUserSettings,
    getUserSettings,
    user,
    userProfile,
    session,
    loading,
    error,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
