-- supabase/migrations/20240601000003_ensure_tables_exist.sql
-- Migration to ensure all required tables exist for the AI Foundations LMS
-- This migration is idempotent and safe to run multiple times

-- Create tables if they don't exist
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

CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  module_order INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  lesson_order INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  valid_to TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_modules_course_id') THEN
    CREATE INDEX idx_modules_course_id ON modules (course_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lessons_module_id') THEN
    CREATE INDEX idx_lessons_module_id ON lessons (module_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_progress_user_id') THEN
    CREATE INDEX idx_user_progress_user_id ON user_progress (user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_progress_lesson_id') THEN
    CREATE INDEX idx_user_progress_lesson_id ON user_progress (lesson_id);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Only admins can insert, update, delete courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view published modules" ON modules;
DROP POLICY IF EXISTS "Only admins can insert, update, delete modules" ON modules;
DROP POLICY IF EXISTS "Anyone can view published lessons" ON lessons;
DROP POLICY IF EXISTS "Only admins can insert, update, delete lessons" ON lessons;
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Admins can view all user progress" ON user_progress;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Only admins can manage coupons" ON coupons;

-- Create RLS Policies
-- Courses policies
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

-- Modules policies
CREATE POLICY "Anyone can view published modules"
  ON modules FOR SELECT
  USING (is_published = true OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Only admins can insert, update, delete modules"
  ON modules FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Lessons policies
CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  USING (is_published = true OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Only admins can insert, update, delete lessons"
  ON lessons FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all user progress"
  ON user_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Coupons policies
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage coupons"
  ON coupons FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Create or replace the lesson completion function
CREATE OR REPLACE FUNCTION handle_lesson_completion(user_id UUID, lesson_id UUID)
RETURNS VOID AS $$
DECLARE
  xp_gain INTEGER := 10;
  user_xp INTEGER;
  user_level INTEGER;
  next_level_threshold INTEGER;
  yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  user_last_completed TIMESTAMP WITH TIME ZONE;
  user_current_streak INTEGER;
BEGIN
  -- Only award XP if this is the first time completing this lesson
  IF NOT EXISTS (
    SELECT 1 FROM user_progress 
    WHERE user_progress.user_id = handle_lesson_completion.user_id 
    AND user_progress.lesson_id = handle_lesson_completion.lesson_id 
    AND status = 'completed'
  ) THEN
    -- Update user_progress table
    INSERT INTO user_progress (user_id, lesson_id, status, completed_at)
    VALUES (user_id, lesson_id, 'completed', CURRENT_TIMESTAMP)
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET 
      status = 'completed', 
      completed_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP;
    
    -- Get current user XP and level
    SELECT xp, level, last_completed_at, current_streak INTO user_xp, user_level, user_last_completed, user_current_streak
    FROM profiles WHERE id = user_id;
    
    -- Award XP
    user_xp := user_xp + xp_gain;
    
    -- Check if level up is needed
    next_level_threshold := FLOOR(100 * POWER(user_level, 1.5));
    IF user_xp >= next_level_threshold THEN
      user_level := user_level + 1;
    END IF;
    
    -- Update streak
    IF user_last_completed IS NULL THEN
      -- First completion ever
      user_current_streak := 1;
    ELSIF DATE(user_last_completed) = yesterday THEN
      -- Completed yesterday, increment streak
      user_current_streak := user_current_streak + 1;
    ELSIF DATE(user_last_completed) < yesterday THEN
      -- Break in streak, reset to 1
      user_current_streak := 1;
    END IF;
    
    -- Update user profile with new XP, level, streak, and last_completed_at
    UPDATE profiles 
    SET 
      xp = user_xp, 
      level = user_level,
      current_streak = user_current_streak,
      last_completed_at = CURRENT_TIMESTAMP
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert sample course data if it doesn't exist
INSERT INTO courses (id, title, description, slug, cover_image_url, is_published) 
SELECT 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Fondations de l''IA', 'Formation complète sur les fondamentaux de l''intelligence artificielle, de la théorie à la pratique.', 'fondations-ia', 'https://images.unsplash.com/photo-1593377201811-4516c1b90bbd?q=80&w=1000', true
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'd290f1ee-6c54-4b01-90e6-d701748f0851');

-- Insert sample modules if they don't exist
INSERT INTO modules (id, course_id, title, description, module_order, is_published)
SELECT * FROM (
  VALUES 
    ('0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Introduction à l''IA', 'Découvrez les concepts fondamentaux de l''intelligence artificielle.', 1, true),
    ('1d3e3c9e-2f4b-5c6d-7e8f-9g0h1i2j3k4l', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Machine Learning', 'Comprenez les différentes approches du machine learning.', 2, true),
    ('2f4b5c6d-7e8f-9g0h-1i2j-3k4l5m6n7o8p', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Réseaux de neurones', 'Explorez le fonctionnement des réseaux de neurones artificiels.', 3, true)
) AS new_modules(id, course_id, title, description, module_order, is_published)
WHERE NOT EXISTS (SELECT 1 FROM modules WHERE modules.id = new_modules.id);

-- Insert sample lessons if they don't exist
INSERT INTO lessons (id, module_id, title, content, lesson_order, is_published)
SELECT * FROM (
  VALUES 
    ('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', '0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'Qu''est-ce que l''IA?', '{"type": "text", "content": "<h1>Qu''''est-ce que l''''intelligence artificielle?</h1><p>L''''intelligence artificielle (IA) est un domaine de l''''informatique qui vise à créer des systèmes capables d''''effectuer des tâches qui nécessitent normalement l''''intelligence humaine.</p><p>Ces tâches comprennent l''''apprentissage, le raisonnement, la résolution de problèmes, la perception, la compréhension du langage et la prise de décision.</p>"}', 1, true),
    ('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', '0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'Histoire de l''IA', '{"type": "text", "content": "<h1>Histoire de l''''intelligence artificielle</h1><p>L''''IA a débuté dans les années 1950 avec des pionniers comme Alan Turing et John McCarthy. Le terme \"intelligence artificielle\" a été inventé par McCarthy en 1956 lors de la conférence de Dartmouth.</p><p>Depuis, l''''IA a connu des hauts et des bas, avec des périodes d''''enthousiasme suivies de \"hivers de l''''IA\" où les financements et l''''intérêt diminuaient.</p>"}', 2, true),
    ('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', '0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'Types d''IA', '{"type": "text", "content": "<h1>Les différents types d''''intelligence artificielle</h1><p>On distingue généralement deux types d''''IA:</p><ul><li><strong>IA faible ou étroite</strong>: Conçue pour une tâche spécifique (comme jouer aux échecs ou reconnaître des visages).</li><li><strong>IA forte ou générale</strong>: Capable de comprendre, apprendre et appliquer des connaissances dans différents domaines, similaire à l''''intelligence humaine.</li></ul><p>Actuellement, toutes les IA existantes sont des IA faibles.</p>"}', 3, true)
) AS new_lessons(id, module_id, title, content, lesson_order, is_published)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE lessons.id = new_lessons.id);

-- Insert sample coupon if it doesn't exist
INSERT INTO coupons (code, discount_percent, valid_from, valid_to, is_active, max_uses)
SELECT 'WELCOME20', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 months', true, 100
WHERE NOT EXISTS (SELECT 1 FROM coupons WHERE code = 'WELCOME20');