// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.{js,ts,jsx,tsx}'],
    watchExclude: ['**/node_modules/**', '**/dist/**'],
  },
});
