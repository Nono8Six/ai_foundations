-- Function: public.update_user_settings(settings_data jsonb, user_id uuid DEFAULT auth.uid())

CREATE OR REPLACE FUNCTION public.update_user_settings(
    settings_data jsonb,
    user_id uuid DEFAULT auth.uid()
)
RETURNS TABLE(
    notification_settings jsonb,
    privacy_settings jsonb,
    learning_preferences jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  INSERT INTO user_settings(user_id, notification_settings, privacy_settings, learning_preferences)
  VALUES (
    user_id,
    COALESCE(settings_data->'notification_settings', '{}'::jsonb),
    COALESCE(settings_data->'privacy_settings', '{}'::jsonb),
    COALESCE(settings_data->'learning_preferences', '{}'::jsonb)
  )
  ON CONFLICT (user_id) DO UPDATE
    SET notification_settings = COALESCE(settings_data->'notification_settings', user_settings.notification_settings),
        privacy_settings = COALESCE(settings_data->'privacy_settings', user_settings.privacy_settings),
        learning_preferences = COALESCE(settings_data->'learning_preferences', user_settings.learning_preferences),
        updated_at = CURRENT_TIMESTAMP
  RETURNING
    user_settings.notification_settings AS notification_settings,
    user_settings.privacy_settings AS privacy_settings,
    user_settings.learning_preferences AS learning_preferences;
END;
$$;
