-- Create tables with references to auth.users

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  module_order INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  lesson_order INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Coupons for special offers
CREATE TABLE coupons (
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

-- Indexes
CREATE INDEX idx_modules_course_id ON modules (course_id);
CREATE INDEX idx_lessons_module_id ON lessons (module_id);
CREATE INDEX idx_user_progress_user_id ON user_progress (user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress (lesson_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

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

-- Functions for gamification

-- Function to handle lesson completion
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

-- Trigger for user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
