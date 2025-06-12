-- Function: public.get_user_settings(user_id uuid DEFAULT auth.uid())

CREATE OR REPLACE FUNCTION public.get_user_settings(
    user_id uuid DEFAULT auth.uid()
)
RETURNS TABLE(
    notification_settings jsonb,
    privacy_settings jsonb,
    learning_preferences jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT notification_settings, privacy_settings, learning_preferences
    FROM user_settings
    WHERE id = user_id;
END;
$$;
