#!/usr/bin/env node

/**
 * Safe setup script with advanced error handling
 * Handles shell compatibility issues and provides robust error recovery
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Execute command with proper error handling
 */
function safeExec(command, options = {}) {
  try {
    logInfo(`Executing: ${command}`);
    const result = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf8',
      ...options
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.status,
      output: error.stdout ? error.stdout.trim() : '',
      stderr: error.stderr ? error.stderr.trim() : ''
    };
  }
}

/**
 * Check if a command exists
 */
function commandExists(command) {
  const result = safeExec(`which ${command} 2>/dev/null || command -v ${command} 2>/dev/null`);
  return result.success;
}

/**
 * Detect current shell
 */
function detectShell() {
  const shell = process.env.SHELL || process.env.ComSpec || '';
  const shellName = path.basename(shell).toLowerCase();
  
  logInfo(`Detected shell: ${shellName || 'unknown'}`);
  
  // List of shells supported by pnpm
  const supportedShells = ['bash', 'zsh', 'fish', 'ksh', 'dash', 'sh'];
  const isSupported = supportedShells.includes(shellName.replace(/\.exe$/, ''));
  
  return {
    name: shellName,
    path: shell,
    supported: isSupported,
    supportedShells
  };
}

/**
 * Check pnpm installation and version
 */
function checkPnpm() {
  logStep('1/6', 'Checking pnpm installation');
  
  if (!commandExists('pnpm')) {
    logError('pnpm is not installed or not in PATH');
    logInfo('Please install pnpm: npm install -g pnpm');
    return false;
  }
  
  const versionResult = safeExec('pnpm --version');
  if (!versionResult.success) {
    logError('Failed to get pnpm version');
    return false;
  }
  
  logSuccess(`pnpm version: ${versionResult.output}`);
  return true;
}

/**
 * Install dependencies with error handling
 */
function installDependencies() {
  logStep('2/6', 'Installing dependencies');
  
  const installResult = safeExec('pnpm install', { cwd: process.cwd() });
  
  if (!installResult.success) {
    logError('Failed to install root dependencies');
    logError(`Error: ${installResult.stderr || installResult.error}`);
    return false;
  }
  
  logSuccess('Root dependencies installed');
  
  // Install frontend dependencies
  const frontendPath = path.join(process.cwd(), 'apps', 'frontend');
  if (fs.existsSync(frontendPath)) {
    logInfo('Installing frontend dependencies...');
    const frontendResult = safeExec('pnpm install', { cwd: frontendPath });
    
    if (!frontendResult.success) {
      logWarning('Failed to install frontend dependencies');
      logWarning(`Error: ${frontendResult.stderr || frontendResult.error}`);
    } else {
      logSuccess('Frontend dependencies installed');
    }
  }
  
  // Install backend dependencies
  const backendPath = path.join(process.cwd(), 'apps', 'backend');
  if (fs.existsSync(backendPath)) {
    logInfo('Installing backend dependencies...');
    const backendResult = safeExec('pnpm install', { cwd: backendPath });
    
    if (!backendResult.success) {
      logWarning('Failed to install backend dependencies');
      logWarning(`Error: ${backendResult.stderr || backendResult.error}`);
    } else {
      logSuccess('Backend dependencies installed');
    }
  }
  
  return true;
}

/**
 * Handle pnpm setup with shell compatibility
 */
function handlePnpmSetup() {
  logStep('3/6', 'Configuring pnpm (optional)');
  
  const shell = detectShell();
  
  if (!shell.supported) {
    logWarning(`Current shell '${shell.name}' is not supported by pnpm setup`);
    logWarning(`Supported shells: ${shell.supportedShells.join(', ')}`);
    logInfo('Skipping pnpm setup - this won\'t affect core functionality');
    return true;
  }
  
  // Try to run pnpm setup
  const setupResult = safeExec('pnpm setup');
  
  if (!setupResult.success) {
    logWarning('pnpm setup failed, but this is optional');
    logWarning(`Error: ${setupResult.stderr || setupResult.error}`);
    logInfo('You can manually run "pnpm setup" later in a supported shell if needed');
  } else {
    logSuccess('pnpm setup completed');
  }
  
  return true;
}

