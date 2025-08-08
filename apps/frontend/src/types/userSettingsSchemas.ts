import { z } from 'zod';

export const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyReport: z.boolean(),
  reminderNotifications: z.boolean(),
});
export type NotificationSettingsParsed = z.infer<typeof NotificationSettingsSchema>;

export const PrivacySettingsSchema = z.object({
  profileVisibility: z.enum(['private', 'public']),
  showProgress: z.boolean(),
  allowMessages: z.boolean(),
});
export type PrivacySettingsParsed = z.infer<typeof PrivacySettingsSchema>;

export const LearningPreferencesSchema = z.object({
  dailyGoal: z.number(),
  preferredDuration: z.enum(['short', 'medium', 'long']),
  difficultyProgression: z.string(),
  language: z.string(),
  autoplay: z.boolean(),
});
export type LearningPreferencesParsed = z.infer<typeof LearningPreferencesSchema>;

export const UserSettingsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  notification_settings: NotificationSettingsSchema,
  privacy_settings: PrivacySettingsSchema,
  learning_preferences: LearningPreferencesSchema,
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});
export type UserSettingsParsed = z.infer<typeof UserSettingsSchema>;
