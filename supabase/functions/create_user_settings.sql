-- Function: public.create_user_settings()

CREATE OR REPLACE FUNCTION public.create_user_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_settings (
    user_id,
    notification_settings,
    privacy_settings,
    learning_preferences,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    '{"weeklyReport": true, "achievementAlerts": true, "pushNotifications": false, "emailNotifications": true, "reminderNotifications": true}'::jsonb,
    '{"showProgress": false, "allowMessages": false, "showAchievements": true, "profileVisibility": "private"}'::jsonb,
    '{"autoplay": true, "language": "fr", "dailyGoal": 30, "preferredDuration": "medium", "difficultyProgression": "adaptive"}'::jsonb,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the profile creation
    RAISE LOG 'Error creating user settings for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
