import type { SupabaseClient, User } from '@supabase/supabase-js';
import { supabase } from '@core/supabase/client';
import type { Database, Json } from '@frontend/types/database.types';
import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
} from '@frontend/types/rpc.types';
import type { UserProfile } from '@frontend/types/user';
import type {
  UserSettings,
  NotificationSettings,
  PrivacySettings,
  LearningPreferences,
} from '@frontend/types/userSettings';
import {
  NotificationSettingsSchema,
  PrivacySettingsSchema,
  LearningPreferencesSchema,
} from '@frontend/types/userSettingsSchemas';
import { log } from '@libs/logger';

const supabaseClient = supabase as SupabaseClient<Database>;

const toJson = <T extends Json>(v: T): Json => v;

const parseNotificationSettings = (v: Json | null): NotificationSettings => {
  const parsed = NotificationSettingsSchema.safeParse(v);
  if (!parsed.success) {
    throw new Error(`Invalid notification settings: ${parsed.error.message}`);
  }
  return parsed.data;
};

const parsePrivacySettings = (v: Json | null): PrivacySettings => {
  const parsed = PrivacySettingsSchema.safeParse(v);
  if (!parsed.success) {
    throw new Error(`Invalid privacy settings: ${parsed.error.message}`);
  }
  return parsed.data;
};

const parseLearningPreferences = (v: Json | null): LearningPreferences => {
  const parsed = LearningPreferencesSchema.safeParse(v);
  if (!parsed.success) {
    throw new Error(`Invalid learning preferences: ${parsed.error.message}`);
  }
  return parsed.data;
};

