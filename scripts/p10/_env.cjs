// P10 Environment Preloader - Automatic .env loading
// Loads .env.local then .env, derives PostgreSQL variables, constructs DATABASE_URL/DIRECT_URL

const path = require('path');
const fs = require('fs');

// Load dotenv if available
try {
  const dotenv = require('dotenv');
  
  const rootDir = path.resolve(__dirname, '../..');
  
  // Load .env.local first (overrides .env)
  const envLocalPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envLocalPath)) {
    console.log('🔧 Loading .env.local');
    dotenv.config({ path: envLocalPath });
  }
  
  // Load .env as fallback
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    console.log('🔧 Loading .env');
    dotenv.config({ path: envPath });
  }
  
  // Derive PostgreSQL environment variables from Supabase
  if (process.env.SUPABASE_URL && !process.env.DB_HOST) {
    try {
      const url = new URL(process.env.SUPABASE_URL);
      const supabaseProjectRef = url.hostname.split('.')[0];
      
      // Derive database connection details (use existing env vars if available)
      process.env.DB_HOST = process.env.DB_HOST || process.env.SUPABASE_DB_HOST || 'aws-0-eu-central-1.pooler.supabase.com';
      process.env.DB_PORT = process.env.DB_PORT || process.env.SUPABASE_DB_PORT || '6543';
      process.env.DB_USER = process.env.DB_USER || process.env.SUPABASE_DB_USER || `postgres.${supabaseProjectRef}`;
      process.env.DB_NAME = process.env.DB_NAME || process.env.SUPABASE_DB_NAME || 'postgres';
      
      // Use service role key as password if available
      if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.DB_PASSWORD) {
        process.env.DB_PASSWORD = process.env.SUPABASE_SERVICE_ROLE_KEY;
      }
      
      // Also set SUPABASE_DB_PASSWORD as alias
      if (process.env.DB_PASSWORD && !process.env.SUPABASE_DB_PASSWORD) {
        process.env.SUPABASE_DB_PASSWORD = process.env.DB_PASSWORD;
      }
      
      console.log(`🔗 Derived DB connection: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    } catch (err) {
      console.warn('⚠️  Could not parse SUPABASE_URL for database derivation:', err.message);
    }
  }
  
  // Construct DATABASE_URL if missing
  if (!process.env.DATABASE_URL && process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
    process.env.DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'postgres'}`;
    console.log('🔗 Constructed DATABASE_URL from components');
  }
  
  // Construct DIRECT_URL if missing (for direct connection)
  if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
    // For Supabase, DIRECT_URL typically uses port 5432 instead of 6543
    process.env.DIRECT_URL = process.env.DATABASE_URL.replace(':6543/', ':5432/');
    console.log('🔗 Constructed DIRECT_URL for direct connection');
  }
  
  // Validate essential variables are present
  const hasDbPassword = !!(process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD);
  if (hasDbPassword) {
    console.log('✅ Database credentials loaded successfully');
  } else {
    console.warn('⚠️  Database credentials still missing - check .env file');
  }
  
} catch (err) {
  console.warn('⚠️  dotenv not available or failed to load:', err.message);
  console.warn('   Environment variables must be set manually');
}