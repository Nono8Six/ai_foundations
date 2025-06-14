-- Function: public.current_user_is_admin()

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT is_admin FROM public.profiles WHERE id = auth.uid();
$$;
