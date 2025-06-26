import { createClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (typeof supabaseUrl !== 'string' || supabaseUrl.length === 0) {
  throw new Error('VITE_SUPABASE_URL must be a non-empty string');
}

if (typeof supabaseAnonKey !== 'string' || supabaseAnonKey.length === 0) {
  throw new Error('VITE_SUPABASE_ANON_KEY must be a non-empty string');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
