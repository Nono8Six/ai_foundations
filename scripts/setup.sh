#!/bin/bash
set -e # Arrête le script si une commande échoue

echo "🚀 Script de configuration démarré..."

# NOTE : La création du .env est redondante si docker-compose utilise 'env_file'
# mais nous la laissons pour la compatibilité avec d'autres environnements (comme Codex)
# et pour nous assurer que Vite le trouve s'il en a besoin.
if [ ! -f ".env" ]; then
    echo "Fichier .env non trouvé, création à partir des variables d'environnement..."
    printenv | grep VITE_ > .env
fi

echo "✅ Fichier .env vérifié."

# Installation de la CLI Supabase si non présente
if ! command -v supabase &> /dev/null
then
    echo "Installation de la CLI Supabase..."
    curl -sL https://github.com/supabase/cli/releases/latest/download/install.sh | sh
    export PATH="/root/.supabase/bin:$PATH"
    echo "✅ CLI Supabase installée : $(supabase -v)"
else
    echo "✅ CLI Supabase déjà installée."
fi

# Connexion et Vérification
if [ -n "$SUPABASE_ACCESS_TOKEN" ] && [ -n "$SUPABASE_PROJECT_REF" ]; then
    echo "Connexion à Supabase et vérification du projet..."
    echo "$SUPABASE_ACCESS_TOKEN" | supabase login
    supabase link --project-ref "$SUPABASE_PROJECT_REF"
    supabase status # Cette commande échouera si la liaison ou la connexion a échoué
    echo "✅ Connexion et liaison au projet Supabase réussies."

    # Génération des types
    echo "Génération des types..."
    supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/types/database.types.ts
    echo "✅ Types générés."
else
    echo "⚠️ Variables d'accès Supabase non définies. L'étape de génération des types est ignorée."
fi

echo "🎉 Configuration terminée. Lancement de l'application..."