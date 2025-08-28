// vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(() => {
  const shouldAnalyze = process.env.ANALYZE;
  return {
    envDir: '../../', // Look for .env files in the monorepo root
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
    },

    plugins: [
      react(),
      shouldAnalyze && visualizer({ filename: 'docs/bundle/stats.html', open: false }),
    ].filter(Boolean),

    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
        {
          find: '@frontend',
          replacement: path.resolve(__dirname, './src')
        },
        // New modular structure aliases
        {
          find: '@core',
          replacement: path.resolve(__dirname, './src/core')
        },
        {
          find: '@shared',
          replacement: path.resolve(__dirname, './src/shared')
        },
        {
          find: '@features',
          replacement: path.resolve(__dirname, './src/features')
        },
        {
          find: '@libs',
          replacement: path.resolve(__dirname, '../../libs')
        },
        // Updated aliases for new structure
        {
          find: '@utils',
          replacement: path.resolve(__dirname, './src/shared/utils')
        },
        {
          find: '@services',
          replacement: path.resolve(__dirname, './src/shared/services')
        },
        {
          find: '@components',
          replacement: path.resolve(__dirname, './src/shared/components')
        },
        {
          find: '@contexts',
          replacement: path.resolve(__dirname, './src/shared/contexts')
        },
        {
          find: '@ui',
          replacement: path.resolve(__dirname, './src/shared/ui')
        },
        {
          find: '@layouts',
          replacement: path.resolve(__dirname, './src/shared/layouts')
        },
        {
          find: '@hooks',
          replacement: path.resolve(__dirname, './src/shared/hooks')
        },
        {
          find: '@/lib',
          replacement: path.resolve(__dirname, './src/lib')
        },
        {
          find: '@lib',
          replacement: path.resolve(__dirname, './src/lib')
        },
        // Libs aliases (unchanged)
        {
          find: '@libs',
          replacement: path.resolve(__dirname, '../../libs')
        },
        {
          find: '@logger',
          replacement: path.resolve(__dirname, '../../libs/logger')
        },
        {
          find: 'tailwind-config',
          replacement: path.resolve(__dirname, './tailwind.config.js')
        },
      ]
    },

    server: {
      port: 5173,
      host: '0.0.0.0',
      strictPort: true,
      allowedHosts: ['.amazonaws.com', '.builtwithrocket.new', 'localhost'],
      hmr: { host: 'localhost', port: 5173 },
      watch: {
        usePolling: process.env.CHOKIDAR_USEPOLLING === '1',
        interval: Number(process.env.CHOKIDAR_INTERVAL ?? 300),
        ignored: ['**/node_modules/**', '**/pnpm-store/**'],
      },
    },
  };
});