// P10 Status Check - Quick validation of test suite readiness
const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const ARTIFACTS_DIR = path.resolve(__dirname, '../../artifacts/p10');

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${exists ? 'Ready' : 'Missing'}`);
  return exists;
}

function checkP10Status() {
  console.log('🔍 P10 Test Suite Status Check');
  console.log('================================');
  
  let allReady = true;
  
  // Check scripts
  console.log('\n📁 Test Scripts:');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'seed.sql'), 'Database seeding');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'db_unit.sql'), 'Database unit tests');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'db_concurrency.sql'), 'Concurrency tests');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'db_perf.sql'), 'Performance benchmarks');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'collect_explain.sql'), 'EXPLAIN collection');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'teardown.sql'), 'Teardown script');
  allReady &= checkFileExists(path.join(SCRIPTS_DIR, 'run_all.cjs'), 'Orchestration script');
  
  // Check E2E tests
  console.log('\n🌐 Frontend E2E Tests:');
  const e2eTestPath = path.resolve(__dirname, '../../apps/frontend/src/tests/p10/e2e-xp-system.test.ts');
  allReady &= checkFileExists(e2eTestPath, 'E2E test suite');
  
  // Check artifacts directory
  console.log('\n📊 Artifacts Directory:');
  const artifactsDirExists = fs.existsSync(ARTIFACTS_DIR);
  console.log(`${artifactsDirExists ? '✅' : '❌'} Artifacts directory: ${artifactsDirExists ? 'Ready' : 'Missing'}`);
  if (!artifactsDirExists) {
    allReady = false;
  }
  
  // Check environment
  console.log('\n🔧 Environment:');
  const hasDbPassword = !!(process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD);
  console.log(`${hasDbPassword ? '✅' : '❌'} Database credentials: ${hasDbPassword ? 'Configured' : 'Missing'}`);
  if (!hasDbPassword) {
    console.log('   Set DB_PASSWORD or SUPABASE_DB_PASSWORD environment variable');
    allReady = false;
  }
  
  // Check P9-C guards
  console.log('\n🛡️  P9-C Guards:');
  const guardScript = path.resolve(__dirname, '../../apps/frontend/scripts/guard-xp.cjs');
  const guardExists = fs.existsSync(guardScript);
  console.log(`${guardExists ? '✅' : '❌'} XP architecture guards: ${guardExists ? 'Active' : 'Missing'}`);
  allReady &= guardExists;
  
  // Available commands
  console.log('\n📋 Available Commands:');
  console.log('   pnpm p10:test:db           # Database unit tests');
  console.log('   pnpm p10:test:concurrency  # Concurrency tests');
  console.log('   pnpm p10:test:perf         # Performance benchmarks');
  console.log('   pnpm -C apps/frontend p10:test:e2e  # Frontend E2E tests');
  console.log('   pnpm p10:all               # Complete test suite');
  
  // Overall status
  console.log('\n🎯 Overall Status:');
  if (allReady) {
    console.log('✅ P10 Test Suite is READY for execution');
    console.log('   Run `pnpm p10:all` to execute the complete test suite');
  } else {
    console.log('❌ P10 Test Suite has missing components');
    console.log('   Please address the issues above before running tests');
  }
  
  return allReady;
}

if (require.main === module) {
  const ready = checkP10Status();
  process.exit(ready ? 0 : 1);
}

module.exports = { checkP10Status };