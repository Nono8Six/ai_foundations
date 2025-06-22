#!/bin/bash

# Synchronise la base locale avec Supabase Cloud.
# Par défaut, exécute un « pull » pour mettre à jour le schéma local.
if [ -z "$1" ] || [ "$1" = "--pull" ]; then
    echo "🔄 Récupération des dernières modifications..."
    supabase db pull
    exit 0
fi

# Pousser les modifications locales (usage exceptionnel)
if [ "$1" = "--push" ]; then
    echo "🚀 Envoi des modifications (opération exceptionnelle)..."
    supabase db push
    exit 0
fi

echo "Usage: $0 [--pull|--push]"
exit 1
