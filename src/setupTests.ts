// Configuration pour les tests avec React Testing Library
import '@testing-library/jest-dom';

import { vi, beforeEach, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Ajout des matchers personnalisés
Object.entries(matchers).forEach(([name, matcher]) => {
  if (typeof matcher === 'function') {
    expect.extend({ [name]: matcher });
  }
});

// Configuration des mocks globaux
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Configuration pour les tests asynchrones
const { ResizeObserver } = window;

beforeEach(() => {
  // Nettoyage après chaque test
  cleanup();

  // Mock ResizeObserver
  // @ts-expect-error - We're intentionally deleting the property
  delete window.ResizeObserver;
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  // Restaure les mocks après chaque test
  vi.restoreAllMocks();

  // Restaure le ResizeObserver original
  window.ResizeObserver = ResizeObserver;
});

// Configuration globale pour les tests
afterAll(() => {
  // Nettoyage après tous les tests
  cleanup();
});
