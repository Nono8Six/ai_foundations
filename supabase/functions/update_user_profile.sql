-- Function: public.update_user_profile(profile_data jsonb, user_id uuid default auth.uid())

CREATE OR REPLACE FUNCTION public.update_user_profile(profile_data jsonb, user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
    id uuid,
    updated_at timestamp with time zone,
    full_name text,
    avatar_url text,
    phone text,
    profession text,
    company text
) LANGUAGE plpgsql AS $$
BEGIN
  UPDATE profiles
    SET full_name  = COALESCE(profile_data->>'full_name', full_name),
        avatar_url = COALESCE(profile_data->>'avatar_url', avatar_url),
        phone      = COALESCE(profile_data->>'phone', phone),
        profession = COALESCE(profile_data->>'profession', profession),
        company    = COALESCE(profile_data->>'company', company),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_id
    RETURNING profiles.* INTO id, updated_at, full_name, avatar_url, phone, profession, company;
END;
$$;
