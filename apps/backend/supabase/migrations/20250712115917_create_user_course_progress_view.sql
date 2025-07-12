-- Migration: Create user_course_progress view
-- This view provides courses with user-specific progress data
-- Critical fix for frontend courseService.ts that expects this view

-- Drop view if it exists
DROP VIEW IF EXISTS user_course_progress;

-- Create the user_course_progress view
CREATE OR REPLACE VIEW user_course_progress AS 
SELECT 
    c.id,
    c.title,
    c.description,
    c.slug,
    c.cover_image_url,
    c.thumbnail_url,
    c.category,
    c.difficulty,
    c.is_published,
    c.created_at,
    c.updated_at,
    
    -- User-specific fields
    COALESCE(progress_data.user_id, auth.uid()) as user_id,
    COALESCE(progress_data.total_lessons, 0) as total_lessons,
    COALESCE(progress_data.completed_lessons, 0) as completed_lessons,
    COALESCE(progress_data.completion_percentage, 0) as completion_percentage,
    progress_data.last_activity_at,
    
    -- Progress object for frontend compatibility
    jsonb_build_object(
        'completed', COALESCE(progress_data.completed_lessons, 0),
        'total', COALESCE(progress_data.total_lessons, 0),
        'percentage', COALESCE(progress_data.completion_percentage, 0),
        'lastActivityAt', progress_data.last_activity_at,
        'status', COALESCE(progress_data.status, 'not_started')
    ) as progress
    
FROM courses c
LEFT JOIN (
    SELECT 
        m.course_id,
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons,
        ROUND(
            CASE 
                WHEN COUNT(l.id) > 0 
                THEN (COUNT(CASE WHEN up.status = 'completed' THEN 1 END)::float / COUNT(l.id)::float) * 100 
                ELSE 0 
            END
        ) as completion_percentage,
        MAX(up.updated_at) as last_activity_at,
        up.user_id,
        CASE 
            WHEN COUNT(CASE WHEN up.status = 'completed' THEN 1 END) = 0 THEN 'not_started'
            WHEN COUNT(CASE WHEN up.status = 'completed' THEN 1 END) = COUNT(l.id) THEN 'completed'
            ELSE 'in_progress'
        END as status
    FROM modules m
    JOIN lessons l ON l.module_id = m.id
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = auth.uid()
    WHERE m.is_published = true AND l.is_published = true
    GROUP BY m.course_id, up.user_id
) progress_data ON progress_data.course_id = c.id
WHERE c.is_published = true;

-- Grant permissions
GRANT SELECT ON user_course_progress TO authenticated;
GRANT SELECT ON user_course_progress TO anon;

-- Add comment for documentation
COMMENT ON VIEW user_course_progress IS 
'Provides courses with user-specific progress data. Shows completion percentage, total/completed lessons, and last activity for the authenticated user.';