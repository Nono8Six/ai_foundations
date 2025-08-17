-- P10 unit tests — respect P6/P8
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- GUCs pour autoriser les écritures protégées dans cette transaction de test
SET LOCAL app.allow_profiles_write = 'credit_xp';
SET LOCAL app.allow_xp_events_write = 'credit_xp';

\echo '📊 P10: Starting performance benchmarks...'

-- Set up test variables
\set test_user_1 '00000000-0000-0000-0000-000000000001'
\set test_user_2 '00000000-0000-0000-0000-000000000002'

-- ==========================================
-- 1. PERFORMANCE MEASUREMENT UTILITIES
-- ==========================================

-- Create performance measurement table for this session (drop if exists first)
DROP TABLE IF EXISTS perf_results;
CREATE TEMP TABLE perf_results (
  test_name VARCHAR(100),
  operation_type VARCHAR(50),
  iteration INTEGER,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_ms DECIMAL(10,3),
  success BOOLEAN,
  metadata JSONB
);

-- Function to measure operation performance
CREATE OR REPLACE FUNCTION measure_performance(
  test_name TEXT,
  operation_type TEXT,
  iterations INTEGER DEFAULT 100
) RETURNS TABLE(
  p50_ms DECIMAL(10,3),
  p95_ms DECIMAL(10,3),
  p99_ms DECIMAL(10,3),
  avg_ms DECIMAL(10,3),
  min_ms DECIMAL(10,3),
  max_ms DECIMAL(10,3),
  success_rate DECIMAL(5,2)
) AS $$
DECLARE
  start_ts TIMESTAMP WITH TIME ZONE;
  end_ts TIMESTAMP WITH TIME ZONE;
  duration_ms DECIMAL(10,3);
  i INTEGER;
  result JSONB;
  success_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Running % iterations of %...', iterations, operation_type;
  
  FOR i IN 1..iterations LOOP
    start_ts := clock_timestamp();
    
    BEGIN
      CASE operation_type
        WHEN 'credit_xp' THEN
          SELECT credit_xp(
            '00000000-0000-0000-0000-000000000001',
            'perf:test',
            1,
            'p10:perf:' || test_name || '-' || i::TEXT
          ) INTO result;
          
        WHEN 'get_active_xp_sources' THEN
          SELECT get_active_xp_sources() INTO result;
          
        WHEN 'compute_level_info' THEN
          SELECT compute_level_info((i * 47) % 1000) INTO result;  -- Varying XP values
          
        WHEN 'unlock_achievement' THEN
          SELECT unlock_achievement(
            '00000000-0000-0000-0000-000000000001',
            'P10_FIRST_LESSON',
            1,
            'p10:perf:achievement-' || test_name || '-' || i::TEXT,
            NULL,
            NULL
          ) INTO result;
          
        ELSE
          RAISE EXCEPTION 'Unknown operation type: %', operation_type;
      END CASE;
      
      success_count := success_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      -- Continue with timing even on error
      NULL;
    END;
    
    end_ts := clock_timestamp();
    duration_ms := EXTRACT(EPOCH FROM (end_ts - start_ts)) * 1000;
    
    INSERT INTO perf_results (
      test_name, operation_type, iteration, start_time, end_time, 
      duration_ms, success, metadata
    ) VALUES (
      test_name, operation_type, i, start_ts, end_ts,
      duration_ms, (success_count = i), jsonb_build_object('iteration', i)
    );
  END LOOP;
  
  -- Calculate percentiles and statistics
  RETURN QUERY
  SELECT 
    percentile_cont(0.5) WITHIN GROUP (ORDER BY pr.duration_ms)::DECIMAL(10,3) as p50_ms,
    percentile_cont(0.95) WITHIN GROUP (ORDER BY pr.duration_ms)::DECIMAL(10,3) as p95_ms,
    percentile_cont(0.99) WITHIN GROUP (ORDER BY pr.duration_ms)::DECIMAL(10,3) as p99_ms,
    AVG(pr.duration_ms)::DECIMAL(10,3) as avg_ms,
    MIN(pr.duration_ms)::DECIMAL(10,3) as min_ms,
    MAX(pr.duration_ms)::DECIMAL(10,3) as max_ms,
    (success_count::DECIMAL / iterations * 100) as success_rate
  FROM perf_results pr
  WHERE pr.test_name = measure_performance.test_name 
    AND pr.operation_type = measure_performance.operation_type;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. MICRO-BENCHMARKS
