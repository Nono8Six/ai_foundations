import type { Database } from './database.types';
export type UpdateUserProfilePayload = Database['public']['Functions']['update_user_profile']['Args'];
export type UpdateUserProfileResponse = Database['public']['Functions']['update_user_profile']['Returns'][0];
export type UpdateUserSettingsPayload = Database['public']['Functions']['update_user_settings']['Args'];
export type UpdateUserSettingsResponse = Database['public']['Functions']['update_user_settings']['Returns'][0];
export type GetUserSettingsResponse = Database['public']['Functions']['get_user_settings']['Returns'][0];
