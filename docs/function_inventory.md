This file tracks all stored procedures and trigger functions in the project. Use this as a reference to ensure each function is version controlled. If a function is missing a SQL file or migration, consider adding one or removing the function if it is obsolete.
 
 | Function | Status | Location | Notes |
 | --- | --- | --- | --- |
 | `create_default_profile()` | Tracked | `supabase/functions/create_default_profile.sql` and migration `20250612115418_light_cell.sql` | Trigger for new users |
 | `create_user_settings()` | Tracked | `supabase/functions/create_user_settings.sql` and migration `20250612115418_light_cell.sql` | Trigger for profile creation |
 | `email_exists(text)` | Tracked | `supabase/functions/email_exists.sql` and migration `20250612144325_email_exists.sql` | Internal helper, execution restricted to `service_role` |
-| `get_course_stats()` | Drop | – | Not referenced in code |
+| `get_course_stats()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Not referenced in code |
 | `get_user_settings(uuid)` | Tracked | `supabase/functions/get_user_settings.sql` | Returns settings for a user |
-| `get_user_settings_rpc()` | Drop | – | Deprecated |
-| `get_user_stats()` | Drop | – | Not referenced in code |
-| `handle_lesson_completion(uuid, uuid)` | Drop | – | Unused |
-| `handle_new_user()` | Drop | – | Replaced by `create_default_profile()` |
+| `get_user_settings_rpc()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Deprecated |
+| `get_user_stats()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Not referenced in code |
+| `handle_lesson_completion(uuid, uuid)` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Unused |
+| `handle_new_user()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Replaced by `create_default_profile()` |
 | `handle_updated_at()` | Tracked | `supabase/functions/handle_updated_at.sql` and migration `20250612120816_young_heart.sql` | Generic updated_at trigger |
-| `handle_user_notes_updated_at()` | Drop | – | Not implemented |
+| `handle_user_notes_updated_at()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Not implemented |
 | `is_admin()` | Removed | migration `20250612161000_policy_cleanup_admin.sql` | Policies now check `profiles.is_admin`; see migration for details |
-| `is_admin(uuid)` | Drop | – | Unused |
-| `test_auth_rpc()` | Drop | – | Development helper |
-| `test_rpc()` | Drop | – | Development helper |
-| `test_with_hardcoded_id()` | Drop | – | Development helper |
+| `is_admin(uuid)` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Unused |
+| `test_auth_rpc()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Development helper |
+| `test_rpc()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Development helper |
+| `test_with_hardcoded_id()` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Development helper |
 | `update_user_profile(profile_data jsonb, user_id uuid)` | Tracked | `supabase/functions/update_user_profile.sql` | Main profile update function |
 | `update_user_profile(profile_data jsonb)` | Dropped | migration `20250612160000_drop_legacy_update_user_profile.sql` | Legacy version, should not exist |
-| `update_user_settings(uuid, jsonb, jsonb, jsonb)` | Drop | – | Alternative signature not used |
+| `update_user_settings(uuid, jsonb, jsonb, jsonb)` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Alternative signature not used |
 | `update_user_settings(settings_data jsonb, user_id uuid)` | Tracked | `supabase/functions/update_user_settings.sql` | Main settings update function |
-| `update_user_settings_rpc(settings_data jsonb)` | Drop | – | Deprecated |
+| `update_user_settings_rpc(settings_data jsonb)` | Dropped | migration `20250613120000_drop_unused_functions.sql` | Deprecated |
