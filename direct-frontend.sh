#!/bin/sh

echo "🚀 Lancement direct du frontend..."

# Installation de pnpm 10
echo "📦 Installation de pnpm..."
npm install -g pnpm@10.12.2

# Configuration PATH
export PNPM_HOME="$HOME/.local/share/pnpm"
mkdir -p "$PNPM_HOME"
export PATH="$PNPM_HOME:$PATH"

echo "📁 Structure du projet:"
ls -la

# Vérifier la structure
if [ ! -d "apps/frontend" ]; then
  echo "❌ apps/frontend non trouvé. Structure disponible:"
  find . -name "*.json" -type f | head -10
  exit 1
fi

echo "📂 Contenu de apps/:"
ls -la apps/

# Aller au frontend
cd apps/frontend

echo "📂 Contenu du frontend:"
ls -la

# Vérifier le package.json du frontend
if [ ! -f "package.json" ]; then
  echo "❌ Pas de package.json dans apps/frontend"
  exit 1
fi

echo "📋 Scripts disponibles dans le frontend:"
cat package.json | grep -A 10 '"scripts"'

# Installation directe avec npm pour éviter les problèmes pnpm
echo "📦 Installation avec npm..."
npm install

# Lancement du serveur
echo "🚀 Lancement du serveur de développement..."
npm run dev -- --host 0.0.0.0 --port 3000