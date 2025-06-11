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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error.message);
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
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async userId => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      setError(error);
    }
  };

  // Sign Up with email
  const signUp = async ({ email, password, firstName, lastName }) => {
    try {
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
      return data;
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error);
      throw error;
    }
  };

  // Sign In with email
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError(error);
      throw error;
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/user-dashboard`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setError(error);
      throw error;
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error.message);
      setError(error);
      throw error;
    }
  };

  // Logout helper used by UI
  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('authToken');
      navigate('/');
      window.location.assign('/');
    }
  };

  // Update user profile
  const updateProfile = async updates => {
    try {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id);

      if (error) throw error;
      setUserProfile({ ...userProfile, ...updates });
      return data;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setError(error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async email => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error.message);
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
