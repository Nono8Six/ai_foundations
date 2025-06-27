#!/bin/sh
set -e

echo "🚀 Démarrage rapide pour Bolt.new..."

# Installation rapide de pnpm
npm install -g pnpm@10.12.2

# Configuration PATH
export PNPM_HOME="$HOME/.local/share/pnpm"
mkdir -p "$PNPM_HOME"
export PATH="$PNPM_HOME:$PATH"

# Installation minimale
echo "📦 Installation des dépendances..."
ONLY_ALLOW_BYPASS=1 pnpm install --ignore-engines --ignore-scripts --no-frozen-lockfile || echo "⚠️ Installation workspace partiellement échouée"

# Aller directement au frontend
echo "🎯 Lancement du frontend..."
cd apps/frontend || {
  echo "❌ Dossier apps/frontend non trouvé"
  echo "📁 Contenu du répertoire actuel:"
  ls -la
  exit 1
}

# Installation des dépendances frontend
echo "📦 Installation frontend..."
ONLY_ALLOW_BYPASS=1 pnpm install --ignore-engines --ignore-scripts --no-frozen-lockfile || echo "⚠️ Installation frontend partiellement échouée"

# Démarrage
echo "🚀 Démarrage du serveur..."
exec pnpm dev --host 0.0.0.0 --port 3000
