export interface AuthError {
  code?: string | undefined;
  message?: string;
  originalError?: {
    code?: string;
  } | null;
  url?: string;
  requestUrl?: string;
}

export interface AuthErrorWithCode extends Error {
  code?: string;
  originalError?: { code?: string };
  url?: string;
  requestUrl?: string;
}

export function isAuthErrorWithCode(err: unknown): err is AuthErrorWithCode {
  if (!(err instanceof Error)) return false;
  const obj = err as unknown as Record<string, unknown>;
  return (
    'code' in obj ||
    'originalError' in obj ||
    'url' in obj ||
    'requestUrl' in obj ||
    'message' in obj
  );
}
