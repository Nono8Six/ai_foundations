#!/bin/bash
# Script de configuration automatique pour IA Foundations
# Ce script s'exécute automatiquement après le clonage du dépôt

echo "🚀 Démarrage de la configuration de l'environnement IA Foundations..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker avant de continuer."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si le fichier .env existe, sinon copier .env.example
if [ ! -f .env ]; then
    echo "ℹ️  Création du fichier .env à partir de .env.example..."
    cp .env.example .env
    
    # Demander les informations de configuration si nécessaire
    if grep -q "REMPLIR_CE_CHAMP" .env; then
        echo "\n🔧 Configuration requise :"
        read -p "Entrez l'URL de votre instance Supabase : " supabase_url
        read -p "Entrez la clé anonyme Supabase : " supabase_key
        
        # Mettre à jour le fichier .env
        sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=${supabase_url}|" .env
        sed -i "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=${supabase_key}|" .env
    fi
else
    echo "ℹ️  Le fichier .env existe déjà."
fi

# Construire les images Docker
echo "🏗  Construction des images Docker..."
docker-compose build --no-cache

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d app-dev

# Vérifier l'état des conteneurs
echo "\n📊 État des conteneurs :"
docker-compose ps

# Afficher les logs du conteneur principal
echo "\n📋 Dernières lignes des logs :"
docker-compose logs --tail=20 app-dev

echo "\n✅ Configuration terminée ! L'application est disponible sur http://localhost:3000"
echo "Pour arrêter l'application, exécutez : docker-compose down"
echo "Pour voir les logs en temps réel : docker-compose logs -f app-dev"
