import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@frontend': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/context'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@libs': path.resolve(__dirname, '../../libs'),
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
