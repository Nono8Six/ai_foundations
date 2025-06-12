CREATE TABLE IF NOT EXISTS public.user_settings (
    id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    notification_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
    privacy_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
    learning_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
