# AI Foundations - Plateforme d'Apprentissage

Plateforme complète pour les cours sur les Fondations de l'IA, construite avec une architecture moderne et évolutive.

## 🏗 Architecture Technique

### 🚀 Stack Technique

- **Frontend** : React 18 avec Vite 6.3.5
- **Styling** : Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Base de données** : PostgreSQL via Supabase
- **Conteneurisation** : Docker + Docker Compose
- **Gestion de paquets** : pnpm
- **Qualité de code** : ESLint, Prettier

### 📦 Services Conteneurisés

1. **Frontend** : Application React avec hot-reload
2. **Supabase** : Base de données PostgreSQL complète avec authentification
3. **pgAdmin** : Interface d'administration de base de données (optionnel)

## 🚀 Démarrage Rapide

### Prérequis

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Git](https://git-scm.com/)
- Compte [Supabase](https://supabase.com/)

### Configuration Initiale

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/ai-foundations.git
   cd ai-foundations
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Éditez le fichier `.env` avec vos clés Supabase et autres configurations.

3. **Démarrer l'environnement**
   ```bash
   docker-compose up --build -d
   ```

4. **Accéder aux services**
   - Application : http://localhost:3000
   - Supabase Studio : http://localhost:54323
   - pgAdmin : http://localhost:5050 (admin@example.com/admin)

## 🛠 Commandes Utiles

### Gestion des Conteneurs

| Commande | Description |
|----------|-------------|
| `docker-compose up -d` | Démarrer les services en arrière-plan |
| `docker-compose down` | Arrêter et supprimer les conteneurs |
| `docker-compose logs -f` | Voir les logs en temps réel |
| `docker-compose ps` | Voir l'état des conteneurs |
| `docker-compose exec frontend sh` | Se connecter au conteneur frontend |

### Développement

```bash
# Installer les dépendances (si nécessaire)
docker-compose exec frontend pnpm install

# Lancer les tests
docker-compose exec frontend pnpm test

# Vérifier le formatage
docker-compose exec frontend pnpm format:check
```
## 🚀 Mode Production

Pour générer l'image optimisée et lancer l'application :

```bash
# Assurez-vous de disposer d'un fichier .env configuré
docker compose -f docker-compose.prod.yml up --build -d
```

Vous pouvez aussi construire l'image manuellement :

```bash
docker build --target production -t ai-foundations:prod .
```

Les variables requises sont lues depuis le même fichier `.env`.


## 🏗 Structure du Projet

```
ai-foundations/
├── apps/
│   ├── frontend/          # Application React (Vite + React 18)
│   │   ├── public/        # Fichiers statiques
│   │   ├── src/           # Code source de l'application
│   │   └── package.json   # Dépendances frontend
│   └── backend/           # Configuration Supabase et logique métier
│       ├── supabase/      # Configuration Supabase
│       │   ├── migrations/ # Migrations de la base de données
│       │   └── functions/  # Fonctions PostgreSQL personnalisées
│       └── package.json   # Scripts et dépendances backend
├── nginx/                 # Configuration Nginx (pour la production)
├── docker-compose.yml     # Configuration Docker Compose pour le développement
├── Dockerfile             # Définition des images Docker
└── .env.example           # Modèle de configuration d'environnement
```

## 🔒 Sécurité

### Variables d'Environnement

Les variables sensibles sont gérées via des fichiers `.env` qui ne doivent JAMAIS être commités dans Git. Le fichier `.env.example` fournit un modèle des variables nécessaires.

### Bonnes Pratiques de Sécurité

- Tous les conteneurs s'exécutent avec des utilisateurs non-privilégiés
- Isolation des réseaux Docker pour limiter l'exposition
- Healthchecks pour surveiller l'état des services
- Mise à jour régulière des dépendances
- Validation des entrées utilisateur côté serveur
- Protection contre les attaques CSRF et XSS

## 🛠 Dépannage

### Problèmes Courants

1. **Erreurs de connexion à Supabase**
   - Vérifiez que les variables d'environnement sont correctement définies
   - Vérifiez que le service Supabase est en cours d'exécution : `docker-compose ps`
   - Consultez les logs : `docker-compose logs supabase`

2. **Problèmes de permissions**
   ```bash
   # Sur Linux/Mac
   sudo chown -R $USER:$USER .
   
   # Sur Windows (PowerShell en tant qu'administrateur)
   icacls . /grant "%USERNAME%":(OI)(CI)F /T
   ```

3. **Nettoyer l'environnement**
   ```bash
   # Arrêter et supprimer les conteneurs
   docker-compose down -v
   
   # Nettoyer les ressources inutilisées
   docker system prune -f
   
   # Réinstaller les dépendances
   docker-compose run --rm frontend pnpm install
   ```

4. **Problèmes de ports**
   ```bash
   # Vérifier les ports utilisés
   netstat -tuln | grep LISTEN  # Linux/Mac
   netstat -ano | findstr LISTEN  # Windows
   ```

## 📚 Documentation Supplémentaire

- [Guide du Développeur](README-DEV.md) - Instructions détaillées pour le développement local
- [Documentation Supabase](https://supabase.com/docs) - Documentation officielle de Supabase
- [Documentation Docker](https://docs.docker.com/) - Guide d'utilisation de Docker
- [Documentation React](https://reactjs.org/) - Documentation officielle de React

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🛠 Configuration Avancée

### Migrations de Base de Données

Pour gérer les migrations de la base de données, utilisez les commandes suivantes :

```bash
# Appliquer les migrations
docker-compose exec backend pnpm migrate

# Créer une nouvelle migration (après avoir modifié le schéma)
docker-compose exec backend pnpm migrate:create nom_de_la_migration
```

### Variables d'Environnement

Créez un fichier `.env` à partir du modèle :

```bash
cp .env.example .env
```

Variables essentielles à configurer :

```env
# Configuration Supabase
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase

# Configuration de l'application
VITE_APP_NAME="AI Foundations"
VITE_APP_ENV=development
VITE_APP_VERSION=0.1.0
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Développement avec Hot-Reload

Le frontend est configuré pour le hot-reload automatique. Modifiez simplement les fichiers dans le dossier `apps/frontend/src` et les changements seront rechargés automatiquement dans le navigateur.

### Accès à la Base de Données

1. **Via pgAdmin** : http://localhost:5050
   - Email: admin@example.com
   - Mot de passe: admin
   - Créez une nouvelle connexion avec les identifiants de Supabase

2. **En Ligne de Commande** :
   ```bash
   docker-compose exec db psql -U postgres
   ```

## 🤝 Contribution

1. Créez une branche pour votre fonctionnalité :
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```

2. Committez vos modifications :
   ```bash
   git add .
   git commit -m "feat: ajouter nouvelle fonctionnalité"
   ```

3. Poussez vos changements :
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```

4. Créez une Pull Request sur GitHub
## 📚 Documentation supplémentaire

- [Guide du Développeur](README-DEV.md) - Documentation complète pour les développeurs
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation React](https://reactjs.org/)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
