#!/bin/sh
set -e # Arrête le script si une commande échoue

echo "🚀 Script de configuration démarré..."

echo "Installation des dépendances npm..."
pnpm install --frozen-lockfile

echo "🎉 Configuration terminée. Lancement de l'application..."
