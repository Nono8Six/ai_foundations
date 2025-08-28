import { createClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import { z } from 'zod';
import { log } from '@libs/logger';
import { dynamicAuthStorage } from './storage';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

const { VITE_SUPABASE_URL: supabaseUrl, VITE_SUPABASE_ANON_KEY: supabaseAnonKey } = envSchema.parse(
  import.meta.env
);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Professional "Remember me" handling via dynamic storage (localStorage vs sessionStorage)
    storage: dynamicAuthStorage,
    // Reduce debug logs - only for explicit debugging
    debug: false,
  },
  global: {
    headers: {
      'x-client-info': 'ai-foundations-lms',
    },
  },
});

// Surveillance proactive des tokens
let tokenCheckInterval: NodeJS.Timeout | null = null;

export const startTokenMonitoring = () => {
  // Vérifier les tokens toutes les 5 minutes
  tokenCheckInterval = setInterval(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        log.warn('🔍 Token monitoring detected session error:', error);
        return;
      }
      
      if (!session) {
        log.debug('🔍 No session found during token monitoring');
        return;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      const timeUntilExpiry = expiresAt - now;
      
      // Si le token expire dans moins de 5 minutes, le rafraîchir
      if (timeUntilExpiry < 300) {
        log.debug('🔄 Token expires soon, refreshing...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          log.error('❌ Automatic token refresh failed:', refreshError);
        } else {
          log.debug('✅ Token refreshed automatically');
        }
      }
    } catch (error) {
      log.error('❌ Token monitoring error:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

export const stopTokenMonitoring = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }
};
