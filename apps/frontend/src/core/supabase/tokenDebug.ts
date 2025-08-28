import { supabase } from './client';
import { log } from '@libs/logger';

/**
 * Debug utility to verify JWT token attachment and validity
 */
export const debugTokenState = async (): Promise<{
  hasSession: boolean;
  hasAccessToken: boolean;
  tokenExpiry?: Date;
  isExpired: boolean;
  userId?: string;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      log.error('🚨 Token debug - Session error:', error);
      return { hasSession: false, hasAccessToken: false, isExpired: true };
    }
    
    if (!session) {
      log.warn('🚨 Token debug - No session found');
      return { hasSession: false, hasAccessToken: false, isExpired: true };
    }
    
    const hasAccessToken = !!session.access_token;
    const tokenExpiry = session.expires_at ? new Date(session.expires_at * 1000) : undefined;
    const isExpired = session.expires_at ? session.expires_at < Math.floor(Date.now() / 1000) : false;
    
    const result = {
      hasSession: true,
      hasAccessToken,
      tokenExpiry,
      isExpired,
      userId: session.user?.id
    };
    
    log.debug('🔍 Token debug state:', result);
    
    // Test actual API call to verify token attachment
    try {
      const { error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (testError) {
        log.error('🚨 Token debug - API test failed:', testError);
        return { ...result, isExpired: true }; // Token not properly attached
      }
      
      log.debug('✅ Token debug - API test successful');
    } catch (apiError) {
      log.error('🚨 Token debug - API test exception:', apiError);
      return { ...result, isExpired: true };
    }
    
    return result;
  } catch (err) {
    log.error('🚨 Token debug - Unexpected error:', err);
    return { hasSession: false, hasAccessToken: false, isExpired: true };
  }
};

/**
 * Wait for JWT token to be properly attached
 * Returns true when token is ready, false on timeout
 */
export const waitForTokenAttachment = async (maxWaitMs = 3000): Promise<boolean> => {
  const startTime = Date.now();
  let attempts = 0;
  
  while (Date.now() - startTime < maxWaitMs) {
    attempts++;
    log.debug(`🔄 Waiting for token attachment - Attempt ${attempts}`);
    
    const tokenState = await debugTokenState();
    
    if (tokenState.hasSession && tokenState.hasAccessToken && !tokenState.isExpired) {
      log.debug(`✅ Token ready after ${attempts} attempts (${Date.now() - startTime}ms)`);
      return true;
    }
    
    // Wait before next check
    await new Promise<void>(resolve => {
      setTimeout(resolve, 100);
    });
  }
  
  log.error(`❌ Token attachment timeout after ${maxWaitMs}ms (${attempts} attempts)`);
  return false;
};