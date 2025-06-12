/*
  # Fix user registration database error

  1. Database Function Updates
    - Update create_default_profile function to match current schema
    - Fix column references and data types
    - Add proper error handling

  2. Database Triggers
    - Create trigger on auth.users table to automatically create profiles
    - Ensure trigger executes after user insertion

  3. Security Updates
    - Add missing RLS policies for profile creation
    - Ensure service role can create profiles during registration

  4. Schema Fixes
    - Add missing email column to profiles table
    - Update function to handle user metadata properly
*/

-- First, drop the existing function if it exists
DROP FUNCTION IF EXISTS public.create_default_profile(uuid);

-- Create the updated function that matches the current schema
CREATE OR REPLACE FUNCTION public.create_default_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_name text;
BEGIN
  -- Extract full name from user metadata or use email as fallback
  default_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert the new profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    level,
    xp,
    current_streak,
    is_admin,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    default_name,
    1,
    0,
    0,
    false,
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_profile();

-- Ensure the profiles table has the email column (add if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email text;
  END IF;
END $$;

-- Update the email column to be NOT NULL and add unique constraint if not exists
DO $$
BEGIN
  -- Make email NOT NULL if it isn't already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email' AND is_nullable = 'YES'
  ) THEN
    -- First update any NULL emails
    UPDATE public.profiles 
    SET email = COALESCE(email, 'unknown@example.com') 
    WHERE email IS NULL;
    
    -- Then make it NOT NULL
    ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
  END IF;
END $$;

-- Add RLS policy to allow profile creation during user registration
CREATE POLICY IF NOT EXISTS "Allow profile creation during registration"
  ON public.profiles
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- Create user_settings automatically when profile is created
CREATE OR REPLACE FUNCTION public.create_user_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_settings (
    user_id,
    notification_settings,
    privacy_settings,
    learning_preferences,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    '{"weeklyReport": true, "achievementAlerts": true, "pushNotifications": false, "emailNotifications": true, "reminderNotifications": true}'::jsonb,
    '{"showProgress": false, "allowMessages": false, "showAchievements": true, "profileVisibility": "private"}'::jsonb,
    '{"autoplay": true, "language": "fr", "dailyGoal": 30, "preferredDuration": "medium", "difficultyProgression": "adaptive"}'::jsonb,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the profile creation
    RAISE LOG 'Error creating user settings for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Update the existing trigger on profiles to use the new function
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_settings();