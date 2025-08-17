-- P10 Test Suite: Database Seeding
-- Creates minimal test data for comprehensive XP system testing
-- IDEMPOTENT: Can be run multiple times safely

\echo '🌱 P10: Seeding test data...'

-- Start transaction
BEGIN;

-- Create test users (if they don't exist)
INSERT INTO auth.users (
  id, 
  email, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'test-user-1@p10.local',
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Test User 1"}',
    '{}'
  ),
  (
    '00000000-0000-0000-0000-000000000002', 
    'test-user-2@p10.local',
    NOW(),
    NOW(), 
    NOW(),
    '{"full_name": "Test User 2"}',
    '{}'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'admin@p10.local',
    NOW(),
    NOW(),
    NOW(), 
    '{"full_name": "Admin User"}',
    '{"role": "admin"}'
  )
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW(),
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Satisfy P6 guard trigger for this transaction
SET LOCAL app.allow_profiles_write = 'credit_xp';

-- 1) Upsert shell profiles WITHOUT touching xp/level directly
INSERT INTO profiles (id, full_name, email, current_streak, last_completed_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001','Test User 1','test-user-1@p10.local',0,NULL,NOW(),NOW()),
  ('00000000-0000-0000-0000-000000000002','Test User 2','test-user-2@p10.local',3,NOW() - INTERVAL '1 day',NOW(),NOW()),
  ('00000000-0000-0000-0000-000000000003','Admin User','admin@p10.local',10,NOW() - INTERVAL '2 hours',NOW(),NOW())
ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      updated_at = NOW();

-- 2) Apply XP via RPC (idempotent; updates xp_events + profiles atomically)
-- User 2 → +150 XP
SELECT public.credit_xp(
  '00000000-0000-0000-0000-000000000002',
  'seed:init',
  150,
  'seed:profile:00000000-0000-0000-0000-000000000002:init'
);

-- Admin → +500 XP
SELECT public.credit_xp(
  '00000000-0000-0000-0000-000000000003',
  'seed:init',
  500,
  'seed:profile:00000000-0000-0000-0000-000000000003:init'
);

-- Create test courses
INSERT INTO courses (
  id,
  title,
  slug,
  description,
  created_at,
  updated_at
) VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    'P10 Test Course 1',
    'p10-test-course-1',
    'Test course for P10 suite',
    NOW(),
    NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000002', 
    'P10 Test Course 2',
    'p10-test-course-2',
    'Advanced test course for P10 suite',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Create test modules
INSERT INTO modules (
  id,
  course_id,
  title,
  description,
  module_order,
  created_at,
  updated_at
) VALUES 
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'P10 Test Module 1',
    'Test module for P10 suite',
    1,
    NOW(),
    NOW()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002', 
    'P10 Advanced Module 1',
    'Advanced test module for P10 suite',
    1,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Create test lessons
INSERT INTO lessons (
  id,
  module_id,
  title,
  content,
  lesson_order,
  text_content,
  created_at,
  updated_at
) VALUES 
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'P10 Lesson 1',
    '{"type": "text", "content": "Test lesson content"}',
    1,
    'Test lesson content',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001', 
    'P10 Lesson 2',
    '{"type": "text", "content": "Test lesson content 2"}',
    2,
    'Test lesson content 2',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    'P10 Lesson 3', 
    '{"type": "text", "content": "Test lesson content 3"}',
    3,
    'Test lesson content 3',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000002',
    'P10 Advanced Lesson 1',
    '{"type": "text", "content": "Advanced test content"}',
    1,
    'Advanced test content',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000002',
    'P10 Advanced Lesson 2',
    '{"type": "text", "content": "Advanced test content 2"}',
    2,
    'Advanced test content 2',
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000002',
    'P10 Advanced Lesson 3',
    '{"type": "text", "content": "Advanced test content 3"}', 
    3,
    'Advanced test content 3',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Ensure minimal XP sources exist (using unique p10 test types)
INSERT INTO xp_sources (
  id,
  source_type,
  action_type,
  version,
  xp_value,
  cooldown_minutes,
  max_per_day,
  is_repeatable,
  is_active,
  title,
  description,
  effective_from,
  effective_to
) VALUES 
  (
    '40000000-0000-0000-0000-000000000001',
    'p10_lesson',
    'start',
    1,
    10,
    0,
    NULL,
    true,
    true,
    'P10 Start Lesson',
    'XP for starting a P10 test lesson',
    NOW(),
    NULL
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'p10_lesson', 
    'completion',
    1,
    50,
    0,
    NULL,
    true,
    true,
    'P10 Complete Lesson',
    'XP for completing a P10 test lesson',
    NOW(),
    NULL
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'p10_quiz',
    'perfect_score',
    1,
    30,
    0,
    5,
    true,
    true,
    'P10 Perfect Quiz Score',
    'XP for perfect P10 quiz performance',
    NOW(),
    NULL
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'p10_profile',
    'completion_bonus',
    1,
    100,
    0,
    1,
    false,
    true,
    'P10 Profile Completion',
    'Bonus XP for completing P10 test profile',
    NOW(),
    NULL
  )
ON CONFLICT (source_type, action_type, version) DO UPDATE SET
  xp_value = EXCLUDED.xp_value,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Ensure minimal achievement definitions exist
INSERT INTO achievement_definitions (
  id,
  achievement_key,
  title,
  description,
  icon,
  category,
  xp_reward,
  condition_type,
  condition_params,
  code,
  version,
  is_active,
  effective_from
) VALUES 
  (
    '50000000-0000-0000-0000-000000000001',
    'p10_first_lesson',
    'P10 First Lesson',
    'Complete your first P10 test lesson',
    'trophy',
    'lesson',
    25,
    'lesson_count',
    '{"count": 1}',
    'P10_FIRST_LESSON',
    1,
    true,
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'p10_level_2',
    'P10 Level Up',
    'Reach level 2 in P10 tests',
    'star',
    'level',
    50,
    'level_reached',
    '{"level": 2}',
    'P10_LEVEL_2',
    1,
    true,
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'p10_xp_100',
    'P10 Century',
    'Earn 100 total XP in P10 tests',
    'zap',
    'xp',
    20,
    'xp_threshold',
    '{"threshold": 100}',
    'P10_XP_100',
    1,
    true,
    NOW()
  )
ON CONFLICT (achievement_key) DO UPDATE SET
  updated_at = NOW();

-- Clean any existing test data to ensure idempotency
DELETE FROM xp_events WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM user_achievements WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- XP reset is handled by the credit_xp RPC calls above
-- No direct profile updates needed due to P6 guard trigger

COMMIT;

\echo '✅ P10: Test data seeded successfully'
\echo '   - 3 test users created'  
\echo '   - 2 test courses with 6 lessons'
\echo '   - 4 XP sources configured'
\echo '   - 3 achievement definitions'
\echo '   - Clean state for testing'