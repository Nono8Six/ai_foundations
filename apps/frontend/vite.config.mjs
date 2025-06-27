// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from 'rollup-plugin-visualizer';
import path from "path"; // <-- Importez le module 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const shouldAnalyze = process.env.ANALYZE;
  return {
    build: {
      outDir: "build",
      chunkSizeWarningLimit: 2000,
    },

    plugins: [
      react(),
      shouldAnalyze &&
        visualizer({ filename: 'docs/bundle/stats.html', open: false }),
      // Removed tsconfigPaths() to avoid conflict with manual alias resolution
    ].filter(Boolean),

  // --- AJOUT DE CETTE SECTION ---
  // C'est ici qu'on résout le problème.
  // On dit explicitement à Vite que "@" correspond à la racine du dépôt.
  resolve: {
    alias: {
      "@": path.resolve(new URL(".", import.meta.url).pathname, "..", ".."),
    },
  },
  // ------------------------------
  
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new', 'localhost']
    },
  };
});
