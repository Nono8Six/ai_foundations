import type { AuthErrorWithCode } from '../types/auth';

export function isAuthErrorWithCode(e: unknown): e is AuthErrorWithCode {
  return typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    typeof (e as any).code === 'string';
}
