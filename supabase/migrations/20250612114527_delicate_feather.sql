/*
  # Fix create_default_profile function

  1. Changes
    - Drop existing create_default_profile function
    - Recreate function with proper return type and parameters
    - Ensure function handles email field correctly
*/

-- First, drop the existing function
DROP FUNCTION IF EXISTS public.create_default_profile(uuid);

-- Then recreate it with the correct signature and implementation
CREATE OR REPLACE FUNCTION public.create_default_profile(user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
    id uuid,
    full_name text,
    avatar_url text,
    level integer,
    xp integer,
    current_streak integer,
    is_admin boolean
) LANGUAGE plpgsql AS $$
DECLARE
  new_profile profiles%ROWTYPE;
  default_name text;
  user_email text;
BEGIN
  -- Get user info from auth.users
  SELECT COALESCE(raw_user_meta_data->>'full_name', email), email
    INTO default_name, user_email
  FROM auth.users
  WHERE id = user_id;

  -- Insert new profile with all required fields
  INSERT INTO profiles(id, full_name, email, level, xp, current_streak, is_admin)
  VALUES (user_id, default_name, user_email, 1, 0, 0, false)
  ON CONFLICT (id) DO NOTHING
  RETURNING * INTO new_profile;

  -- If no new profile was created (because it already existed), get the existing one
  IF new_profile.id IS NULL THEN
    SELECT * INTO new_profile FROM profiles WHERE id = user_id;
  END IF;

  -- Return the profile data
  RETURN QUERY SELECT 
    new_profile.id, 
    new_profile.full_name, 
    new_profile.avatar_url,
    new_profile.level, 
    new_profile.xp, 
    new_profile.current_streak,
    new_profile.is_admin;
END;
$$;