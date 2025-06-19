# RLS Policy Reference

This document summarizes row level security (RLS) policies defined in the Supabase migrations. It also lists the trigger functions tied to those policies.

## Profiles
- RLS enabled via migration `20250612161000_secure_profiles.sql`.
- Policies:
  - `Allow profile creation during registration` (INSERT) allows anonymous and authenticated users to insert new profiles.
  - `Users can read own profile` (SELECT) only for the current user.
  - `Users can update own profile` (UPDATE) only for the current user; admin flag is preserved.
  - `Admins can read profiles` (SELECT) for users marked `is_admin`.
  - `Admins can update profiles` (UPDATE) for users marked `is_admin`.
  - `Admins can view all profiles` defined in migration `20250612161000_policy_cleanup_admin.sql`.
- Functions & Triggers:
  - `create_default_profile()` – triggered by `on_auth_user_created` after insert on `auth.users`.
  - `create_user_settings()` – triggered by `on_profile_created` after insert on `public.profiles`.

## User Settings
- RLS enabled via migration `20250612150900_guarded_settings.sql`.
- Policies:
  - `Users can read own settings` (SELECT).
  - `Users can update own settings` (UPDATE).
- Functions:
  - `create_user_settings()` populates defaults when a profile is created.
  - `update_user_settings()` updates or inserts a row for the current user.

## RGPD Requests
- RLS enabled via migration `20250612120816_young_heart.sql`.
- Policies:
  - `Users can create their own requests` (INSERT).
  - `Users can view their own requests` (SELECT).
  - `Admins can manage all requests` (ALL).
- Trigger:
  - `rgpd_requests_updated_at` uses `handle_updated_at()` before update to stamp `updated_at`.

## Courses
- Policies defined in `20250614120000_course_module_lesson_policy_cleanup.sql`.
- Policies:
  - `Admins can manage courses` (ALL) for administrators.
  - `Users can read courses` (SELECT) when `is_published = true`.

## Modules
- Policies defined in `20250614120000_course_module_lesson_policy_cleanup.sql`.
- Policies:
  - `Admins can manage modules` (ALL) for administrators.
  - `Users can read modules` (SELECT).

## Lessons
- Policies defined in `20250614120000_course_module_lesson_policy_cleanup.sql`.
- Policies:
  - `Admins can manage lessons` (ALL) for administrators.
  - `Users can read lessons` (SELECT) when `is_published = true`.

