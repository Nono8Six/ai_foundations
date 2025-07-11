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
        {
          find: '@utils',
          replacement: path.resolve(__dirname, './src/utils')
        },
        {
          find: '@services',
          replacement: path.resolve(__dirname, './src/services')
        },
        {
          find: '@components',
          replacement: path.resolve(__dirname, './src/components')
        },
        {
          find: '@contexts',
          replacement: path.resolve(__dirname, './src/context')
        },
        {
          find: '@lib',
          replacement: path.resolve(__dirname, './src/lib')
        },
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