/**
 * Validate environment
 */
function validateEnvironment() {
  logStep('4/6', 'Validating environment');
  
  const envResult = safeExec('pnpm validate:env');
  
  if (!envResult.success) {
    logWarning('Environment validation failed');
    logWarning(`Error: ${envResult.stderr || envResult.error}`);
    logInfo('Please check your .env file configuration');
    return false;
  }
  
  logSuccess('Environment validation passed');
  return true;
}

/**
 * Test Supabase connection
 */
function testSupabase() {
  logStep('5/6', 'Testing Supabase connection');
  
  const supabaseResult = safeExec('pnpm test:supabase');
  
  if (!supabaseResult.success) {
    logWarning('Supabase connection test failed');
    logWarning(`Error: ${supabaseResult.stderr || supabaseResult.error}`);
    logInfo('Please check your Supabase configuration');
    return false;
  }
  
  logSuccess('Supabase connection test passed');
  return true;
}

/**
 * Run type checking
 */
function runTypeCheck() {
  logStep('6/6', 'Running type check');
  
  const typecheckResult = safeExec('pnpm typecheck');
  
  if (!typecheckResult.success) {
    logWarning('Type checking failed');
    logWarning(`Error: ${typecheckResult.stderr || typecheckResult.error}`);
    logInfo('There may be TypeScript errors that need to be resolved');
    return false;
  }
  
  logSuccess('Type checking passed');
  return true;
}

/**
 * Main setup function
 */
function main() {
  log('\n🚀 Starting safe setup process...', 'bright');
  log('=====================================', 'bright');
  
  const steps = [
    { name: 'Check pnpm', fn: checkPnpm, critical: true },
    { name: 'Install dependencies', fn: installDependencies, critical: true },
    { name: 'Configure pnpm', fn: handlePnpmSetup, critical: false },
    { name: 'Validate environment', fn: validateEnvironment, critical: false },
    { name: 'Test Supabase', fn: testSupabase, critical: false },
    { name: 'Type check', fn: runTypeCheck, critical: false }
  ];
  
  let criticalFailures = 0;
  let warnings = 0;
  
  for (const step of steps) {
    try {
      const success = step.fn();
      if (!success) {
        if (step.critical) {
          criticalFailures++;
          logError(`Critical step failed: ${step.name}`);
        } else {
          warnings++;
        }
      }
    } catch (error) {
      logError(`Unexpected error in ${step.name}: ${error.message}`);
      if (step.critical) {
        criticalFailures++;
      } else {
        warnings++;
      }
    }
  }
  
  log('\n📊 Setup Summary', 'bright');
  log('=================', 'bright');
  
  if (criticalFailures === 0) {
    logSuccess('Setup completed successfully!');
    if (warnings > 0) {
      logWarning(`${warnings} non-critical warning(s) occurred`);
      logInfo('The project should still work correctly');
    }
    
    log('\n🎉 Next steps:', 'green');
    log('- Run "pnpm dev" to start the development server', 'green');
    log('- Run "pnpm dev:full:docker" to start with backend services', 'green');
    
    process.exit(0);
  } else {
    logError(`Setup failed with ${criticalFailures} critical error(s)`);
    logError('Please resolve the critical issues before proceeding');
    
    log('\n🔧 Troubleshooting:', 'yellow');
    log('- Check that Node.js >= 20.0.0 is installed', 'yellow');
    log('- Ensure pnpm is properly installed: npm install -g pnpm', 'yellow');
    log('- Verify your .env file is properly configured', 'yellow');
    
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  safeExec,
  commandExists,
  detectShell,
  checkPnpm,
  installDependencies,
  handlePnpmSetup,
  validateEnvironment,
  testSupabase,
  runTypeCheck
};