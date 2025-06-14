# IA Foundations

Une plateforme complète pour les cours sur les Fondations de l'IA, construite avec React, Vite, Tailwind CSS et Supabase, conteneurisée avec Docker pour un déploiement facile.

## 🚀 Fonctionnalités

- Application React moderne avec Vite 6.3.5
- Mise en page réactive avec Tailwind CSS
- Authentification et base de données avec Supabase
- Conteneurisation Docker avec support du hot-reload
- Configuration optimisée pour le développement et la production

## 🚀 Démarrage Rapide avec Docker

### Prérequis

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Git](https://git-scm.com/)
- Compte [Supabase](https://supabase.com/)

### Configuration initiale

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**
   - Copier le fichier `.env.example` en `.env`
   - Remplir les variables nécessaires (notamment Supabase)
   ```bash
   cp .env.example .env
   ```

3. **Vérifier la configuration**
   ```bash
   ./scripts/check-env.sh
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

## 🛠 Commandes Docker utiles

| Commande | Description |
|----------|-------------|
| `docker-compose up -d app-dev` | Démarrer en mode développement avec hot-reload |
| `docker-compose down` | Arrêter les conteneurs |
| `docker-compose build --no-cache` | Reconstruire l'image sans utiliser le cache |
| `docker-compose logs -f app-dev` | Voir les logs en temps réel |
| `docker-compose exec app-dev sh` | Se connecter au conteneur de l'application |
| `docker-compose exec app-dev npm audit` | Vérifier les vulnérabilités |
| `docker-compose exec app-dev npm audit fix` | Corriger les vulnérabilités |

## 🏗 Déploiement en production

1. **Configurer l'environnement de production**
   - Créer un fichier `.env` à partir de `.env.example`
   - Mettre à jour les variables pour la production

2. **Construire l'image de production**
   ```bash
   docker-compose -f docker-compose.yml build app-prod
   ```

3. **Démarrer les services en production**
   ```bash
   docker-compose up -d app-prod
   ```
   L'application sera disponible sur le port 80

4. **Mettre à jour l'application**
   ```bash
   # Arrêter les conteneurs
   docker-compose down
   
   # Récupérer les dernières modifications
   git pull
   
   # Reconstruire et redémarrer
   docker-compose build --no-cache
   docker-compose up -d app-prod
   ```

## 🔍 Vérification de l'environnement

Un script est fourni pour vérifier que toutes les variables d'environnement requises sont définies :

```bash
# Rendre le script exécutable si nécessaire
chmod +x scripts/check-env.sh

# Lancer la vérification
./scripts/check-env.sh
```

## 🛠️ Supabase CLI et migrations

Pour utiliser les migrations fournies dans `supabase/migrations`, installez la
CLI Supabase puis liez ce dépôt à votre projet :

```bash
npm install -g supabase   # ou brew install supabase/tap/supabase
supabase login            # connexion à votre compte Supabase
supabase link --project-ref <votre-reference-projet>
```

Une fois le projet lié, appliquez toutes les migrations :

```bash
supabase db push
# ou
pnpm migrate
# qui exécute `./scripts/migrate.sh`
```

Les variables d'environnement nécessaires au fonctionnement local sont définies
dans `.env`. Copiez le fichier exemple puis renseignez au minimum `VITE_SUPABASE_URL`
et `VITE_SUPABASE_ANON_KEY`.
Vous pouvez vérifier leur présence avec le script
`./scripts/check-env.sh`.

## 🔧 Configuration avancée

### Variables d'environnement

Toutes les variables d'environnement sont configurées dans le fichier `.env` :

- `VITE_SUPABASE_URL` : URL de votre instance Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé anonyme de votre instance Supabase
- `VITE_APP_ENV` : Environnement (development/production, défaut: "development")
- `VITE_APP_NAME` : Nom de l'application
- `VITE_APP_VERSION` : Version de l'application
- `VITE_DEBUG` : Activer le mode debug (true/false)
- `VITE_LOG_LEVEL` : Niveau de log (debug/info/warn/error)

### Variables d'environnement requises

L'application ne démarre pas si les variables suivantes sont absentes :

```env
VITE_SUPABASE_URL=<votre_url_supabase>
VITE_SUPABASE_ANON_KEY=<votre_cle_anon_supabase>
```

### Variables d'environnement manquantes

Assurez-vous que votre fichier `.env` contient les variables requises :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
VITE_APP_NAME="Votre Application"
VITE_APP_ENV=development
VITE_APP_VERSION=0.1.0
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

## 🔒 Sécurité

- Tous les conteneurs s'exécutent en tant qu'utilisateur non-root
- Les secrets ne sont jamais inclus dans l'image Docker
- Configuration de sécurité renforcée pour Nginx en production
- Headers de sécurité HTTP activés

### Politiques RLS

Toutes les tables sensibles utilisent la Row Level Security. La liste complète des politiques se trouve dans [`docs/rls_policies.md`](docs/rls_policies.md). En résumé :

- `profiles` : chaque utilisateur peut lire et modifier uniquement son profil, tandis que les administrateurs peuvent gérer tous les profils.
- `user_settings` : lecture et mise à jour limitées à l'utilisateur connecté.
- `courses`, `modules` et `lessons` : consultation publique des éléments publiés, gestion réservée aux administrateurs.
- `rgpd_requests` : chaque utilisateur gère ses propres requêtes RGPD, les administrateurs ont un accès complet.

## 📦 Structure du projet

```
.
├── Dockerfile              # Configuration Docker pour la production
├── docker-compose.yml      # Configuration des services Docker
├── nginx/                 # Configuration Nginx pour la production
│   └── nginx.conf
├── scripts/               # Scripts utilitaires
│   ├── check-env.sh
│   └── migrate.sh
├── public/                # Fichiers statiques
├── src/                   # Code source de l'application
└── .env.example           # Exemple de configuration d'environnement
```

## 🤖 Intégration Continue

Un workflow GitHub Actions situé dans `.github/workflows/nodeci.yml` vérifie le projet à chaque `push` :

1. `npm install`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Le workflow échoue automatiquement si l'une de ces étapes rencontre une erreur.

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
3. Appliquez la migration consolidée : `supabase db push` (ou `pnpm migrate`)
4. Vérifiez que les tables existent dans le tableau de bord Supabase

### Colonne `thumbnail_url` manquante

Si l'attribut `thumbnail_url` n'apparaît pas dans la table `courses` de votre
base locale ou distante :

1. Assurez-vous d'être connecté et que votre projet est lié avec
   `supabase link --project-ref <votre-reference-projet>`
2. Rejouez toutes les migrations :
   ```bash
   supabase db push
   # ou pnpm migrate
   ```
3. Vérifiez ensuite dans le tableau de bord que la colonne est bien créée


## 📚 Documentation supplémentaire

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation React](https://reactjs.org/)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails
