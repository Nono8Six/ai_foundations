-- =============================================
-- Migration: Add Missing Lesson Properties
-- =============================================
-- Date: 2025-07-16
-- Description: Add missing properties to lessons table for TypeScript compatibility

-- Step 1: Create lesson_type enum
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'quiz', 'exercise');

-- Step 2: Add new columns to lessons table
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS type lesson_type DEFAULT 'video',
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS text_content TEXT,
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 0;

-- Step 3: Add comments for documentation
COMMENT ON COLUMN lessons.type IS 'Type of lesson: video, text, quiz, or exercise';
COMMENT ON COLUMN lessons.video_url IS 'URL to video file for video lessons';
COMMENT ON COLUMN lessons.transcript IS 'Video transcript or text content';
COMMENT ON COLUMN lessons.text_content IS 'Rich text content for text lessons';
COMMENT ON COLUMN lessons.resources IS 'JSON array of lesson resources (files, links, etc.)';
COMMENT ON COLUMN lessons.xp_reward IS 'XP points awarded for completing this lesson';

-- Step 4: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(type);
CREATE INDEX IF NOT EXISTS idx_lessons_xp_reward ON lessons(xp_reward);

-- Step 5: Add constraints
ALTER TABLE lessons 
ADD CONSTRAINT lessons_xp_reward_positive CHECK (xp_reward >= 0),
ADD CONSTRAINT lessons_resources_valid_json CHECK (jsonb_typeof(resources) = 'array');