-- ==========================================

\echo '🚀 Running micro-benchmarks...'

-- Benchmark credit_xp (Target: < 50ms p95)
\echo 'Benchmarking credit_xp (Target: p95 < 50ms)...'
DO $$
DECLARE
  stats RECORD;
  sla_target DECIMAL(10,3) := 50.0;
BEGIN
  SELECT * INTO stats FROM measure_performance('credit_xp_benchmark', 'credit_xp', 50);
  
  RAISE NOTICE '📊 credit_xp Performance:';
  RAISE NOTICE '   P50: % ms, P95: % ms, P99: % ms', stats.p50_ms, stats.p95_ms, stats.p99_ms;
  RAISE NOTICE '   Avg: % ms, Min: % ms, Max: % ms', stats.avg_ms, stats.min_ms, stats.max_ms;
  RAISE NOTICE '   Success Rate: %%%', stats.success_rate;
  
  IF stats.p95_ms > sla_target THEN
    RAISE WARNING '⚠️  SLA VIOLATION: credit_xp p95 (% ms) exceeds target (% ms)', 
      stats.p95_ms, sla_target;
  ELSE
    RAISE NOTICE '✅ SLA MET: credit_xp p95 within target';
  END IF;
END $$;

-- Benchmark get_active_xp_sources (Target: < 10ms p95)
\echo 'Benchmarking get_active_xp_sources (Target: p95 < 10ms)...'
DO $$
DECLARE
  stats RECORD;
  sla_target DECIMAL(10,3) := 10.0;
BEGIN
  SELECT * INTO stats FROM measure_performance('get_sources_benchmark', 'get_active_xp_sources', 100);
  
  RAISE NOTICE '📊 get_active_xp_sources Performance:';
  RAISE NOTICE '   P50: % ms, P95: % ms, P99: % ms', stats.p50_ms, stats.p95_ms, stats.p99_ms;
  RAISE NOTICE '   Avg: % ms, Min: % ms, Max: % ms', stats.avg_ms, stats.min_ms, stats.max_ms;
  RAISE NOTICE '   Success Rate: %%%', stats.success_rate;
  
  IF stats.p95_ms > sla_target THEN
    RAISE WARNING '⚠️  SLA VIOLATION: get_active_xp_sources p95 (% ms) exceeds target (% ms)', 
      stats.p95_ms, sla_target;
  ELSE
    RAISE NOTICE '✅ SLA MET: get_active_xp_sources p95 within target';
  END IF;
END $$;

-- Benchmark compute_level_info (Target: < 2ms)
\echo 'Benchmarking compute_level_info (Target: p95 < 2ms)...'
DO $$
DECLARE
  stats RECORD;
  sla_target DECIMAL(10,3) := 2.0;
BEGIN
  SELECT * INTO stats FROM measure_performance('compute_level_benchmark', 'compute_level_info', 200);
  
  RAISE NOTICE '📊 compute_level_info Performance:';
  RAISE NOTICE '   P50: % ms, P95: % ms, P99: % ms', stats.p50_ms, stats.p95_ms, stats.p99_ms;
  RAISE NOTICE '   Avg: % ms, Min: % ms, Max: % ms', stats.avg_ms, stats.min_ms, stats.max_ms;
  RAISE NOTICE '   Success Rate: %%%', stats.success_rate;
  
  IF stats.p95_ms > sla_target THEN
    RAISE WARNING '⚠️  SLA VIOLATION: compute_level_info p95 (% ms) exceeds target (% ms)', 
      stats.p95_ms, sla_target;
  ELSE
    RAISE NOTICE '✅ SLA MET: compute_level_info p95 within target';
  END IF;
END $$;

-- ==========================================
-- 3. LOAD TESTING (1000 events/minute simulation)
-- ==========================================

\echo '🔥 Running load test (1000 events/minute simulation)...'

CREATE OR REPLACE FUNCTION simulate_user_load(
  user_id UUID,
  events_per_minute INTEGER DEFAULT 1000,
  duration_minutes INTEGER DEFAULT 1
) RETURNS TABLE(
  minute_mark INTEGER,
  events_processed INTEGER,
  total_time_ms DECIMAL(10,3),
  avg_time_ms DECIMAL(10,3),
  max_time_ms DECIMAL(10,3),
  error_count INTEGER
) AS $$
DECLARE
  events_to_process INTEGER := events_per_minute * duration_minutes;
  i INTEGER;
  start_ts TIMESTAMP WITH TIME ZONE;
  end_ts TIMESTAMP WITH TIME ZONE;
  total_start_ts TIMESTAMP WITH TIME ZONE;
  duration_ms DECIMAL(10,3);
  total_duration DECIMAL(10,3);
  max_duration DECIMAL(10,3) := 0;
  error_count INTEGER := 0;
  events_this_minute INTEGER := 0;
  current_minute INTEGER := 1;
