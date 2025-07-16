// Modern TypeScript 5.8+ with exactOptionalPropertyTypes
export interface AuthError {
  readonly code?: string | undefined;
  readonly message?: string | undefined;
  readonly originalError?: {
    readonly code?: string | undefined;
  } | null | undefined;
  readonly url?: string | undefined;
  readonly requestUrl?: string | undefined;
}

export interface AuthErrorWithCode extends Error {
  code?: string | undefined;
  originalError?: { 
    readonly code?: string | undefined;
  } | undefined;
  url?: string | undefined;
  requestUrl?: string | undefined;
}

// Branded types for better type safety
export type AuthErrorCode = 
  | 'wrong_password'
  | 'email_not_confirmed'
  | 'too_many_requests'
  | 'invalid_credentials'
  | 'network_error'
  | 'unknown_error';

export interface StrictAuthError extends Error {
  readonly code: AuthErrorCode;
  readonly originalError?: AuthError | undefined;
  readonly timestamp: number;
}
