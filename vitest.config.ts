import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['**/*.test.{js,jsx}'],
    threads: false,
    poolOptions: {
      vmThreads: {
        memoryLimit: 256
      }
    }
  }
});
