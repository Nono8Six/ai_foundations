export interface AuthError {
  code?: string;
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
