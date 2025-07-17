// Vite environment fixes for exactOptionalPropertyTypes
declare module 'vite/module-runner' {
  interface ModuleRunnerImportMeta extends ImportMeta {
    env: ImportMetaEnv & {
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
      readonly NODE_ENV: string;
      readonly VITE_DEBUG?: string;
      readonly VITE_APP_NAME?: string;
      readonly VITE_LOG_LEVEL?: string;
      readonly VITE_APP_ENV?: string;
    };
  }
}