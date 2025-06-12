// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get session on initial load
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data, error } = await safeQuery(() => supabase.auth.getSession());
        if (error) throw error;
        const { session } = data;
        console.log('📋 Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('👤 User found, fetching profile...');
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change event:', event);
      console.log('📋 Auth state change session:', session);
      console.log('⏰ Timestamp:', new Date().toISOString());

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in, fetching profile...');
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out, clearing profile...');
        setUserProfile(null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
      } else if (event === 'USER_UPDATED') {
        console.log('👤 User updated');
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async userId => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await safeQuery(() =>
        supabase.from('profiles').select('*').eq('id', userId)
      );
      
      if (error) {
        console.error('❌ Error fetching profile:', error.message);
        setError(error);
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No profile found for user, creating default...');
        // Try to create a default profile
        const { data: newProfile, error: createError } = await safeQuery(() =>
          supabase.from('profiles').insert([
            {
              id: userId,
              email: user?.email || '',
              full_name: user?.user_metadata?.full_name || 'User',
              level: 1,
              xp: 0,
              current_streak: 0,
              is_admin: false
            }
          ]).select().single()
        );
        
        if (createError) {
          console.error('❌ Error creating profile:', createError.message);
          setError(createError);
          return;
        }
        
        console.log('✅ Default profile created:', newProfile);
        setUserProfile(newProfile);
        return;
      }

      console.log('✅ Profile fetched successfully:', data[0]);
      setUserProfile(data[0]);
    } catch (error) {
      console.error('❌ Unexpected error in fetchUserProfile:', error);
      setError(error);
    }
  };

  // Sign Up with email
  const signUp = async ({ email, password, firstName, lastName }) => {
    console.log('📝 Signing up user:', email);
    const { data, error } = await safeQuery(() =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
          },
        },
      })
    );

    if (error) {
      console.error('❌ Sign up error:', error.message);
      // Don't set global error state for sign up failures - let the form handle it
      throw error;
    }
    console.log('✅ Sign up successful');
    return data;
  };

  // Sign In with email
  const signIn = async ({ email, password }) => {
    console.log('🔐 Signing in user:', email);
    
    try {
      const { data, error } = await safeQuery(() =>
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );
      
      if (error) {
        console.error('❌ Supabase auth error:', error);
        
        // Provide more specific error messages
        let userFriendlyMessage = 'Email ou mot de passe incorrect';
        
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Les identifiants fournis sont incorrects. Vérifiez votre email et mot de passe.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.';
        } else if (error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer.';
        } else if (error.message.includes('User not found')) {
          userFriendlyMessage = 'Aucun compte trouvé avec cette adresse email. Vérifiez l\'email ou créez un nouveau compte.';
        } else if (error.message.includes('Invalid password')) {
          userFriendlyMessage = 'Mot de passe incorrect. Vérifiez votre mot de passe ou utilisez "Mot de passe oublié".';
        }
        
        const enhancedError = new Error(userFriendlyMessage);
        enhancedError.originalError = error;
        enhancedError.code = error.code || 'auth_error';
        
        // Don't set global error state for sign in failures - let the form handle it
        throw enhancedError;
      }
      
      console.log('✅ Sign in successful');
      return data;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    console.log('🔐 Signing in with Google...');
    const { data, error } = await safeQuery(() =>
      supabase.auth.signInWithOAuth({
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
    console.log('✅ Google sign in initiated');
    return data;
  };

  // Sign Out
  const signOut = async () => {
    console.log('🚪 Signing out user...');
    const { error } = await safeQuery(() => supabase.auth.signOut());
    if (error) {
      setError(error);
      throw error;
    }
    console.log('✅ Sign out successful');
  };

  // Logout helper used by UI
  const logout = async () => {
    try {
      console.log('🚪 Logout initiated...');
      await signOut();
    } catch (err) {
      console.error('❌ Erreur lors de la déconnexion:', err);
    } finally {
      console.log('🧹 Cleaning up user state...');
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('authToken');
      console.log('🏠 Navigating to home...');
      navigate('/');
    }
  };

  // Update user profile using RPC function
  const updateProfile = async updates => {
    console.log('📝 Updating profile:', updates);

    const { data, error } = await safeQuery(() =>
      supabase.rpc('update_user_profile', {
        profile_data: updates,
      })
    );

    if (error) {
      setError(error);
      throw error;
    }

    console.log('✅ Profile updated successfully:', data);

    setUserProfile(data);

    return data;
  };

  // Update user settings using RPC function
  const updateUserSettings = async settings => {
    console.log('📝 Updating user settings:', settings);

    const { data, error } = await safeQuery(() =>
      supabase.rpc('update_user_settings_rpc', {
        settings_data: settings,
      })
    );

    if (error) {
      setError(error);
      throw error;
    }

    console.log('✅ Settings updated successfully:', data);
    return data;
  };

  // Get user settings using RPC function
  const getUserSettings = async () => {
    console.log('🔍 Getting user settings...');

    const { data, error } = await safeQuery(() => supabase.rpc('get_user_settings_rpc'));

    if (error) {
      setError(error);
      throw error;
    }

    const settings = data
      ? {
          notification_settings: data.notification_settings,
          privacy_settings: data.privacy_settings,
          learning_preferences: data.learning_preferences,
        }
      : null;

    console.log('✅ Settings retrieved successfully:', settings);
    return settings;
  };

  // Reset password
  const resetPassword = async email => {
    console.log('🔄 Resetting password for:', email);
    const { error } = await safeQuery(() =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
    );
    if (error) {
      setError(error);
      throw error;
    }
    console.log('✅ Password reset email sent');
  };

  const value = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    logout,
    resetPassword,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};