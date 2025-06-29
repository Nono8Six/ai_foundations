/// <reference types="vite/client" />

// Déclaration des types pour les variables d'environnement Vite
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_DEBUG?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_APP_ENV?: string;
  // Ajoutez d'autres variables d'environnement ici au besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  // Autres propriétés de l'objet import.meta
  [key: string]: unknown;
}
