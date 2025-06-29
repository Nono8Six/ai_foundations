#!/bin/sh
set -e

# Recovery script to restore a clean working environment

echo "♻️  Recovery script: Attempting to restore a cleaner working environment."

echo " स्टेप 1: Nettoyage de base (similaire à scripts/cleanup.sh mais sans 'docker system prune')..."
if [ -f ./scripts/cleanup.sh ]; then
    echo "   Exécution de docker-compose down -v..."
    docker-compose down -v || echo "   Avertissement: docker-compose down a échoué, poursuite."

    echo "   Suppression des dossiers node_modules..."
    find . -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null || echo "   Avertissement: La suppression de node_modules a échoué, poursuite."
else
    echo "   Avertissement: scripts/cleanup.sh non trouvé. Nettoyage manuel partiel."
    docker-compose down -v || true
    find . -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null || true
fi

echo "\n स्टेप 2: Réinstallation des dépendances pnpm..."
pnpm install --frozen-lockfile
if [ $? -ne 0 ]; then
    echo "❌ ERREUR: 'pnpm install' a échoué. Veuillez vérifier votre connexion réseau et la configuration pnpm."
    exit 1
fi

echo "\n स्टेप 3: Validation des variables d'environnement..."
if [ -f ./scripts/validate-env.js ]; then
    node ./scripts/validate-env.js
    if [ $? -ne 0 ]; then
        echo "   Avertissement: La validation de l'environnement a échoué. Assurez-vous que votre fichier .env est correctement configuré."
    fi
else
    echo "   Avertissement: scripts/validate-env.js non trouvé. Impossible de valider .env."
fi

echo "\n✅ Récupération basique terminée."
echo "💡 Actions manuelles suggérées ensuite :"
echo "   1. Configurez votre fichier .env si ce n'est pas déjà fait (copiez depuis .env.example)."
echo "   2. Démarrez l'environnement Supabase local si nécessaire: 'pnpm db:start'"
echo "   3. Synchronisez votre schéma Supabase local avec le cloud: 'pnpm db:pull'"
echo "   4. Générez les types Supabase: 'pnpm gen:types'"
echo "   5. Lancez l'environnement de développement: 'pnpm dev'"