export async function fetchUserProfile(user: User): Promise<UserProfile> {
  // Vérifier la session actuelle avant de faire la requête
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  
  if (sessionError) {
    log.error('❌ Session error:', sessionError);
    throw new Error('Session not valid');
  }
  
  if (!sessionData.session) {
    log.error('❌ No active session found');
    throw new Error('No active session');
  }
  
  log.debug('📋 Session user ID:', sessionData.session.user.id);
  log.debug('📋 Requested user ID:', user.id);
  log.debug('📋 Session access token length:', sessionData.session.access_token.length);
  log.debug('📋 Token expires at:', sessionData.session.expires_at ? new Date(sessionData.session.expires_at * 1000).toISOString() : 'never');
  
  // Vérifier si le token n'est pas expiré
  const now = Math.floor(Date.now() / 1000);
  if (sessionData.session.expires_at && sessionData.session.expires_at < now) {
    log.error('❌ Token is expired');
    throw new Error('Token expired - please sign in again');
  }
  
  // Forcer l'utilisation du token en configurant les headers
  const { data: profileData, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id);

  if (error) {
    log.error('❌ Error fetching user profile:', error);
    log.error('❌ Error code:', error.code);
    log.error('❌ Error message:', error.message);
    log.error('❌ Error details:', error.details);
    
    // Si c'est une erreur 500, c'est probablement un problème d'authentification JWT
    if (error.message.includes('Internal Server Error') || error.message.includes('500')) {
      log.error('❌ 500 error detected - likely JWT authentication issue');
      
      // Essayer de rafraîchir la session
      try {
        const { data: refreshData, error: refreshError } = await supabaseClient.auth.refreshSession();
        if (refreshError) {
          log.error('❌ Session refresh failed:', refreshError);
          throw new Error('Authentication failed - please sign in again');
        }
        
        if (refreshData.session) {
          log.debug('✅ Session refreshed successfully');
          // Retry la requête avec la session rafraîchie
          const { data: retryData, error: retryError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id);
            
          if (retryError) {
            log.error('❌ Retry failed after session refresh:', retryError);
            throw new Error('Authentication failed - please sign in again');
          }
          
          if (retryData && retryData.length > 0) {
            return retryData[0] as UserProfile;
          }
        }
      } catch (refreshErr) {
        log.error('❌ Session refresh attempt failed:', refreshErr);
        throw new Error('Authentication failed - please sign in again');
      }
    }
    
    // If it's an authentication/RLS error, throw a more specific error
    if (error.message.includes('row-level security') || error.message.includes('authentication')) {
      throw new Error('User not properly authenticated');
    }
    throw error;
  }

  if (!profileData || profileData.length === 0) {
    const defaultProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      full_name: (user.user_metadata as { full_name?: string })?.full_name || 'User',
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
      updated_at: new Date().toISOString(),
    };

    const { data: newProfile, error: createError } = await supabaseClient
      .from('profiles')
      .insert([defaultProfile])
      .select()
      .single();

    if (createError) throw createError;
    return newProfile as UserProfile;
  }

  return profileData[0] as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: UpdateUserProfilePayload['profile_data']
): Promise<UpdateUserProfileResponse> {
  const { data, error } = await supabaseClient.rpc('update_user_profile', {
    profile_data: updates,
    user_id: userId,
  });

  if (error) throw error;

  const profileData = (Array.isArray(data) ? data[0] : data) as UpdateUserProfileResponse;
  if (!profileData) throw new Error('No data returned from update_user_profile');
  return profileData;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabaseClient
    .from('user_settings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  if (data && data.length > 0) {
    const settings = data[0];
    if (!settings) {
      throw new Error('No settings data found');
    }
    return {
      id: settings.id,
      user_id: settings.user_id,
      notification_settings: parseNotificationSettings(settings.notification_settings),
      privacy_settings: parsePrivacySettings(settings.privacy_settings),
      learning_preferences: parseLearningPreferences(settings.learning_preferences),
      created_at: settings.created_at || null,
      updated_at: settings.updated_at || null,
    };
  }

  const defaultSettings = {
    user_id: userId,
    notification_settings: toJson({
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true,
      achievementAlerts: true,
      reminderNotifications: true,
    }),
    privacy_settings: toJson({
      profileVisibility: 'private',
      showProgress: false,
      showAchievements: true,
      allowMessages: false,
    }),
    learning_preferences: toJson({
      dailyGoal: 30,
      preferredDuration: 'medium',
      difficultyProgression: 'adaptive',
      language: 'fr',
      autoplay: true,
    }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: newSettings, error: createError } = await supabaseClient
    .from('user_settings')
    .insert([defaultSettings])
    .select()
    .single();

  if (createError) throw createError;

  if (!newSettings) {
    throw new Error('Failed to create new settings');
  }
  
  return {
    id: newSettings.id,
    user_id: newSettings.user_id,
    notification_settings: parseNotificationSettings(newSettings.notification_settings),
    privacy_settings: parsePrivacySettings(newSettings.privacy_settings),
    learning_preferences: parseLearningPreferences(newSettings.learning_preferences),
    created_at: newSettings.created_at || null,
    updated_at: newSettings.updated_at || null,
  };
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings | null> {
  const current = await getUserSettings(userId);

  const merged = {
    ...current,
    ...updates,
    user_id: userId,
    updated_at: new Date().toISOString(),
  };

  // Convertir les objets en JSON de manière sûre
  const notificationSettingsJson = merged.notification_settings 
    ? toJson(merged.notification_settings as unknown as Json) 
    : null;
  
  const privacySettingsJson = merged.privacy_settings 
    ? toJson(merged.privacy_settings as unknown as Json) 
    : null;
    
  const learningPreferencesJson = merged.learning_preferences 
    ? toJson(merged.learning_preferences as unknown as Json) 
    : null;

  const { data, error } = await supabaseClient
    .from('user_settings')
    .update({
      notification_settings: notificationSettingsJson,
      privacy_settings: privacySettingsJson,
      learning_preferences: learningPreferencesJson,
      updated_at: merged.updated_at,
    })
    .eq('user_id', userId)
    .select();

  if (error) throw error;

  if (data && data.length > 0) {
    const updated = data[0];
    if (!updated) {
      throw new Error('No updated settings data found');
    }
    return {
      id: updated.id,
      user_id: updated.user_id,
      notification_settings: parseNotificationSettings(updated.notification_settings),
      privacy_settings: parsePrivacySettings(updated.privacy_settings),
      learning_preferences: parseLearningPreferences(updated.learning_preferences),
      created_at: updated.created_at || null,
      updated_at: updated.updated_at || null,
    };
  }

  return null;
}

