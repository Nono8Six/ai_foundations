import type { AuthErrorWithCode } from '@frontend/types/auth';

export function isAuthErrorWithCode(e: unknown): e is AuthErrorWithCode {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    typeof (e as { code: unknown }).code === 'string'
  );
}
