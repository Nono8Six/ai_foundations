import type { Database } from './database.types';

// NOTE: These functions are temporarily commented out as they might have been moved to a different schema
// or removed. Update these types once the correct schema/functions are identified.

// export type UpdateUserProfilePayload =
//   Database['public']['Functions']['update_user_profile']['Args'];
// export type UpdateUserProfileResponse =
//   Database['public']['Functions']['update_user_profile']['Returns'][0];

// export type UpdateUserSettingsPayload =
//   Database['public']['Functions']['update_user_settings']['Args'];
// export type UpdateUserSettingsResponse =
//   Database['public']['Functions']['update_user_settings']['Returns'][0];

// export type GetUserSettingsResponse =
//   Database['public']['Functions']['get_user_settings']['Returns'][0];

// Available functions in public schema:
export type VerifyCertificatePublicArgs = 
  Database['public']['Functions']['verify_certificate_public']['Args'];
export type VerifyCertificatePublicResponse = 
  Database['public']['Functions']['verify_certificate_public']['Returns'];
