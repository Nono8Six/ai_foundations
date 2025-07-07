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

### 🔗 API Endpoints

- `POST /planner` - créé ou termine une session d'apprentissage.
- `POST /analytics` - enregistre la durée d'une session terminée.

## 🚀 Démarrage Rapide (Quick Start)

Suivez ces étapes pour lancer l'environnement de développement :

1.  **Prérequis :**
    - [Node.js](https://nodejs.org/) (>= 20.x.x)
    - [pnpm](https://pnpm.io/installation) (>= 9.x.x), géré via [corepack](https://nodejs.org/api/corepack.html). La version exacte est définie dans `package.json` (`packageManager`).
    - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (dernière version stable) pour lancer le frontend conteneurisé.
    - [Git](https://git-scm.com/)
    - Un compte [Supabase](https://supabase.com/) pour votre projet Cloud.

2.  **Cloner le dépôt :**

    ```bash
    git clone https://github.com/Nono8Six/ai_foundations.git # Adaptez avec l'URL de votre dépôt
    cd ai_foundations
    ```

3.  **Activer pnpm via corepack (une seule fois par environnement ou projet) :**

    ```bash
    corepack enable
    # pnpm sera installé à la version spécifiée dans package.json (packageManager)
    # Si vous souhaitez forcer une version spécifique globalement (ex: pnpm 9.x.x) :
    # corepack prepare pnpm@9.x.x --activate
    ```

4.  **Installer les dépendances :**

    ```bash
    pnpm install
    ```

    _(Cela exécutera aussi `husky install` grâce au script `prepare`)_

5.  **Configurer les variables d'environnement :**
    - Copiez le fichier d'exemple :
      ```bash
      cp .env.example .env
      ```
    - Éditez `.env` et remplissez **impérativement** les variables suivantes avec les informations de **votre projet Supabase Cloud** :
      - `VITE_SUPABASE_URL`: L'URL de votre projet Supabase Cloud (ex: `https://<votre-ref>.supabase.co`).
      - `VITE_SUPABASE_ANON_KEY`: La clé anonyme (publique) de votre projet Supabase Cloud.
      - `SUPABASE_ACCESS_TOKEN`: Votre token d'accès personnel Supabase (généré depuis `app.supabase.com/account/tokens`).
      - `SUPABASE_PROJECT_REF`: La référence de votre projet Supabase Cloud (ex: `<votre-ref>`).
    - Validez votre configuration :
      ```bash
      pnpm validate:env
      ```

6.  **Lier le projet local à Supabase Cloud (une seule fois par clone du projet) :**
    - Assurez-vous d'être connecté à la CLI Supabase. Si c'est la première fois, exécutez :
      ```bash
      pnpm --filter backend exec supabase login
      ```
    - Ensuite, pour lier le projet (la CLI devrait lire `SUPABASE_PROJECT_REF` depuis `.env`):
      ```bash
      pnpm --filter backend exec supabase link
      ```
    - Alternativement, spécifiez le project-ref explicitement :
      ```bash
      # pnpm --filter backend exec supabase link --project-ref <votre_project_ref_ici>
      ```
    - _Cette commande stocke des informations de liaison dans `apps/backend/supabase/.temp` (qui est ignoré par Git)._

7.  **Démarrer l'instance Supabase locale (optionnel, pour tests ou exploration hors ligne) :**
    - Cette instance est distincte de votre Supabase Cloud. Elle utilisera les migrations locales (qui devraient être le reflet du cloud après un `pnpm db:pull`).

    ```bash
    pnpm db:start
    ```

    - Accès à Supabase Studio local : `http://localhost:54323` (par défaut).
    - Pour arrêter : `pnpm db:stop`.

8.  **Démarrer le service frontend :**
    - **Option A : Avec Docker Compose (recommandé)**

      ```bash
      # Lancement standard connecté à Supabase Cloud
      docker compose up --build

      # OU pour inclure également une instance Supabase locale
      docker compose --profile supabase-local up --build
      ```

    - **Option B : Localement sans Docker (pour le frontend)**
      ```bash
      pnpm dev:frontend
      ```

9.  **Accéder à l'application Frontend :**
    - `http://localhost:5173` (hot reload activé).

## 🛠 Commandes PNPM Utiles (depuis la racine)

| Commande                            | Description                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pnpm install`                      | Installe toutes les dépendances du monorepo.                                                                |
| `pnpm dev`                          | Lance le frontend en mode développement.                                                                    |
| `pnpm dev:frontend`                 | Lance uniquement le serveur de développement du frontend.                                                   |
| `pnpm build`                        | Construit l'application frontend pour la production.                                                        |
| `pnpm lint`                         | Exécute ESLint sur tout le projet pour vérifier la qualité du code.                                         |
| `pnpm test`                         | Lance les tests (avec Vitest).                                                                              |
| `pnpm typecheck`                    | Vérifie les types TypeScript pour l'ensemble du projet.                                                     |
| `pnpm validate:env`                 | Vérifie que les variables d'environnement requises sont présentes dans `.env`.                              |
| **Supabase (Cloud-First Workflow)** |                                                                                                             |
| `pnpm db:pull`                      | Récupère le schéma de la base de données Supabase Cloud et génère les fichiers de migration locaux.         |
| `pnpm gen:types`                    | Génère les types TypeScript à partir du schéma de la base de données Supabase (à utiliser après `db:pull`). |
| **Supabase (Instance Locale)**      |                                                                                                             |
| `pnpm db:start`                     | Démarre l'instance Supabase locale (conteneurs Docker gérés par la CLI Supabase).                           |
| `pnpm db:stop`                      | Arrête l'instance Supabase locale.                                                                          |

_Pour plus de détails sur le workflow Supabase, consultez `docs/guides/supabase-workflow.md`._

## 🚀 Mode Production

Pour construire et lancer l'image de production du frontend :

1.  Assurez-vous que votre fichier `.env` contient les variables de production pour `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (ou que votre environnement de déploiement les fournira).
2.  Construire l'image de production :
    ```bash
    docker build --target production -t ai-foundations-frontend:latest .
    ```
3.  Lancer l'image (exemple) :
    ```bash
    docker run -d -p 8080:80 --env-file .env ai-foundations-frontend:latest
    ```
    _(Adaptez le port et la gestion des variables d'environnement selon votre plateforme de déploiement.)_

## 🐳 Commandes Docker Compose Utiles

| Commande                                        | Description                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| `docker compose up -d`                          | Démarre le frontend (et l'API si configurée).                              |
| `docker compose --profile supabase-local up -d` | Lance aussi l'instance Supabase locale.                                    |
| `docker compose down`                           | Arrête et supprime les conteneurs définis dans `docker-compose.yml`.       |
| `docker compose down -v`                        | Idem + supprime les volumes anonymes associés.                             |
| `docker compose logs -f frontend`               | Affiche les logs en temps réel du service frontend.                        |
| `docker compose ps`                             | Liste les conteneurs actifs gérés par Docker Compose.                      |
| `docker compose exec frontend sh`               | Ouvre un shell dans le conteneur du service frontend en cours d'exécution. |

### Scripts Utilitaires (`scripts/`)

- `scripts/cleanup.sh`: Nettoie l'environnement de développement (node_modules, conteneurs Docker Compose).
- `scripts/recovery.sh`: Tente une récupération de base de l'environnement.

```bash
docker build --target production -t ai-foundations:prod .
```

Les variables requises sont lues depuis le même fichier `.env`.\*
_(Adaptez le port et la gestion des variables d'environnement selon votre plateforme de déploiement.)_

## 🐳 Commandes Docker Compose Utiles

| Commande                                        | Description                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| `docker compose up -d`                          | Démarre le frontend (et l'API si configurée).                              |
| `docker compose --profile supabase-local up -d` | Lance aussi l'instance Supabase locale.                                    |
| `docker compose down`                           | Arrête et supprime les conteneurs définis dans `docker-compose.yml`.       |
| `docker compose down -v`                        | Idem + supprime les volumes anonymes associés.                             |
| `docker compose logs -f frontend`               | Affiche les logs en temps réel du service frontend.                        |
| `docker compose ps`                             | Liste les conteneurs actifs gérés par Docker Compose.                      |
| `docker compose exec frontend sh`               | Ouvre un shell dans le conteneur du service frontend en cours d'exécution. |

### Scripts Utilitaires (`scripts/`)

- `scripts/cleanup.sh`: Nettoie l'environnement de développement (node_modules, conteneurs Docker Compose).
- `scripts/recovery.sh`: Tente une récupération de base de l'environnement.

## 🏗 Structure du Projet (Simplifiée)

```
.
├── apps/
│   ├── frontend/          # Application React (Vite)
│   └── backend/           # Configuration Supabase
│       ├── supabase/      # Config Supabase locale (migrations, seeds)
│       │   ├── migrations/ # Générées par `pnpm db:pull`
│       │   └── seeds.sql   # Données initiales pour `supabase db reset` (local)
├── docker-compose.yml     # Pour les services applicatifs (frontend et outils divers)
├── Dockerfile             # Dockerfile multi-stage pour le frontend
├── .env.example           # Modèle pour les variables d'environnement
├── package.json           # Scripts PNPM racine, dépendances du workspace
└── docs/
    └── guides/
        └── supabase-workflow.md # Guide détaillé du workflow Supabase
```

## 🔒 Sécurité

### Variables d'Environnement

Les variables sensibles (clés API, tokens) sont gérées via un fichier `.env` qui **ne doit JAMAIS être commité sur Git**. Le fichier `.env.example` sert de modèle.

### Bonnes Pratiques de Sécurité Docker

- Les images finales de production utilisent des utilisateurs non-privilégiés (ex: `nginx` pour le frontend).
- Les Healthchecks sont configurés pour surveiller l'état des services conteneurisés.

## 🛠 Dépannage

### Problèmes Courants

1.  **Erreurs de connexion à Supabase (Cloud) :**
    - Vérifiez que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env` sont correctes et correspondent à votre projet Supabase Cloud.
    - Exécutez `pnpm validate:env`.
2.  **Problèmes avec l'instance Supabase locale (`pnpm db:start`) :**
    - Consultez les logs de la CLI Supabase : `pnpm --filter backend exec supabase status` (pour voir les services actifs) et les logs Docker des conteneurs Supabase (ex: `docker logs supabase-db-<project_ref>`).
    - Essayez `pnpm db:stop && pnpm db:start`.
    - En dernier recours : `pnpm --filter backend exec supabase db reset` (attention, cela supprime les données de votre base locale).
3.  **Problèmes de permissions (rares avec Docker Desktop moderne) :**
    - Assurez-vous que Docker Desktop a les permissions nécessaires pour accéder aux fichiers du projet.
4.  **Nettoyer l'environnement Docker Compose :**
    ```bash
    docker compose down -v # Arrête et supprime les conteneurs et volumes anonymes
    # Pour un nettoyage plus global (attention, cela affecte tout Docker) :
    # docker system prune -af
    ```

## 📚 Documentation Supplémentaire

- [Guide du Workflow Supabase](docs/guides/supabase-workflow.md) - **À LIRE ABSOLUMENT** pour comprendre comment gérer le schéma de la base de données.
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation pnpm](https://pnpm.io/)
- [Documentation Vite](https://vitejs.dev/)
- [Style Guide](docs/STYLE_GUIDE.md) (si pertinent)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre les conventions de commit (voir configuration de `commitlint` et les hooks Husky) et vous assurer que les hooks pre-commit passent.

---

_Ce README a été mis à jour pour refléter la nouvelle configuration du projet._
