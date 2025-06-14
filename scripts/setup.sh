#!/bin/sh
set -e # Arrête le script si une commande échoue

echo "🚀 Script de configuration démarré..."

echo "Installation des dépendances npm..."
npm install --legacy-peer-deps

echo "🎉 Configuration terminée. Lancement de l'application..."