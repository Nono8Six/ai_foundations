-- =============================================
-- Migration: Optimize Indexes and Constraints
-- =============================================
-- Date: 2025-07-16
-- Description: Add missing indexes and constraints for better performance

-- Step 1: Add missing indexes for foreign keys and common queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON user_progress(completed_at);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned ON achievements(earned);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);

CREATE INDEX IF NOT EXISTS idx_lesson_analytics_user_id ON lesson_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_lesson_id ON lesson_analytics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_completed_at ON lesson_analytics(completed_at);

-- Step 2: Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status_updated ON user_progress(status, updated_at);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON lessons(module_id, lesson_order);
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON modules(course_id, module_order);

-- Step 3: Add constraints for data integrity
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_progress_status_check' 
        AND table_name = 'user_progress'
    ) THEN
        ALTER TABLE user_progress 
        ADD CONSTRAINT user_progress_status_check 
        CHECK (status IN ('not_started', 'in_progress', 'completed'));
    END IF;
END $$;

-- Step 4: Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic updated_at
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at 
    BEFORE UPDATE ON lessons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();