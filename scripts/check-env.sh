#!/bin/sh

# Fonction pour afficher un message d'erreur et quitter
fatal() {
    echo "[ERREUR] $1" >&2
    exit 1
}

# Vérifier si les variables d'environnement requises sont définies
check_required_vars() {
    local env_file=$1
    local required_vars=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")
    local missing_vars=()

    # Vérifier si le fichier existe
    if [ ! -f "$env_file" ]; then
        fatal "Le fichier $env_file n'existe pas. Veuillez créer ce fichier à partir du template."
    fi

    # Vérifier chaque variable requise
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            missing_vars+=("$var")
        fi
    done

    # Afficher les variables manquantes
    if [ ${#missing_vars[@]} -gt 0 ]; then
        fatal "Variables manquantes dans $env_file: ${missing_vars[*]}"
    fi

    echo "[SUCCÈS] Toutes les variables requises sont présentes dans $env_file"
}

# Vérifier les fichiers d'environnement
echo "Vérification des variables d'environnement..."

# Vérifier le fichier .env.development
if [ -f ".env.development" ]; then
    check_required_vars ".env.development"
else
    echo "[ATTENTION] Fichier .env.development non trouvé. Créez-en un à partir de .env.example"
fi

# Vérifier le fichier .env.production
if [ -f ".env.production" ]; then
    check_required_vars ".env.production"
else
    echo "[ATTENTION] Fichier .env.production non trouvé. Créez-en un à partir de .env.example"
fi

echo "Vérification terminée avec succès."