BEGIN
  RAISE NOTICE 'Simulating % events for user % over % minute(s)...', 
    events_to_process, user_id, duration_minutes;
  
  total_start_ts := clock_timestamp();
  
  FOR i IN 1..events_to_process LOOP
    start_ts := clock_timestamp();
    
    BEGIN
      PERFORM credit_xp(
        user_id,
        'load:test',
        1,
        'p10:perf:load-test-' || user_id::TEXT || '-' || i::TEXT
      );
      
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
    END;
    
    end_ts := clock_timestamp();
    duration_ms := EXTRACT(EPOCH FROM (end_ts - start_ts)) * 1000;
    
    IF duration_ms > max_duration THEN
      max_duration := duration_ms;
    END IF;
    
    events_this_minute := events_this_minute + 1;
    
    -- Check if we've completed a minute's worth of events
    IF events_this_minute >= events_per_minute THEN
      total_duration := EXTRACT(EPOCH FROM (end_ts - total_start_ts)) * 1000;
      
      RETURN QUERY SELECT 
        current_minute,
        events_this_minute,
        total_duration,
        total_duration / events_this_minute,
        max_duration,
        error_count;
      
      current_minute := current_minute + 1;
      events_this_minute := 0;
      max_duration := 0;
      total_start_ts := clock_timestamp();
    END IF;
  END LOOP;
  
  -- Handle remaining events if any
  IF events_this_minute > 0 THEN
    total_duration := EXTRACT(EPOCH FROM (clock_timestamp() - total_start_ts)) * 1000;
    
    RETURN QUERY SELECT 
      current_minute,
      events_this_minute,
      total_duration,
      total_duration / events_this_minute,
      max_duration,
      error_count;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Run load test for 100 events (scaled down for testing)
DO $$
DECLARE
  rec RECORD;
  total_events INTEGER := 0;
  total_errors INTEGER := 0;
  max_avg_time DECIMAL(10,3) := 0;
BEGIN
  FOR rec IN SELECT * FROM simulate_user_load('00000000-0000-0000-0000-000000000001', 100, 1) LOOP
    total_events := total_events + rec.events_processed;
    total_errors := total_errors + rec.error_count;
    
    IF rec.avg_time_ms > max_avg_time THEN
      max_avg_time := rec.avg_time_ms;
    END IF;
    
    RAISE NOTICE 'Minute %: % events, %.3f ms avg, %.3f ms max, % errors',
      rec.minute_mark, rec.events_processed, rec.avg_time_ms, rec.max_time_ms, rec.error_count;
  END LOOP;
  
  RAISE NOTICE '📊 Load Test Summary:';
  RAISE NOTICE '   Total Events: %, Total Errors: %, Error Rate: %.2f%%',
    total_events, total_errors, (total_errors::DECIMAL / total_events * 100);
  RAISE NOTICE '   Max Average Time: %.3f ms', max_avg_time;
  
  IF total_errors > (total_events * 0.01) THEN  -- > 1% error rate
    RAISE WARNING '⚠️  HIGH ERROR RATE in load test: %.2f%%', 
      (total_errors::DECIMAL / total_events * 100);
  ELSE
    RAISE NOTICE '✅ Load test error rate acceptable';
  END IF;
END $$;

-- ==========================================
-- 4. CACHE PERFORMANCE TEST
-- ==========================================

\echo '🗄️  Testing cache performance...'

-- Test get_active_xp_sources cache effectiveness
DO $$
DECLARE
  cold_start TIMESTAMP WITH TIME ZONE;
  cold_end TIMESTAMP WITH TIME ZONE;
  warm_start TIMESTAMP WITH TIME ZONE;
  warm_end TIMESTAMP WITH TIME ZONE;
  cold_time_ms DECIMAL(10,3);
  warm_time_ms DECIMAL(10,3);
  result TEXT;
  i INTEGER;
  total_warm_time DECIMAL(10,3) := 0;
