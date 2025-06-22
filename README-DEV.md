# AI Foundations - Guide du Développeur

Ce guide vous aidera à configurer et utiliser l'environnement de développement local pour le projet AI Foundations.

## 🚀 Configuration Initiale

### Prérequis

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Git](https://git-scm.com/)
- Compte [Supabase](https://supabase.com/)

### 1. Configuration de l'Environnement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/ai-foundations.git
   cd ai-foundations
   ```

2. **Configurer les variables d'environnement**
   ```bash
   # Copier le fichier d'exemple `.env.example`
   cp .env.example .env
   
   # Éditer le fichier .env avec vos clés
   # Utilisez un éditeur de texte sécurisé
   notepad .env
   ```

3. **Variables d'environnement requises**
   
   Assurez-vous de configurer au minimum ces variables dans votre fichier `.env` :
   
   ```bash
   # Clés Supabase (à obtenir depuis le tableau de bord Supabase)
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase
   SUPABASE_PROJECT_REF=votre-projet-ref
   SUPABASE_ACCESS_TOKEN=votre-token-acces
   SUPABASE_DB_PASSWORD=votre-mot-de-passe-securise
   SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
   
   # JWT Secret (généré automatiquement)
   SUPABASE_JWT_SECRET=votre-jwt-secret-genere
   
   # Configuration pgAdmin (à modifier pour la production)
   PGADMIN_EMAIL=admin@votredomaine.com
   PGADMIN_PASSWORD=change-me-please
   ```
   
   ⚠️ **Sécurité** : Ne partagez jamais votre fichier `.env` ou vos clés secrètes. Le fichier `.env` est dans `.gitignore` pour éviter les fuites accidentelles.

### 2. Démarrer l'Environnement

```bash
# Construire et démarrer les conteneurs
docker-compose up --build -d

# Vérifier l'état des conteneurs
docker-compose ps
```

### 3. Accès aux Services

- **Application Frontend** : http://localhost:3000
- **Supabase Studio** : http://localhost:54323
  - Email: votre-email@example.com
  - Mot de passe: défini dans `.env`
- **pgAdmin** : http://localhost:5050
  - Email: admin@example.com
  - Mot de passe: admin (à changer dans `.env`)

## 🛠 Commandes Utiles

### Gestion des Conteneurs

| Commande | Description |
|----------|-------------|
| `docker-compose up -d` | Démarrer en arrière-plan |
| `docker-compose down` | Arrêter les conteneurs |
| `docker-compose down -v` | Arrêter et supprimer les volumes |
| `docker-compose logs -f` | Afficher les logs en temps réel |
| `docker-compose ps` | Voir l'état des conteneurs |

### Développement Frontend

```bash
# Se connecter au conteneur frontend
docker-compose exec frontend sh

# Installer une nouvelle dépendance
docker-compose exec frontend pnpm add package-name

# Lancer les tests
docker-compose exec frontend pnpm test

# Lancer le linter
docker-compose exec frontend pnpm lint
```

### Base de Données

```bash
# Se connecter à la base de données PostgreSQL
docker-compose exec db psql -U postgres

# Exécuter les migrations (opération exceptionnelle)
docker-compose exec supabase_cli supabase db push

# Redémarrer uniquement le service Supabase CLI
docker-compose restart supabase_cli
```

## 🔍 Débogage

### Voir les Logs

```bash
# Tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f frontend
```

### Inspecter un Conteneur

```bash
# Voir les informations d'un conteneur
docker inspect ai-foundations-frontend

# Voir l'utilisation des ressources
docker stats
```

## 🏗 Structure du Projet

```
ai-foundations/
├── apps/
│   ├── frontend/          # Application React
│   │   ├── public/        # Fichiers statiques
│   │   ├── src/           # Code source
│   │   └── package.json   # Dépendances frontend
│   └── backend/           # Logique métier et API
│       ├── supabase/      # Configuration Supabase
│       │   ├── migrations/        # Migrations de la base de données
│       │   └── config.toml        # Configuration Supabase
├── nginx/                 # Configuration Nginx
├── docker-compose.yml     # Configuration Docker Compose
└── Dockerfile            # Définition des images Docker
```

## 🔄 Workflow de Développement

1. **Créer une nouvelle branche**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```

2. **Développer**
   - Le code est monté en volume, les changements sont visibles immédiatement
   - Utilisez les outils de développement de votre navigateur

3. **Tester**
   ```bash
   docker-compose exec frontend pnpm test
   docker-compose exec frontend pnpm lint
   ```

4. **Valider les changements**
   ```bash
   git add .
   git commit -m "feat: ajouter nouvelle fonctionnalité"
   git push origin feature/nouvelle-fonctionnalite
   ```

## ⚠️ Dépannage

### Problèmes Courants

1. **Ports déjà utilisés**
   ```bash
   # Voir les processus utilisant un port
   sudo lsof -i :3000
   
   # Tuer un processus
   kill -9 <PID>
   ```

2. **Problèmes de permissions**
   ```bash
   sudo chown -R $USER:$USER .
   ```

3. **Nettoyer Docker**
   ```bash
   # Arrêter tous les conteneurs
   docker-compose down -v
   
   # Nettoyer les ressources inutilisées
   docker system prune -f
   ```

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation React](https://reactjs.org/docs/getting-started.html)
- [Guide Supabase](README-SUPABASE.md)
- [Guide de Style](docs/STYLE_GUIDE.md)
2. Les dépendances sont installées dans le conteneur, pas besoin de les installer sur votre machine.
3. La base de données est persistante grâce au volume Docker.
