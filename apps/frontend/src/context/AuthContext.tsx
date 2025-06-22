// src/context/AuthContext.tsx
import React, {
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
  AuthResponse,
  OAuthResponse,
  AuthError,
} from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
  UpdateUserSettingsPayload,
  UpdateUserSettingsResponse,
  GetUserSettingsResponse,
} from '../types/rpc.types';
import type { UserProfile } from '../types/user';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import logger from '../utils/logger';

const supabaseClient = supabase as SupabaseClient<Database>;

export interface AuthContextValue {
  signUp: (args: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<AuthResponse>;
  signIn: (args: { email: string; password: string }) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (
    updates: UpdateUserProfilePayload['profile_data']
  ) => Promise<UpdateUserProfileResponse>;
  updateUserSettings: (
    settings: UpdateUserSettingsPayload['settings_data']
  ) => Promise<UpdateUserSettingsResponse>;
  getUserSettings: () => Promise<GetUserSettingsResponse>;
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
        logger.debug('🔍 Getting initial session...');
        const { data, error } = await safeQuery(() =>
          supabaseClient.auth.getSession()
        );
        if (error) throw error;
        const { session } = data;
        logger.debug('📋 Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          logger.debug('👤 User found, fetching profile...');
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth subscription
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      logger.debug('🔄 Auth state change event:', event);
      logger.debug('📋 Auth state change session:', session);
      logger.debug('⏰ Timestamp:', new Date().toISOString());

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        logger.debug('✅ User signed in, fetching profile...');
        await fetchUserProfile(session.user.id);
        if (window.location.pathname === '/verify-email') {
          navigate('/espace');
        }
      } else if (event === 'SIGNED_OUT') {
        logger.debug('🚪 User signed out, clearing profile...');
        setUserProfile(null);
      } else if (event === 'TOKEN_REFRESHED') {
        logger.debug('🔄 Token refreshed');
      } else if (event === 'USER_UPDATED') {
        logger.debug('👤 User updated');
        if (window.location.pathname === '/verify-email') {
          navigate('/espace');
        }
      }
    });

    return () => {
      logger.debug('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async userId => {
    try {
      logger.debug('🔍 Fetching profile for user:', userId);
      const { data, error } = await safeQuery(() =>
        supabaseClient.from('profiles').select('*').eq('id', userId)
      );

      if (error) {
        console.error('❌ Error fetching profile:', error.message);
        setError(error);
        return;
      }

      if (!data || data.length === 0) {
        logger.debug('⚠️ No profile found for user, creating default...');
        // Try to create a default profile
        const { data: newProfile, error: createError } = await safeQuery(() =>
          supabaseClient
            .from('profiles')
            .insert([
              {
                id: userId,
                email: user?.email || '',
                full_name: user?.user_metadata?.full_name || 'User',
                level: 1,
                xp: 0,
                current_streak: 0,
                is_admin: false,
              },
            ])
            .select()
            .single()
        );

        if (createError) {
          console.error('❌ Error creating profile:', createError.message);
          setError(createError);
          return;
        }

        logger.info('✅ Default profile created:', newProfile);
        setUserProfile(newProfile);
        return;
      }

      logger.debug('✅ Profile fetched successfully:', data[0]);
      setUserProfile(data[0]);
    } catch (error) {
      console.error('❌ Unexpected error in fetchUserProfile:', error);
      setError(error);
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
  }): Promise<AuthResponse> => {
    logger.debug('📝 Signing up user:', email);
    const { data, error } = await safeQuery(() =>
      supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      })
    );

    if (error) {
      console.error('❌ Sign up error:', error.message);
      // Don't set global error state for sign up failures - let the form handle it
      throw error;
    }
    logger.info('✅ Sign up successful');
    return data;
  };

  // Sign In with email
  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    logger.debug('🔐 Signing in user:', email);

    const { data, error } = await safeQuery(() =>
      supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
    );

    if (error) {
      // Provide more specific error messages based on what Supabase actually returns
      let userFriendlyMessage =
        'Les identifiants fournis sont incorrects. Vérifiez votre email et mot de passe.';
      const enhancedError = new Error(userFriendlyMessage);
      enhancedError.originalError = error;

      // Note: Supabase intentionally returns generic "Invalid login credentials"
      // for security reasons, so we can't distinguish between wrong email vs wrong password
      if (error.message.includes('Invalid login credentials')) {
        userFriendlyMessage = 'Mot de passe incorrect.';
        enhancedError.code = 'wrong_password';
      } else if (error.message.includes('Email not confirmed')) {
        userFriendlyMessage =
          'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.';
        enhancedError.code = 'email_not_confirmed';
      } else if (error.message.includes('Too many requests')) {
        userFriendlyMessage =
          'Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer.';
      } else if (error.message.includes('signup_disabled')) {
        userFriendlyMessage =
          "Les inscriptions sont temporairement désactivées. Contactez l'administrateur.";
      } else if (error.message.includes('email_address_invalid')) {
        userFriendlyMessage = "L'adresse email fournie n'est pas valide.";
      }

      enhancedError.message = userFriendlyMessage;
      enhancedError.code = enhancedError.code || 'invalid_credentials';

      // Don't set global error state for sign in failures - let the form handle it
      throw enhancedError;
    }

    logger.info('✅ Sign in successful');
    return data;
  };

  // Sign In with Google
  const signInWithGoogle = async (): Promise<OAuthResponse> => {
    logger.debug('🔐 Signing in with Google...');
    const { data, error } = await safeQuery(() =>
      supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`,
        },
      })
    );

    if (error) {
      setError(error);
      throw error;
    }
    logger.info('✅ Google sign in initiated');
    return data;
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    logger.debug('🚪 Signing out user...');
    const { error } = await safeQuery(() => supabaseClient.auth.signOut());
    if (error) {
      setError(error);
      throw error;
    }
    logger.info('✅ Sign out successful');
  };

  // Logout helper used by UI
  const logout = async (): Promise<void> => {
    try {
      logger.debug('🚪 Logout initiated...');
      await signOut();
    } catch (err) {
      console.error('❌ Erreur lors de la déconnexion:', err);
    } finally {
      logger.debug('🧹 Cleaning up user state...');
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('authToken');
      logger.debug('🏠 Navigating to home...');
      navigate('/');
    }
  };

  // Update user profile using RPC function
  const updateProfile = useCallback(
    async (
      updates: UpdateUserProfilePayload['profile_data']
    ): Promise<UpdateUserProfileResponse> => {
      logger.debug('📝 Updating profile:', updates);

      const { data, error } = await safeQuery(() =>
        supabaseClient.rpc('update_user_profile', {
          profile_data: updates,
          user_id: user.id,
        })
      );

    if (error) {
      setError(error);
      throw error;
    }

    logger.info('✅ Profile updated successfully:', data);

    setUserProfile(data);

      return data;
    },
    []
  );

  // Update user settings using RPC function
  const updateUserSettings = useCallback(
    async (
      settings: UpdateUserSettingsPayload['settings_data']
    ): Promise<UpdateUserSettingsResponse> => {
      logger.debug('📝 Updating user settings:', settings);

      const { data, error } = await safeQuery(() =>
        supabaseClient.rpc('update_user_settings', {
          settings_data: settings,
        })
      );

    if (error) {
      setError(error);
      throw error;
    }

    logger.info('✅ Settings updated successfully:', data);
      return data;
    },
    []
  );

  // Get user settings using RPC function
  const getUserSettings = useCallback(async (): Promise<GetUserSettingsResponse> => {
    logger.debug('🔍 Getting user settings...');

    const { data, error } = await safeQuery(() =>
      supabaseClient.rpc('get_user_settings').single()
    );

    if (error) {
      setError(error);
      throw error;
    }

    logger.debug('✅ Settings retrieved successfully:', data);
    return data;
  }, []);

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    logger.debug('🔄 Resetting password for:', email);
    const { error } = await safeQuery(() =>
      supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
    );
    if (error) {
      setError(error);
      throw error;
    }
    logger.info('✅ Password reset email sent');
  };

  const resendVerificationEmail = async (email: string): Promise<void> => {
    logger.debug('🔄 Resending verification email for:', email);
    const { error } = await safeQuery(() =>
      supabaseClient.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/verify-email` },
      })
    );
    if (error) {
      throw error;
    }
    logger.info('✅ Verification email resent');
  };

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
    isAdmin: userProfile?.is_admin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
