-- supabase/migrations/20240601000004_fix_courses_table.sql
-- This migration ensures the courses table exists and is properly configured

-- Check if courses table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Make sure RLS is enabled
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Only admins can insert, update, delete courses" ON courses;

-- Re-create the policies
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Only admins can insert, update, delete courses"
  ON courses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Make sure the courses index exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_courses_slug') THEN
    CREATE UNIQUE INDEX idx_courses_slug ON courses(slug);
  END IF;
END $$;

-- Insert sample course data if the table is empty
INSERT INTO courses (id, title, description, slug, cover_image_url, is_published) 
SELECT 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Fondations de l''IA', 'Formation complète sur les fondamentaux de l''intelligence artificielle, de la théorie à la pratique.', 'fondations-ia', 'https://images.unsplash.com/photo-1593377201811-4516c1b90bbd?q=80&w=1000', true
WHERE NOT EXISTS (SELECT 1 FROM courses);
