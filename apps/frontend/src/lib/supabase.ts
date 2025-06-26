import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '../types/database.types';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

const { VITE_SUPABASE_URL: supabaseUrl, VITE_SUPABASE_ANON_KEY: supabaseAnonKey } =
  envSchema.parse(import.meta.env);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
