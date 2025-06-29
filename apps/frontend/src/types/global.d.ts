import type * as React from 'react';

/// <reference types="vite/client" />

declare global {
  // Permet d'éviter les no-undef sur JSX
  var JSX: typeof React;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_APP_ENV?: string;
  // Ajoutez d'autres variables d'environnement ici
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Example module declarations for third-party libraries without types
// (extend or adjust as needed if libraries lack their own typings)
declare module 'recharts';
