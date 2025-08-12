import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@frontend': path.resolve(__dirname, './src'),
      // New modular structure aliases
      '@core': path.resolve(__dirname, './src/core'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@libs': path.resolve(__dirname, '../../libs'),
      // Updated aliases for new structure
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@services': path.resolve(__dirname, './src/shared/services'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@contexts': path.resolve(__dirname, './src/shared/contexts'),
      '@ui': path.resolve(__dirname, './src/shared/ui'),
      '@layouts': path.resolve(__dirname, './src/shared/layouts'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@lib': path.resolve(__dirname, './src/lib'),
      // Libs aliases
      '@logger': path.resolve(__dirname, '../../libs/logger'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentMatchGlobs: [['**/cli.test.ts', 'node']],
    setupFiles: './src/setupTests.ts',
    include: ['**/*.test.{ts,tsx}'],
    testTimeout: 10000,
  },
});
