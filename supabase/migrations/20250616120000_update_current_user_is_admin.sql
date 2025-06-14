/*
  # Update current_user_is_admin to bypass RLS

  This migration modifies the helper so that it executes under the
  `service_role` and thus can read the `profiles` table regardless of
  row level security.
*/

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result boolean;
BEGIN
  -- Temporarily escalate privileges to bypass RLS on profiles
  PERFORM set_config('role', 'service_role', true);
  SELECT is_admin INTO result FROM public.profiles WHERE id = auth.uid();
  RETURN result;
END;
$$;

