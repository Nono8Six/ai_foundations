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
DECLARE
  sanitized jsonb;
BEGIN
  -- Strip is_admin to prevent privilege escalation
  sanitized := profile_data - 'is_admin';

  UPDATE profiles
    SET full_name  = COALESCE(sanitized->>'full_name', full_name),
        avatar_url = COALESCE(sanitized->>'avatar_url', avatar_url),
        phone      = COALESCE(sanitized->>'phone', phone),
        profession = COALESCE(sanitized->>'profession', profession),
        company    = COALESCE(sanitized->>'company', company),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_id
    RETURNING profiles.* INTO id, updated_at, full_name, avatar_url, phone, profession, company;
END;
$$;
