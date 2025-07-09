// eslint.config.js
import base from '../../eslint.config.js';
import globals from 'globals';
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  ...base,
  // Configuration pour React
  {
    files: ['**/*.{jsx,tsx}'],
    settings: {
      react: {
        version: 'detect', // Détecte automatiquement la version de React
      },
    },
  },
  // Configuration globale pour tous les fichiers
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser, // Pour les variables globales du navigateur comme `window`, `document`
        ...globals.node, // Pour les variables globales de Node.js comme `process`
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
    },
  },
  {
    files: ['src/lib/__mocks__/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Importe les règles recommandées par ESLint
  js.configs.recommended,

  // Configuration spécifique pour React
  {
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      // On importe les règles recommandées pour React
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      // On applique vos règles personnalisées pour React
      'react/react-in-jsx-scope': 'off', // Pas nécessaire avec les nouvelles versions de React
      'react/prop-types': 'off', // Utile si vous utilisez TypeScript pour les props
      'react/no-unescaped-entities': 'off',
      'no-undef': 'off',
    },
    settings: {
      // Détecte automatiquement la version de React
      react: {
        version: 'detect',
        pragma: 'React',
        fragment: 'Fragment',
      },
    },
  },

  // Applique la configuration de Prettier.
  // Cela désactive les règles ESLint qui pourraient entrer en conflit avec Prettier.
  // IMPORTANT : Cette ligne doit être à la fin du tableau.
  prettierConfig,

  // On ajoute vos autres règles personnalisées
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest,
        ...globals.jest,
      },
    },
    rules: {
      'react/display-name': 'off',
    },
  },
];
