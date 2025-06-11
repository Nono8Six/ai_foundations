// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // Cette section configure le dossier de sortie pour la production.
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },

  // Ce sont les plugins qui ajoutent des fonctionnalités à Vite.
  // tsconfigPaths() est celui qui lit votre tsconfig.json pour comprendre les alias comme @/
  plugins: [tsconfigPaths(), react(), tagger()],

  // Configuration du serveur de développement local.
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }

  // Il n'est pas nécessaire d'ajouter une section "define".
  // Vite s'occupe automatiquement d'exposer les variables VITE_* de votre fichier .env.
});