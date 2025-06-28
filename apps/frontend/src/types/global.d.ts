/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Ajoutez d'autres variables d'environnement ici
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Example module declarations for third-party libraries without types
// (extend or adjust as needed if libraries lack their own typings)
declare module 'recharts';
