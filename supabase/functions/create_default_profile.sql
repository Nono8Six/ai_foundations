-- Function: public.create_default_profile(user_id uuid DEFAULT auth.uid())

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
BEGIN
  SELECT COALESCE(raw_user_meta_data->>'full_name', email)
    INTO default_name
  FROM auth.users
  WHERE id = user_id;

  INSERT INTO profiles(id, full_name)
  VALUES (user_id, default_name)
  ON CONFLICT (id) DO NOTHING
  RETURNING * INTO new_profile;

  IF new_profile.id IS NULL THEN
    SELECT * INTO new_profile FROM profiles WHERE id = user_id;
  END IF;

  RETURN QUERY SELECT new_profile.id, new_profile.full_name, new_profile.avatar_url,
                       new_profile.level, new_profile.xp, new_profile.current_streak,
                       new_profile.is_admin;
END;
$$;
