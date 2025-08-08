export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  reminderNotifications: boolean;
}

export type NotificationSettingKey = keyof NotificationSettings;

export interface PrivacySettings {
  profileVisibility: 'private' | 'public';
  showProgress: boolean;
  allowMessages: boolean;
}

export type PrivacySettingKey = keyof PrivacySettings;

export interface LearningPreferences {
  dailyGoal: number;
  preferredDuration: 'short' | 'medium' | 'long';
  difficultyProgression: string;
  language: string;
  autoplay: boolean;
}

export type LearningPreferenceKey = keyof LearningPreferences;

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  acceptedAt: string | null;
  lastUpdated: string | null;
}

export type CookiePreferenceKey = keyof CookiePreferences;

export interface UserSettings {
  id: string;
  user_id: string;
  notification_settings: NotificationSettings;
  privacy_settings: PrivacySettings;
  learning_preferences: LearningPreferences;
  cookie_preferences?: CookiePreferences;
  created_at: string | null;
  updated_at: string | null;
}
