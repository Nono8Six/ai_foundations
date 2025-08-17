// P10 Test Suite Orchestration - Local Execution Only
// Comprehensive XP system testing with artifacts collection
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SCRIPTS_DIR = __dirname;
const ARTIFACTS_DIR = path.resolve(__dirname, '../../artifacts/p10');
const ROOT_DIR = path.resolve(__dirname, '../..');

// Ensure artifacts directory exists
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function log(message) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${message}`);
}

function setExit(code) {
  process.exitCode = Number.isInteger(code) ? code : 1;
}

async function execSQL(sqlFile, description) {
  return new Promise((resolve, reject) => {
    log(`Starting: ${description}`);
    
    const psqlArgs = [
      '-h', process.env.DB_HOST || 'aws-0-eu-central-1.pooler.supabase.com',
      '-p', process.env.DB_PORT || '6543',
      '-U', process.env.DB_USER || 'postgres.oqmllypaarqvabuvbqga',
      '-d', process.env.DB_NAME || 'postgres',
      '-f', path.join(SCRIPTS_DIR, sqlFile),
      '-v', 'ON_ERROR_STOP=1',
      '--echo-errors'
    ];

    const psql = spawn('psql', psqlArgs, {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PGPASSWORD: process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD
      }
    });

    let stdout = '';
    let stderr = '';

    psql.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    psql.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    psql.on('close', (code) => {
      const resultFile = path.join(ARTIFACTS_DIR, `${path.basename(sqlFile, '.sql')}_${timestamp()}.log`);
      const result = {
        description,
        exitCode: code,
        timestamp: new Date().toISOString(),
        stdout,
        stderr
      };

      fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
      
      if (code === 0) {
        log(`✅ Completed: ${description}`);
        resolve(result);
      } else {
        log(`❌ Failed: ${description} (exit code: ${code})`);
        reject(new Error(`SQL execution failed: ${stderr}`));
      }
    });
  });
}

async function execPnpm(command, description) {
  return new Promise((resolve, reject) => {
    log(`Starting: ${description}`);
    
    const PNPM = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    const pnpm = spawn(PNPM, command.split(' '), {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: ROOT_DIR,
      shell: true
    });

    let stdout = '';
    let stderr = '';

    pnpm.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pnpm.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pnpm.on('close', (code) => {
      const resultFile = path.join(ARTIFACTS_DIR, `${command.replace(/[^\w]/g, '_')}_${timestamp()}.log`);
      const result = {
        description,
        command,
        exitCode: code,
        timestamp: new Date().toISOString(),
        stdout,
        stderr
      };

      fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
      
      if (code === 0) {
        log(`✅ Completed: ${description}`);
        resolve(result);
      } else {
        log(`❌ Failed: ${description} (exit code: ${code})`);
        reject(new Error(`Command failed: ${stderr}`));
      }
    });
  });
}

async function runP10Suite() {
  const startTime = Date.now();
  const results = {
    suite: 'P10 Comprehensive XP Testing',
    startTime: new Date().toISOString(),
    results: []
  };

  try {
    // 1. Seed test data
    log('🌱 Phase 1: Seeding test data');
    const seedResult = await execSQL('seed.sql', 'Database seeding');
    results.results.push(seedResult);

    // 2. Database unit tests
    log('🧪 Phase 2: Database unit tests');
    const dbUnitResult = await execSQL('db_unit.sql', 'Database unit tests');
    results.results.push(dbUnitResult);

    // 3. Concurrency tests
    log('⚡ Phase 3: Concurrency tests');
    const concurrencyResult = await execSQL('db_concurrency.sql', 'Concurrency tests');
    results.results.push(concurrencyResult);

    // 4. Performance tests
    log('📊 Phase 4: Performance benchmarks');
    const perfResult = await execSQL('db_perf.sql', 'Performance benchmarks');
    results.results.push(perfResult);

    // 5. EXPLAIN collection
    log('📋 Phase 5: EXPLAIN ANALYZE collection');
    const explainResult = await execSQL('collect_explain.sql', 'EXPLAIN ANALYZE collection');
    results.results.push(explainResult);

    // 6. Frontend E2E tests
    log('🌐 Phase 6: Frontend E2E tests');
    const e2eResult = await execPnpm('-C apps/frontend p10:test:e2e', 'Frontend E2E tests');
    results.results.push(e2eResult);

    // 7. Teardown
    log('🧹 Phase 7: Teardown');
    const teardownResult = await execSQL('teardown.sql', 'Test data cleanup');
    results.results.push(teardownResult);

    results.endTime = new Date().toISOString();
    results.duration = Date.now() - startTime;
    results.success = true;

    log(`🎉 P10 Suite completed successfully in ${Math.round(results.duration / 1000)}s`);

  } catch (error) {
    results.endTime = new Date().toISOString();
    results.duration = Date.now() - startTime;
    results.success = false;
    results.error = error.message;

    log(`💥 P10 Suite failed: ${error.message}`);
    process.exit(1);
  }

  // Save summary
  const summaryFile = path.join(ARTIFACTS_DIR, `p10_suite_summary_${timestamp()}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2));
  
  log(`📋 Summary saved to: ${summaryFile}`);
  return results;
}

// Execute if called directly
if (require.main === module) {
  runP10Suite().catch(e => {
    console.error('❌ P10 Suite failed:', e?.message || e);
    setExit(e?.code ?? 1);
  });
}

module.exports = { runP10Suite };