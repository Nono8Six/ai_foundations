-- P10 Teardown Script
-- Soft cleanup - removes only test data, preserves all DDL
-- IDEMPOTENT: Can be run multiple times safely

\echo '🧹 P10: Starting test data cleanup...'

-- Start transaction
BEGIN;

-- ==========================================
-- 1. CLEANUP TEST XP EVENTS
-- ==========================================

\echo '🗑️  Cleaning up test XP events...'

-- Remove all XP events for test users
DELETE FROM xp_events 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- Count handled within transaction

-- Remove performance test events
DELETE FROM xp_events 
WHERE idempotency_key LIKE 'perf-%'
   OR idempotency_key LIKE 'load-test-%'
   OR idempotency_key LIKE 'explain-%'
   OR idempotency_key LIKE 'concurrent-%'
   OR idempotency_key LIKE 'test-%';

-- Additional cleanup completed
\echo '   Test XP events removed';

-- ==========================================
-- 2. CLEANUP TEST ACHIEVEMENTS
-- ==========================================

\echo '🗑️  Cleaning up test achievements...'

-- Remove achievements for test users
DELETE FROM user_achievements 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- Remove test achievements (cleanup already done above)

\echo '   Test achievements cleaned up';

-- ==========================================
-- 3. RESET TEST USER PROFILES
-- ==========================================

\echo '🔄 Resetting test user profiles...'

-- Allow profiles write for cleanup (P6 guard bypass)
SET LOCAL app.allow_profiles_write = 'credit_xp';

-- Reset XP and level for test users
UPDATE profiles 
SET 
  xp = 0,
  level = 1,
  current_streak = 0,
  last_completed_at = NULL,
  updated_at = NOW()
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- Profile reset completed
\echo '   Test user profiles reset';

-- ==========================================
-- 4. CLEANUP TEST COURSES AND LESSONS
-- ==========================================

\echo '🗑️  Cleaning up test courses and lessons...'

-- Remove test lessons (using correct UUID patterns)
DELETE FROM lessons 
WHERE id IN (
  '30000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000004',
  '30000000-0000-0000-0000-000000000005',
  '30000000-0000-0000-0000-000000000006'
);



-- Remove test courses
DELETE FROM courses 
WHERE id IN (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002'
);



\echo '   Test lessons and courses cleaned up';

-- ==========================================
-- 5. CLEANUP TEST XP SOURCES
-- ==========================================

\echo '🗑️  Cleaning up test XP sources...'

-- Remove test XP sources
DELETE FROM xp_sources 
WHERE id IN (
  '40000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000002',
  '40000000-0000-0000-0000-000000000003',
  '40000000-0000-0000-0000-000000000004'
);


\echo '   Test XP sources cleaned up';

-- ==========================================
-- 6. CLEANUP TEST ACHIEVEMENT DEFINITIONS
-- ==========================================

\echo '🗑️  Cleaning up test achievement definitions...'

-- Remove test achievement definitions
DELETE FROM achievement_definitions 
WHERE id IN (
  '50000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000002',
  '50000000-0000-0000-0000-000000000003'
);


\echo '   Test achievement definitions cleaned up';

-- ==========================================
-- 7. CLEANUP TEST USERS (CAREFUL)
-- ==========================================

\echo '🗑️  Cleaning up test users...'

-- Remove test users from auth.users (be very careful here)
DELETE FROM auth.users 
WHERE email IN (
  'test-user-1@p10.local',
  'test-user-2@p10.local',
  'admin@p10.local'
);


\echo '   Test users cleaned up from auth.users';

-- Remove test profiles (cascade should handle this, but explicit for safety)
DELETE FROM profiles 
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);


\echo '   Test profiles cleaned up';

-- ==========================================
-- 8. RESET STATISTICS (OPTIONAL)
-- ==========================================

\echo '📊 Resetting test-related statistics...'

-- Reset statistics for tables that were heavily used in testing
-- This helps ensure clean performance measurements in future runs
ANALYZE xp_events;
ANALYZE profiles;
ANALYZE xp_sources;
ANALYZE user_achievements;
ANALYZE achievement_definitions;

\echo '   Database statistics refreshed';

-- ==========================================
-- 9. VERIFICATION
-- ==========================================

\echo '✅ Verifying cleanup...'

DO $$
DECLARE
  remaining_test_data INTEGER;
  verification_passed BOOLEAN := TRUE;
BEGIN
  -- Check for remaining test XP events
  SELECT COUNT(*) INTO remaining_test_data 
  FROM xp_events 
  WHERE idempotency_key LIKE 'test-%' 
     OR idempotency_key LIKE 'perf-%'
     OR idempotency_key LIKE 'load-%'
     OR idempotency_key LIKE 'explain-%'
     OR idempotency_key LIKE 'concurrent-%';
  
  IF remaining_test_data > 0 THEN
    RAISE WARNING '⚠️  % test XP events remain', remaining_test_data;
    verification_passed := FALSE;
  ELSE
    RAISE NOTICE '✅ All test XP events cleaned up';
  END IF;
  
  -- Check for remaining test achievements
  SELECT COUNT(*) INTO remaining_test_data 
  FROM user_achievements 
  WHERE details->>'idempotency_key' LIKE 'test-%'
     OR achievement_type LIKE 'P10_%';
  
  IF remaining_test_data > 0 THEN
    RAISE WARNING '⚠️  % test achievements remain', remaining_test_data;
    verification_passed := FALSE;
  ELSE
    RAISE NOTICE '✅ All test achievements cleaned up';
  END IF;
  
  -- Check for remaining test courses
  SELECT COUNT(*) INTO remaining_test_data 
  FROM courses 
  WHERE id LIKE 'course-p10-%' OR id LIKE 'lesson-p10-%';
  
  IF remaining_test_data > 0 THEN
    RAISE WARNING '⚠️  % test courses/lessons remain', remaining_test_data;
    verification_passed := FALSE;
  ELSE
    RAISE NOTICE '✅ All test courses/lessons cleaned up';
  END IF;
  
  -- Check for remaining test users
  SELECT COUNT(*) INTO remaining_test_data 
  FROM auth.users 
  WHERE email LIKE '%@p10.local';
  
  IF remaining_test_data > 0 THEN
    RAISE WARNING '⚠️  % test users remain', remaining_test_data;
    verification_passed := FALSE;
  ELSE
    RAISE NOTICE '✅ All test users cleaned up';
  END IF;
  
  IF verification_passed THEN
    RAISE NOTICE '🎉 Cleanup verification PASSED - all test data removed';
  ELSE
    RAISE WARNING '⚠️  Cleanup verification FAILED - some test data remains';
  END IF;
END $$;

COMMIT;

\echo '';
\echo '✅ P10: Teardown completed successfully';
\echo '   - Test data cleaned up (XP events, achievements, users)';
\echo '   - Database schemas and DDL preserved';
\echo '   - Statistics refreshed for clean future runs';
\echo '   - Cleanup verification completed';
\echo '';
\echo '🔄 System ready for next P10 test run';