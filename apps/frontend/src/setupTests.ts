import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Provide Jest compatibility helpers for code written with Jest APIs
Object.assign(globalThis, {
  jest: vi
});

afterEach(() => vi.clearAllMocks());
