-- Trigger function: public.create_default_profile()

DROP FUNCTION IF EXISTS public.create_default_profile(uuid);

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
