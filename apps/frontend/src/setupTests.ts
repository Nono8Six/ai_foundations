import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

declare global {
  // Vitest provides a Jest-compatible API
  var jest: typeof vi;
}
// Provide Jest compatibility helpers for code written with Jest APIs

globalThis.jest = vi;

afterEach(() => vi.clearAllMocks());
