import '@testing-library/jest-dom';
import { vi } from 'vitest';
/* global afterEach */

// Provide Jest compatibility helpers for code written with Jest APIs
 
globalThis.jest = vi;

afterEach(() => vi.clearAllMocks());
