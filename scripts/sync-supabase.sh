#!/bin/bash

# Vérifier les mises à jour
if [ "$1" = "--pull" ]; then
    echo "🔄 Récupération des dernières modifications..."
    supabase db pull
    exit 0
fi

# Pousser les modifications locales
if [ "$1" = "--push" ]; then
    echo "🚀 Envoi des modifications..."
    supabase db push
    exit 0
fi

echo "Usage: $0 [--pull|--push]"
exit 1
