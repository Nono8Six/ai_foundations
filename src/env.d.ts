interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_DEBUG?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_APP_ENV?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
