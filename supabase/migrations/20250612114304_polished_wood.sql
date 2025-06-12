/*
  # Fix create_default_profile function

  1. Changes
    - Drop existing create_default_profile function
    - Recreate function with updated return type to include email field
    - Ensure function properly handles email when creating new profiles
  
  2. Security
    - No changes to security policies
*/

-- First drop the existing function
DROP FUNCTION IF EXISTS public.create_default_profile(uuid);

-- Then recreate it with the updated return type
CREATE OR REPLACE FUNCTION public.create_default_profile(user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
    id uuid,
    full_name text,
    avatar_url text,
    email text,
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
  SELECT COALESCE(raw_user_meta_data->>'full_name', email), email
    INTO default_name, user_email
  FROM auth.users
  WHERE id = user_id;

  INSERT INTO profiles(id, full_name, email)
  VALUES (user_id, default_name, user_email)
  ON CONFLICT (id) DO NOTHING
  RETURNING * INTO new_profile;

  IF new_profile.id IS NULL THEN
    SELECT * INTO new_profile FROM profiles WHERE id = user_id;
  END IF;

  RETURN QUERY SELECT new_profile.id, new_profile.full_name, new_profile.avatar_url,
                       new_profile.email, new_profile.level, new_profile.xp, 
                       new_profile.current_streak, new_profile.is_admin;
END;
$$;