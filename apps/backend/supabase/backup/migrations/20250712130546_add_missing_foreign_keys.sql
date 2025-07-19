-- Migration: Add missing foreign keys for data integrity
-- Critical security and data integrity fix

-- Add foreign key constraint for achievements.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'achievements_user_id_fkey' 
        AND table_name = 'achievements'
    ) THEN
        ALTER TABLE achievements 
        ADD CONSTRAINT achievements_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for activity_log.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'activity_log_user_id_fkey' 
        AND table_name = 'activity_log'
    ) THEN
        ALTER TABLE activity_log 
        ADD CONSTRAINT activity_log_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for media_files.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'media_files_user_id_fkey' 
        AND table_name = 'media_files'
    ) THEN
        ALTER TABLE media_files 
        ADD CONSTRAINT media_files_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for user_sessions.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_sessions_user_id_fkey' 
        AND table_name = 'user_sessions'
    ) THEN
        ALTER TABLE user_sessions 
        ADD CONSTRAINT user_sessions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for rgpd_requests.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'rgpd_requests_user_id_fkey' 
        AND table_name = 'rgpd_requests'
    ) THEN
        ALTER TABLE rgpd_requests 
        ADD CONSTRAINT rgpd_requests_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for lesson_analytics.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'lesson_analytics_user_id_fkey' 
        AND table_name = 'lesson_analytics'
    ) THEN
        ALTER TABLE lesson_analytics 
        ADD CONSTRAINT lesson_analytics_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for lesson_analytics.lesson_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'lesson_analytics_lesson_id_fkey' 
        AND table_name = 'lesson_analytics'
    ) THEN
        ALTER TABLE lesson_analytics 
        ADD CONSTRAINT lesson_analytics_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for user_notes.user_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_notes_user_id_fkey' 
        AND table_name = 'user_notes'
    ) THEN
        ALTER TABLE user_notes 
        ADD CONSTRAINT user_notes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for user_notes.lesson_id (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_notes_lesson_id_fkey' 
        AND table_name = 'user_notes'
    ) THEN
        ALTER TABLE user_notes 
        ADD CONSTRAINT user_notes_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add comment for documentation
COMMENT ON CONSTRAINT achievements_user_id_fkey ON achievements IS 
'Ensures achievements belong to valid users and are deleted when user is deleted';

COMMENT ON CONSTRAINT activity_log_user_id_fkey ON activity_log IS 
'Ensures activity logs belong to valid users and are deleted when user is deleted';

COMMENT ON CONSTRAINT media_files_user_id_fkey ON media_files IS 
'Ensures media files belong to valid users and are deleted when user is deleted';

COMMENT ON CONSTRAINT lesson_analytics_user_id_fkey ON lesson_analytics IS 
'Ensures lesson analytics belong to valid users and are deleted when user is deleted';

COMMENT ON CONSTRAINT lesson_analytics_lesson_id_fkey ON lesson_analytics IS 
'Ensures lesson analytics reference valid lessons and are deleted when lesson is deleted';