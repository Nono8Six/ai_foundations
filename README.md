# IA Foundations

Une plateforme complète pour les cours sur les Fondations de l'IA, construite avec React et Supabase, conteneurisée avec Docker pour un déploiement facile.

## 🚀 Démarrage Rapide avec Docker

### Prérequis

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Git](https://git-scm.com/)
- Compte [Supabase](https://supabase.com/)

### Configuration initiale

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/ai_foundations_lms.git
   cd ai_foundations_lms
   ```

2. **Configurer les variables d'environnement**
   - Copier le fichier `.env.example` en `.env.development` pour le développement
   - Remplir les variables requises (notamment les clés Supabase)
   ```bash
   cp .env.example .env.devironnement
   ```

3. **Démarrer l'environnement de développement**
   ```bash
   docker-compose up app-dev
   ```
   L'application sera disponible sur http://localhost:3000

## 🛠 Commandes Docker utiles

| Commande | Description |
|----------|-------------|
| `docker-compose up -d app-dev` | Démarrer en mode développement avec hot-reload |
| `docker-compose up --build` | Reconstruire et démarrer les conteneurs |
| `docker-compose down` | Arrêter les conteneurs |
| `docker-compose logs -f` | Voir les logs en temps réel |
| `docker-compose exec app sh` | Se connecter au conteneur de l'application |

## 🏗 Déploiement en production

1. Créer un fichier `.env.production` à partir de `.env.example`
2. Construire l'image de production :
   ```bash
   docker-compose -f docker-compose.yml build app-prod
   ```
3. Démarrer les services en production :
   ```bash
   docker-compose up -d app-prod
   ```

## 🔍 Vérification de l'environnement

Un script est fourni pour vérifier que toutes les variables d'environnement requises sont définies :

```bash
# Rendre le script exécutable (Linux/Mac)
chmod +x scripts/check-env.sh

# Vérifier les variables d'environnement
./scripts/check-env.sh
```

## 🔧 Configuration avancée

### Variables d'environnement

Copiez `.env.example` vers `.env.development` (développement) et/ou `.env.production` (production) et configurez les valeurs appropriées :

- `VITE_SUPABASE_URL` : URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase
- `VITE_APP_NAME` : Nom de l'application
- `VITE_APP_ENV` : Environnement (development/production)
- `VITE_DEBUG` : Activer/désactiver le mode debug

### Configuration de la base de données

1. **Installer Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Se connecter à Supabase**
   ```bash
   supabase login
   ```

3. **Lier votre projet**
   ```bash
   supabase link --project-ref votre-reference-projet
   ```

4. **Appliquer les migrations**
   ```bash
   supabase db push
   ```

### Volumes Docker

- Le code source est monté en volume pour le développement
- Les dépendances node_modules sont préservées dans un volume séparé
- Les logs sont redirigés vers la sortie standard

## 🔒 Sécurité

- Tous les conteneurs s'exécutent en tant qu'utilisateur non-root
- Les secrets ne sont jamais inclus dans l'image Docker
- Configuration de sécurité renforcée pour Nginx en production
- Headers de sécurité HTTP activés

## 📦 Structure du projet

```
.
├── Dockerfile              # Configuration Docker pour la production
├── docker-compose.yml      # Configuration des services Docker
├── nginx/                 # Configuration Nginx pour la production
│   └── nginx.conf
├── scripts/               # Scripts utilitaires
│   └── check-env.sh
├── public/                # Fichiers statiques
├── src/                   # Code source de l'application
└── .env.example           # Exemple de configuration d'environnement
```

## 🔄 Mise à jour

Pour mettre à jour l'application :

1. Mettre à jour le code source
2. Reconstruire les images :
   ```bash
   docker-compose build
   ```
3. Redémarrer les conteneurs :
   ```bash
   docker-compose up -d
   ```

## 🐛 Dépannage

### Erreur "relation 'public.courses' does not exist"

Cette erreur se produit lorsque les migrations de base de données n'ont pas été appliquées :

1. Vérifiez que la CLI Supabase est installée et que vous êtes connecté
2. Liez votre projet : `supabase link --project-ref votre-reference-projet`
3. Appliquez les migrations : `supabase db push`
4. Vérifiez que les tables existent dans le tableau de bord Supabase

### Variables d'environnement introuvables

Assurez-vous que votre fichier `.env.development` ou `.env.production` contient :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

## 📚 Documentation supplémentaire

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation React](https://reactjs.org/)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.