#!/bin/bash

# Fonction pour afficher les messages d'erreur
fatal() {
  echo "❌ ERREUR: $1" >&2
  exit 1
}

# Vérifier si les variables d'environnement requises sont définies
check_required_vars() {
    local env_file=$1
    local missing_vars=()
    
    if [ ! -f "$env_file" ]; then
        fatal "Le fichier $env_file n'existe pas. Veuillez créer ce fichier à partir du template."
    fi
    
    # Vérifier les variables requises
    if ! grep -q "^VITE_SUPABASE_URL=" "$env_file"; then
        missing_vars+=("VITE_SUPABASE_URL")
    fi
    
    if ! grep -q "^VITE_SUPABASE_ANON_KEY=" "$env_file"; then
        missing_vars+=("VITE_SUPABASE_ANON_KEY")
    fi
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        fatal "Variables manquantes dans $env_file: ${missing_vars[*]}"
    fi
    
    echo "✅ Toutes les variables requises sont présentes dans $env_file"
}

# Vérifier les variables d'environnement
echo "Vérification des variables d'environnement..."

# Vérifier le fichier .env
if [ -f ".env" ]; then
    check_required_vars ".env"
else
    fatal "Le fichier .env est manquant. Créez-en un à partir de .env.example"
fi

echo "✅ Vérification terminée avec succès"
