/*
  # Switch admin policies to column check

  This migration updates policies that previously depended on the
  `is_admin()` function to instead use the `profiles.is_admin` column.
  The following policies are recreated:
    - "Admins can view all profiles" on `public.profiles`
    - "Enable all for admins" on `courses`, `modules`, and `lessons`

  After updating the policies, the now unused `is_admin()` function
  is dropped.
*/

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
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
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
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
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
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
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
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.is_admin = true
      )
  );
END;
$$;

-- Drop obsolete helper
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
