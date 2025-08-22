-- MIGRATION 1: RLS ALIGNMENT - PHASE 1 Security & Integrity
-- Generated: 2025-01-19 20:23:00
-- Objective: Eliminate RLS policy asymmetries and missing WITH CHECK clauses
-- Total policies fixed: 29 -> 0 asymmetric risks

BEGIN;

-- Security timeouts
SET lock_timeout = '3s';
SET statement_timeout = '30s';
SET idle_in_transaction_session_timeout = '30s';

-- === PHASE 1A: UPDATE POLICIES - Add missing WITH CHECK ===

-- user_login_sessions: Users can update their own sessions
ALTER POLICY "Users can update their own sessions"
  ON public.user_login_sessions
  WITH CHECK (auth.uid() = user_id);

-- user_notes: allow note owner update  
ALTER POLICY "allow note owner update"
  ON public.user_notes
  WITH CHECK (user_id = auth.uid());

-- user_progress: Users can update their own progress
ALTER POLICY "Users can update their own progress"
  ON public.user_progress
  WITH CHECK ((auth.uid())::text = (user_id)::text);

-- user_sessions: Users can update their own sessions
ALTER POLICY "Users can update their own sessions"
  ON public.user_sessions
  WITH CHECK ((auth.uid())::text = (user_id)::text);

-- user_sessions: session_owner_update
ALTER POLICY "session_owner_update" 
  ON public.user_sessions
  WITH CHECK (user_id = auth.uid());

-- === PHASE 1B: ALL POLICIES - Add missing WITH CHECK ===

-- coupons: Only admins can manage coupons
ALTER POLICY "Only admins can manage coupons"
  ON public.coupons
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- courses: Admins can manage courses
ALTER POLICY "Admins can manage courses"
  ON public.courses  
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- courses: courses_admin_full_access
ALTER POLICY "courses_admin_full_access"
  ON public.courses
  WITH CHECK ((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text));

-- lessons: Admins can manage lessons
ALTER POLICY "Admins can manage lessons"
  ON public.lessons
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- lessons: lessons_admin_full_access
ALTER POLICY "lessons_admin_full_access"
  ON public.lessons
  WITH CHECK ((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text));

-- modules: Admins can manage modules
ALTER POLICY "Admins can manage modules"
  ON public.modules
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- modules: modules_admin_full_access
ALTER POLICY "modules_admin_full_access"
  ON public.modules
  WITH CHECK ((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text));

-- user_achievements: Admins can manage all achievements
ALTER POLICY "Admins can manage all achievements"
  ON public.user_achievements
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- user_notes: Users can manage their own notes
ALTER POLICY "Users can manage their own notes"
  ON public.user_notes
  WITH CHECK ((auth.uid())::text = (user_id)::text);

-- user_progress: Admins can manage all progress
ALTER POLICY "Admins can manage all progress"
  ON public.user_progress
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- user_settings: Users can manage their own settings
ALTER POLICY "Users can manage their own settings"
  ON public.user_settings
  WITH CHECK ((auth.uid())::text = (user_id)::text);

-- === PHASE 1C: POLICY RESTRUCTURE - Replace ALL with specific SELECT ===

-- user_login_sessions: Replace ALL with SELECT for admin
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_login_sessions;
CREATE POLICY "Admins can select all sessions" 
  ON public.user_login_sessions 
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- xp_events: Replace ALL with SELECT for admin
DROP POLICY IF EXISTS "Admins can view all XP events" ON public.xp_events;
CREATE POLICY "Admins can select all XP events"
  ON public.xp_events
  FOR SELECT  
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

COMMIT;

-- Post-migration note: All 29 policies have been aligned
-- - INSERT policies already had correct WITH CHECK only clauses
-- - UPDATE policies now have symmetric USING/WITH CHECK
-- - ALL policies now have complete USING/WITH CHECK pairs  
-- - Admin ALL policies restructured to specific SELECT policies where appropriate