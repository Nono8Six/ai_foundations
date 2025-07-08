import { supabase } from '@frontend/lib/supabase';
import type { SupabaseClient, User } from '@supabase/supabase-js';
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

const supabaseClient = supabase as SupabaseClient<Database>;

const toJson = <T extends Json>(v: T): Json => v;

export async function fetchUserProfile(user: User): Promise<UserProfile> {
  const { data: profileData, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id);

  if (error) throw error;

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
    return {
      id: settings.id,
      user_id: settings.user_id,
      notification_settings: settings.notification_settings as unknown as NotificationSettings,
      privacy_settings: settings.privacy_settings as unknown as PrivacySettings,
      learning_preferences: settings.learning_preferences as unknown as LearningPreferences,
      created_at: settings.created_at || null,
      updated_at: settings.updated_at || null,
    };
  }

  const defaultSettings = {
    user_id: userId,
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

  if (createError) throw createError;

  return {
    id: newSettings.id,
    user_id: newSettings.user_id,
      notification_settings: newSettings.notification_settings as unknown as NotificationSettings,
      privacy_settings: newSettings.privacy_settings as unknown as PrivacySettings,
      learning_preferences: newSettings.learning_preferences as unknown as LearningPreferences,
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

  const { data, error } = await supabaseClient
    .from('user_settings')
    .update({
      notification_settings: toJson(merged.notification_settings as unknown as Json),
      privacy_settings: toJson(merged.privacy_settings as unknown as Json),
      learning_preferences: toJson(merged.learning_preferences as unknown as Json),
      updated_at: merged.updated_at,
    })
    .eq('user_id', userId)
    .select();

  if (error) throw error;

  if (data && data.length > 0) {
    const updated = data[0];
    return {
      id: updated.id,
      user_id: updated.user_id,
      notification_settings: updated.notification_settings as unknown as NotificationSettings,
      privacy_settings: updated.privacy_settings as unknown as PrivacySettings,
      learning_preferences: updated.learning_preferences as unknown as LearningPreferences,
      created_at: updated.created_at || null,
      updated_at: updated.updated_at || null,
    };
  }

  return null;
}

