/*
  # Switch admin policies to helper function

  This migration introduces the `current_user_is_admin()` helper
  and recreates policies that previously queried `public.profiles`
  directly.
  The following policies are recreated:
    - "Admins can view all profiles" on `public.profiles`
    - "Enable all for admins" on `courses`, `modules`, and `lessons`

  After updating the policies, the now unused `is_admin()` function
  is dropped.
*/

-- Helper used by admin policies
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result boolean;
BEGIN
  -- Temporarily escalate privileges to bypass RLS on profiles
  PERFORM set_config('role', 'service_role', true);
  SELECT is_admin INTO result FROM public.profiles WHERE id = auth.uid();
  RETURN result;
END;
$$;

-- Recreate admin policies using profiles.is_admin
DO $$
BEGIN
  -- Profiles policy
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
      AND policyname = 'Admins can view all profiles'
  ) THEN
    DROP POLICY "Admins can view all profiles" ON public.profiles;
  END IF;

  CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
      current_user_is_admin()
    );

  -- Courses policy
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'courses'
      AND policyname = 'Enable all for admins'
  ) THEN
    DROP POLICY "Enable all for admins" ON courses;
  END IF;

  CREATE POLICY "Enable all for admins"
    ON courses FOR ALL
    TO authenticated
    USING (
      current_user_is_admin()
    )
    WITH CHECK (
      current_user_is_admin()
    );

  -- Modules policy
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'modules'
      AND policyname = 'Enable all for admins'
  ) THEN
    DROP POLICY "Enable all for admins" ON modules;
  END IF;

  CREATE POLICY "Enable all for admins"
    ON modules FOR ALL
    TO authenticated
    USING (
      current_user_is_admin()
    )
    WITH CHECK (
      current_user_is_admin()
    );

  -- Lessons policy
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lessons'
      AND policyname = 'Enable all for admins'
  ) THEN
    DROP POLICY "Enable all for admins" ON lessons;
  END IF;

  CREATE POLICY "Enable all for admins"
    ON lessons FOR ALL
    TO authenticated
    USING (
      current_user_is_admin()
    )
    WITH CHECK (
      current_user_is_admin()
  );
END;
$$;

-- Drop obsolete helper
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;