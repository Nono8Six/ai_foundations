import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    environmentMatchGlobs: [['**/cli.test.ts', 'node']],
    setupFiles: './src/setupTests.ts',
    include: ['**/*.test.{ts,tsx}'],
  },
});
