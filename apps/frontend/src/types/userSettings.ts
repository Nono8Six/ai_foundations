export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  reminderNotifications: boolean;
}

export type NotificationSettingKey = keyof NotificationSettings;

export interface PrivacySettings {
  profileVisibility: 'private' | 'public';
  showProgress: boolean;
  showAchievements: boolean;
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

export interface UserSettings {
  id: string;
  user_id: string;
  notification_settings: NotificationSettings;
  privacy_settings: PrivacySettings;
  learning_preferences: LearningPreferences;
  created_at: string | null;
  updated_at: string | null;
}
