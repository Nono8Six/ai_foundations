// P10 Performance Tests Runner
const { spawn } = require('child_process');
const path = require('path');

function setExit(code) {
  process.exitCode = Number.isInteger(code) ? code : 1;
}

async function runPerformanceTests() {
  console.log('📊 Running P10 Performance Benchmarks...');
  
  const psqlArgs = [
    '-h', process.env.DB_HOST || 'aws-0-eu-central-1.pooler.supabase.com',
    '-p', process.env.DB_PORT || '6543',
    '-U', process.env.DB_USER || 'postgres.oqmllypaarqvabuvbqga',
    '-d', process.env.DB_NAME || 'postgres',
    '-f', path.join(__dirname, 'seed.sql'),
    '-f', path.join(__dirname, 'db_perf.sql'),
    '-f', path.join(__dirname, 'collect_explain.sql'),
    '-f', path.join(__dirname, 'teardown.sql'),
    '-v', 'ON_ERROR_STOP=1'
  ];

  return new Promise((resolve, reject) => {
    const psql = spawn('psql', psqlArgs, {
      stdio: 'inherit',
      env: {
        ...process.env,
        PGPASSWORD: process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD
      }
    });

    psql.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Performance tests completed successfully');
        resolve();
      } else {
        console.error('❌ Performance tests failed');
        reject(new Error(`psql exit code: ${code}`));
      }
    });
  });
}

if (require.main === module) {
  runPerformanceTests().catch(e => {
    console.error('❌ Performance tests failed:', e?.message || e);
    setExit(e?.code ?? 1);
  });
}

module.exports = { runPerformanceTests };