-- Drop redundant index on courses.slug
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'idx_courses_slug'
  ) THEN
    EXECUTE 'DROP INDEX IF EXISTS idx_courses_slug';
  END IF;
END $$;
