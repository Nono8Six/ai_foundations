// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"; // <-- Importez le module 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  
  plugins: [
    react(),
    // On garde tsconfigPaths au cas où, mais l'ajout manuel est plus robuste
    tsconfigPaths(), 
  ],

  // --- AJOUT DE CETTE SECTION ---
  // C'est ici qu'on résout le problème.
  // On dit explicitement à Vite que "@" correspond au dossier "src".
  resolve: {
    alias: {
      "@": path.resolve(new URL(".", import.meta.url).pathname, "src"),
    },
  },
  // ------------------------------
  
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});