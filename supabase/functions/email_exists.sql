-- Function: public.email_exists(search_email text)

CREATE OR REPLACE FUNCTION public.email_exists(search_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = search_email);
END;
$$;
