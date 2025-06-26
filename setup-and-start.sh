#!/bin/sh

echo "🚀 Configuration de l'environnement pour Bolt.new..."

# 1. Installation de pnpm 10 globalement
echo "📦 Installation de pnpm 10..."
npm install -g pnpm@latest

# 2. Configuration du répertoire global pnpm pour éviter NO_GLOBAL_BIN_DIR
echo "🔧 Configuration de PNPM_HOME..."
export PNPM_HOME="$HOME/.local/share/pnpm"
mkdir -p "$PNPM_HOME"
export PATH="$PNPM_HOME:$PATH"

# 3. Vérification de la version de pnpm
echo "✅ Version de pnpm installée:"
pnpm --version

# 4. Installation des dépendances avec ignore-engines (pour Node 18)
echo "📥 Installation des dépendances..."
pnpm install --ignore-engines

# 5. Lancement du projet (remplacez 'dev:full' par votre script)
echo "🎯 Lancement du projet..."
pnpm run dev:full