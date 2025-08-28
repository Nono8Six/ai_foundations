import { createClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import { z } from 'zod';
import { dynamicAuthStorage } from './storage';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

const { VITE_SUPABASE_URL: supabaseUrl, VITE_SUPABASE_ANON_KEY: supabaseAnonKey } = envSchema.parse(
  import.meta.env
);

// Secondary client dedicated to email link flows (recovery/magic links) in implicit mode
export const supabaseImplicit = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storage: dynamicAuthStorage,
  },
  global: {
    headers: {
      'x-client-info': 'ai-foundations-lms',
    },
  },
});

