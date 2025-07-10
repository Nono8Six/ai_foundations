import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/dist-types/',
      '**/coverage/',
      'apps/frontend/dist/',
      'apps/backend/supabase/db/',
      'apps/backend/supabase/generated/',
      '.pnpm-store/',
      '**/*.test.*',
      '**/*.spec.*',
    ],
  },

  // Base configuration for all files
  js.configs.recommended,

  // TypeScript configurations
  ...tseslint.configs.recommended,

  // React configurations (only for the frontend app)
  {
    files: ['apps/frontend/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      ...pluginReact.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with modern React/Vite
      'react/prop-types': 'off', // Handled by TypeScript
    },
  },

  // Node.js scripts
  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: {
        ...globals.node,
      },
    },
  },

  // General rules for the entire project
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Prettier must be the last configuration to override other formatting rules
  prettierConfig
);
