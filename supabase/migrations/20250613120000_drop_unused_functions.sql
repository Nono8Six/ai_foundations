-- Cleanup unused functions verified on 2025-06-13

-- Drop obsolete or unused functions
DROP FUNCTION IF EXISTS public.get_course_stats();
DROP FUNCTION IF EXISTS public.get_user_stats();
DROP FUNCTION IF EXISTS public.handle_lesson_completion(uuid, uuid);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_notes_updated_at();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.test_auth_rpc();
DROP FUNCTION IF EXISTS public.test_rpc();
DROP FUNCTION IF EXISTS public.test_with_hardcoded_id();
DROP FUNCTION IF EXISTS public.update_user_profile(profile_data jsonb);
DROP FUNCTION IF EXISTS public.update_user_settings(uuid, jsonb, jsonb, jsonb);
DROP FUNCTION IF EXISTS public.update_user_settings_rpc(settings_data jsonb);
DROP FUNCTION IF EXISTS public.get_user_settings_rpc();
