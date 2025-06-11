// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
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
        const {
          data: { session },
        } = await supabase.auth.getSession();
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
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
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
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) throw error;
      
      console.log('✅ Profile fetched successfully:', data);
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error.message);
      setError(error);
      return null;
    }
  };

  // Sign Up with email
  const signUp = async ({ email, password, firstName, lastName }) => {
    try {
      console.log('📝 Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) throw error;
      console.log('✅ Sign up successful');
      return data;
    } catch (error) {
      console.error('❌ Error signing up:', error.message);
      setError(error);
      throw error;
    }
  };

  // Sign In with email
  const signIn = async ({ email, password }) => {
    try {
      console.log('🔐 Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('✅ Sign in successful');
      return data;
    } catch (error) {
      console.error('❌ Error signing in:', error.message);
      setError(error);
      throw error;
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Signing in with Google...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`,
        },
      });

      if (error) throw error;
      console.log('✅ Google sign in initiated');
      return data;
    } catch (error) {
      console.error('❌ Error signing in with Google:', error.message);
      setError(error);
      throw error;
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      console.log('🚪 Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Error signing out:', error.message);
      setError(error);
      throw error;
    }
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

  // Update user profile
  const updateProfile = async updates => {
    try {
      console.log('📝 Updating profile:', updates);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();

      if (error) throw error;
      
      console.log('✅ Profile updated successfully:', data);
      
      // Update local state with the new profile data
      setUserProfile(prev => ({ ...prev, ...updates }));
      
      return data;
    } catch (error) {
      console.error('❌ Error updating profile:', error.message);
      setError(error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async email => {
    try {
      console.log('🔄 Resetting password for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      console.log('✅ Password reset email sent');
    } catch (error) {
      console.error('❌ Error resetting password:', error.message);
      setError(error);
      throw error;
    }
  };

  const value = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    logout,
    resetPassword,
    updateProfile,
    fetchUserProfile,
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