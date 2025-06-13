-- Email existence check function
CREATE OR REPLACE FUNCTION public.email_exists(search_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = search_email);
END;
$$;

-- Restrict execution to the service role only
REVOKE EXECUTE ON FUNCTION public.email_exists(text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_exists(text) TO service_role;
