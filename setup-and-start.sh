#!/bin/sh

echo "🚀 Configuration de l'environnement Bolt.new pour monorepo..."

# 1. Installation de pnpm 10 globalement
echo "📦 Installation de pnpm 10..."
npm install -g pnpm@10.12.2

# 2. Configuration du répertoire global pnpm
echo "🔧 Configuration de PNPM_HOME..."
export PNPM_HOME="$HOME/.local/share/pnpm"
mkdir -p "$PNPM_HOME"
export PATH="$PNPM_HOME:$PATH"

# 3. Vérification de la version
echo "✅ Version de pnpm installée:"
pnpm --version

# 4. Installation des dépendances (sans preinstall hook qui bloque)
echo "📥 Installation des dépendances du workspace..."
ONLY_ALLOW_BYPASS=1 pnpm install --ignore-engines --ignore-scripts

# 5. Installation des sous-projets
echo "📦 Installation des dépendances des apps..."
cd apps/frontend && ONLY_ALLOW_BYPASS=1 pnpm install --ignore-engines --ignore-scripts
cd ../backend && ONLY_ALLOW_BYPASS=1 pnpm install --ignore-engines --ignore-scripts
cd ../..

# 6. Build des packages partagés si nécessaire
echo "🔨 Build des packages partagés..."
if [ -d "packages/logger" ]; then
  cd packages/logger && pnpm build
  cd ../..
fi

# 7. Lancement en mode développement (sans Docker)
echo "🎯 Lancement du frontend..."
cd apps/frontend && pnpm dev --host 0.0.0.0 --port 3000