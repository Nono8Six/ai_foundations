import { log } from '@libs/logger';
import type { PostgrestError, AuthError } from '@supabase/supabase-js';

// Types for interceptor callback
type AuthErrorHandler = () => void;

let authErrorHandler: AuthErrorHandler | null = null;

// Set the auth error handler (to be called from AuthContext)
export const setAuthErrorHandler = (handler: AuthErrorHandler) => {
  authErrorHandler = handler;
};

// Check if error is authentication-related
export const isAuthError = (error: unknown): boolean => {
  if (!error) return false;
  
    // Type guard to check if error has message property with proper type checking
  const isErrorWithMessage = (e: unknown): e is { message: string } => {
    return (
      typeof e === 'object' && 
      e !== null && 
      'message' in e && 
      typeof (e as { message: unknown }).message === 'string'
    );
  };

  // Type guard to check for status code with proper type checking
  const hasStatusCode = (e: unknown): e is { status: number } | { statusCode: number } => {
    if (typeof e !== 'object' || e === null) return false;
    
    const hasStatus = 'status' in e && typeof (e as { status: unknown }).status === 'number';
    const hasStatusCode = 'statusCode' in e && typeof (e as { statusCode: unknown }).statusCode === 'number';
    
    return hasStatus || hasStatusCode;
  };

  // Check for common authentication error patterns
  const authErrorPatterns = [
    'JWT',
    'expired',
    'invalid',
    'unauthorized',
    'PGRST301', // PostgREST JWT decode error
    'RLS',
    'policy'
  ];
  
  const errorMessage = isErrorWithMessage(error) ? error.message : '';
  
  let statusCode = 0;
  if (hasStatusCode(error)) {
    if ('status' in error) {
      statusCode = error.status;
    } else if ('statusCode' in error) {
      statusCode = error.statusCode;
    }
  }
  
  // Check for 401 (Unauthorized) - Don't auto-logout on 500 for now
  if (statusCode === 401) {
    return true;
  }
  
  // Check for specific error patterns
  return authErrorPatterns.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
};

// Global error interceptor
export const handleSupabaseError = (error: unknown, context: string = 'Unknown'): boolean => {
  if (isAuthError(error)) {
    log.warn(`🔐 Authentication error detected in ${context}:`, error);
    
    // Call the auth error handler if it's set
    if (authErrorHandler) {
      log.warn('🚪 Triggering automatic sign out...');
      authErrorHandler();
    }
    
    return true; // Error was handled
  }
  
  return false; // Error was not handled
};

// Enhanced query wrapper with automatic error handling
export const safeSupabaseQuery = async <T>(
  queryFn: () => Promise<{ data: T; error: PostgrestError | AuthError | null }>,
  context: string = 'Query'
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const result = await queryFn();
    
    if (result.error) {
      const wasHandled = handleSupabaseError(result.error, context);
      if (wasHandled) {
        // Return null data if auth error was handled
        return { data: null, error: result.error };
      }
    }
    
    return result;
  } catch (error) {
    const wasHandled = handleSupabaseError(error, context);
    if (wasHandled) {
      // Convert error to standard Error if necessary
      const normalizedError = error instanceof Error 
        ? error 
        : new Error(String(error));
      return { data: null, error: normalizedError };
    }
    throw error;
  }
};