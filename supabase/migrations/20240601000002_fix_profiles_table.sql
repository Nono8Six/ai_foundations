-- This migration ensures we don't try to recreate the profiles table
-- if it already exists

-- Instead of CREATE TABLE, use CREATE TABLE IF NOT EXISTS
-- This is a safer approach that won't error if the table already exists
CREATE TABLE IF NOT EXISTS profiles (
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

-- Only create the index if it doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_email'
  ) THEN
    CREATE INDEX idx_profiles_email ON profiles(email);
  END IF;
END $$;

-- Only enable RLS if it's not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'profiles' AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies only if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view their own profiles'
  ) THEN
    CREATE POLICY "Users can view their own profiles"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update their own profiles'
  ) THEN
    CREATE POLICY "Users can update their own profiles"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON profiles FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
      ));
  END IF;
END $$;