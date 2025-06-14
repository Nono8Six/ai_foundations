/*
  # Consolidate policies for courses, modules and lessons

  This migration removes duplicate admin policies and creates
  one clear admin policy and one read policy for each table.
*/
DO $$
BEGIN
  -- Courses table
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'courses'
      AND policyname IN ('Enable all for admins', 'Admins can manage courses')
  ) THEN
    DROP POLICY IF EXISTS "Enable all for admins" ON courses;
    DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
  END IF;

  CREATE POLICY "Admins can manage courses"
    ON courses FOR ALL
    TO authenticated
    USING (
      current_user_is_admin()
    )
    WITH CHECK (
      current_user_is_admin()
    );

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'courses' AND policyname = 'Users can read courses'
  ) THEN
    CREATE POLICY "Users can read courses"
      ON courses FOR SELECT
      TO authenticated, anon
      USING (is_published = true);
  END IF;

  -- Modules table
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'modules'
      AND policyname IN ('Enable all for admins', 'Admins can manage modules')
  ) THEN
    DROP POLICY IF EXISTS "Enable all for admins" ON modules;
    DROP POLICY IF EXISTS "Admins can manage modules" ON modules;
  END IF;

  CREATE POLICY "Admins can manage modules"
    ON modules FOR ALL
    TO authenticated
    USING (
      current_user_is_admin()
    )
    WITH CHECK (
      current_user_is_admin()
    );

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'modules' AND policyname = 'Users can read modules'
  ) THEN
    CREATE POLICY "Users can read modules"
      ON modules FOR SELECT
      TO authenticated, anon
      USING (true);
  END IF;

  -- Lessons table
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lessons'
      AND policyname IN ('Enable all for admins', 'Admins can manage lessons')
  ) THEN
    DROP POLICY IF EXISTS "Enable all for admins" ON lessons;
    DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;
  END IF;

  CREATE POLICY "Admins can manage lessons"
    ON lessons FOR ALL
    TO authenticated
    USING (
      current_user_is_admin()
    )
    WITH CHECK (
      current_user_is_admin()
    );

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lessons' AND policyname = 'Users can read lessons'
  ) THEN
    CREATE POLICY "Users can read lessons"
      ON lessons FOR SELECT
      TO authenticated, anon
      USING (is_published = true);
  END IF;
END;
$$;