BEGIN
  -- Cold cache (first call)
  cold_start := clock_timestamp();
  SELECT get_active_xp_sources()::TEXT INTO result;
  cold_end := clock_timestamp();
  cold_time_ms := EXTRACT(EPOCH FROM (cold_end - cold_start)) * 1000;
  
  -- Warm cache (subsequent calls)
  FOR i IN 1..10 LOOP
    warm_start := clock_timestamp();
    SELECT get_active_xp_sources()::TEXT INTO result;
    warm_end := clock_timestamp();
    warm_time_ms := EXTRACT(EPOCH FROM (warm_end - warm_start)) * 1000;
    total_warm_time := total_warm_time + warm_time_ms;
  END LOOP;
  
  warm_time_ms := total_warm_time / 10;
  
  RAISE NOTICE '📊 Cache Performance:';
  RAISE NOTICE '   Cold cache: %.3f ms', cold_time_ms;
  RAISE NOTICE '   Warm cache (avg): %.3f ms', warm_time_ms;
  RAISE NOTICE '   Cache speedup: %.1fx', cold_time_ms / warm_time_ms;
  
  IF warm_time_ms > 10.0 THEN
    RAISE WARNING '⚠️  Warm cache performance above target (%.3f ms > 10ms)', warm_time_ms;
  ELSE
    RAISE NOTICE '✅ Cache performance within target';
  END IF;
END $$;

-- ==========================================
-- 5. SUMMARY REPORT
-- ==========================================

\echo '📋 Generating performance summary...'

DO $$
DECLARE
  rec RECORD;
  total_operations INTEGER := 0;
  sla_violations INTEGER := 0;
BEGIN
  RAISE NOTICE '📊 P10 Performance Benchmark Summary';
  RAISE NOTICE '=====================================';
  
  FOR rec IN 
    SELECT 
      operation_type,
      COUNT(*) as ops,
      percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_ms) as p50,
      percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) as p95,
      percentile_cont(0.99) WITHIN GROUP (ORDER BY duration_ms) as p99,
      AVG(duration_ms) as avg_time,
      (COUNT(*) FILTER (WHERE success) * 100.0 / COUNT(*)) as success_rate
    FROM perf_results 
    GROUP BY operation_type
    ORDER BY operation_type
  LOOP
    total_operations := total_operations + rec.ops;
    
    RAISE NOTICE '% (%ops):', rec.operation_type, rec.ops;
    RAISE NOTICE '  P50: %.2fms, P95: %.2fms, P99: %.2fms', rec.p50, rec.p95, rec.p99;
    RAISE NOTICE '  Avg: %.2fms, Success: %.1f%%', rec.avg_time, rec.success_rate;
    
    -- Check SLA violations
    CASE rec.operation_type
      WHEN 'credit_xp' THEN
        IF rec.p95 > 50 THEN 
          sla_violations := sla_violations + 1;
          RAISE NOTICE '  ❌ SLA VIOLATION: P95 > 50ms';
        ELSE
          RAISE NOTICE '  ✅ SLA OK';
        END IF;
      WHEN 'get_active_xp_sources' THEN
        IF rec.p95 > 10 THEN 
          sla_violations := sla_violations + 1;
          RAISE NOTICE '  ❌ SLA VIOLATION: P95 > 10ms';
        ELSE
          RAISE NOTICE '  ✅ SLA OK';
        END IF;
      WHEN 'compute_level_info' THEN
        IF rec.p95 > 2 THEN 
          sla_violations := sla_violations + 1;
          RAISE NOTICE '  ❌ SLA VIOLATION: P95 > 2ms';
        ELSE
          RAISE NOTICE '  ✅ SLA OK';
        END IF;
    END CASE;
    RAISE NOTICE '';
  END LOOP;
  
  RAISE NOTICE 'Total Operations: %, SLA Violations: %', total_operations, sla_violations;
  
  IF sla_violations = 0 THEN
    RAISE NOTICE '🎉 ALL SLA TARGETS MET!';
  ELSE
    RAISE NOTICE '⚠️  % SLA violations detected', sla_violations;
  END IF;
END $$;

-- Clean up
DROP FUNCTION IF EXISTS measure_performance(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS simulate_user_load(UUID, INTEGER, INTEGER);

COMMIT;

\echo '✅ P10: Performance benchmarks completed'
\echo '   - Micro-benchmarks executed with SLA validation'
\echo '   - Load testing completed (scaled simulation)'
\echo '   - Cache performance analyzed'
\echo '   - Performance summary generated'