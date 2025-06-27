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

## 🚀 Démarrage Rapide (Quick Start)

Suivez ces étapes pour lancer l'environnement de développement :

1.  **Prérequis :**
    *   [Node.js](https://nodejs.org/) (>= 20.x.x)
    *   [pnpm](https://pnpm.io/installation) (>= 9.x.x), géré via [corepack](https://nodejs.org/api/corepack.html). La version exacte est définie dans `package.json` (`packageManager`).
    *   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (dernière version stable) pour lancer le frontend conteneurisé et optionnellement le backend API.
    *   [Git](https://git-scm.com/)
    *   Un compte [Supabase](https://supabase.com/) pour votre projet Cloud.

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
    *(Cela exécutera aussi `husky install` grâce au script `prepare`)*

5.  **Configurer les variables d'environnement :**
    *   Copiez le fichier d'exemple :
        ```bash
        cp .env.example .env
        ```
    *   Éditez `.env` et remplissez **impérativement** les variables suivantes avec les informations de **votre projet Supabase Cloud** :
        *   `VITE_SUPABASE_URL`: L'URL de votre projet Supabase Cloud (ex: `https://<votre-ref>.supabase.co`).
        *   `VITE_SUPABASE_ANON_KEY`: La clé anonyme (publique) de votre projet Supabase Cloud.
        *   `SUPABASE_ACCESS_TOKEN`: Votre token d'accès personnel Supabase (généré depuis `app.supabase.com/account/tokens`).
        *   `SUPABASE_PROJECT_REF`: La référence de votre projet Supabase Cloud (ex: `<votre-ref>`).
    *   Validez votre configuration :
        ```bash
        pnpm validate:env
        ```

6.  **Lier le projet local à Supabase Cloud (une seule fois par clone du projet) :**
    *   Assurez-vous d'être connecté à la CLI Supabase. Si c'est la première fois, exécutez :
        ```bash
        pnpm --filter backend exec supabase login
        ```
    *   Ensuite, pour lier le projet (la CLI devrait lire `SUPABASE_PROJECT_REF` depuis `.env`):
        ```bash
        pnpm --filter backend exec supabase link
        ```
    *   Alternativement, spécifiez le project-ref explicitement :
        ```bash
        # pnpm --filter backend exec supabase link --project-ref <votre_project_ref_ici>
        ```
    *   *Cette commande stocke des informations de liaison dans `apps/backend/supabase/.temp` (qui est ignoré par Git).*

7.  **Démarrer l'instance Supabase locale (optionnel, pour tests ou exploration hors ligne) :**
    *   Cette instance est distincte de votre Supabase Cloud. Elle utilisera les migrations locales (qui devraient être le reflet du cloud après un `pnpm db:pull`).
    ```bash
    pnpm db:start
    ```
    *   Accès à Supabase Studio local : `http://localhost:54323` (par défaut).
    *   Pour arrêter : `pnpm db:stop`.

8.  **Démarrer les services applicatifs (Frontend et API Backend si activée) :**
    *   **Option A : Avec Docker Compose (Recommandé pour un environnement isolé)**
        ```bash
        # Pour démarrer uniquement le frontend (se connecte au Supabase Cloud défini dans .env)
        docker-compose up --build -d frontend

        # OU pour démarrer le frontend ET l'API backend Node.js (si vous l'utilisez)
        # docker-compose --profile api up --build -d frontend backend-api
        ```
    *   **Option B : Localement sans Docker (pour le frontend)**
        ```bash
        pnpm dev:frontend
        ```
        *(Le backend API, s'il est utilisé, devrait aussi avoir un script `pnpm dev:backend` pour un lancement local direct).*

9.  **Accéder à l'application Frontend :**
    *   `http://localhost:3000` (si lancé via Docker ou `pnpm dev:frontend`).

## 🛠 Commandes PNPM Utiles (depuis la racine)

| Commande                         | Description                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `pnpm install`                   | Installe toutes les dépendances du monorepo.                                                               |
| `pnpm dev`                       | Lance le frontend et le backend API (si configuré) en mode développement.                                    |
| `pnpm dev:frontend`              | Lance uniquement le serveur de développement du frontend.                                                      |
| `pnpm dev:backend`               | Lance uniquement le serveur de développement du backend API (si `apps/backend/src` est utilisé).             |
| `pnpm build`                     | Construit l'application frontend pour la production.                                                       |
| `pnpm lint`                      | Exécute ESLint sur tout le projet pour vérifier la qualité du code.                                          |
| `pnpm test`                      | Lance les tests (avec Vitest).                                                                             |
| `pnpm typecheck`                 | Vérifie les types TypeScript pour l'ensemble du projet.                                                    |
| `pnpm validate:env`              | Vérifie que les variables d'environnement requises sont présentes dans `.env`.                               |
| **Supabase (Cloud-First Workflow)** |                                                                                                            |
| `pnpm db:pull`                   | Récupère le schéma de la base de données Supabase Cloud et génère les fichiers de migration locaux.          |
| `pnpm gen:types`                 | Génère les types TypeScript à partir du schéma de la base de données Supabase (à utiliser après `db:pull`). |
| **Supabase (Instance Locale)**     |                                                                                                            |
| `pnpm db:start`                  | Démarre l'instance Supabase locale (conteneurs Docker gérés par la CLI Supabase).                          |
| `pnpm db:stop`                   | Arrête l'instance Supabase locale.                                                                         |

*Pour plus de détails sur le workflow Supabase, consultez `docs/guides/supabase-workflow.md`.*

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
    *(Adaptez le port et la gestion des variables d'environnement selon votre plateforme de déploiement.)*

## 🐳 Commandes Docker Compose Utiles

| Commande                                       | Description                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `docker-compose up -d frontend`                | Démarre le service frontend en arrière-plan.                                |
| `docker-compose --profile api up -d backend-api` | Démarre le service backend API (si le profil `api` est utilisé).            |
| `docker-compose down`                          | Arrête et supprime les conteneurs définis dans `docker-compose.yml`.        |
| `docker-compose down -v`                       | Idem + supprime les volumes anonymes associés.                              |
| `docker-compose logs -f frontend`              | Affiche les logs en temps réel du service frontend.                         |
| `docker-compose ps`                            | Liste les conteneurs actifs gérés par Docker Compose.                       |
| `docker-compose exec frontend sh`              | Ouvre un shell dans le conteneur du service frontend en cours d'exécution.    |

### Scripts Utilitaires (`scripts/`)

-   `scripts/validateEnv.js`: Vérifie la présence des variables d'environnement nécessaires.
-   `scripts/cleanup.sh`: Nettoie l'environnement de développement (node_modules, conteneurs Docker Compose).
-   `scripts/recovery.sh`: Tente une récupération de base de l'environnement.

```bash
docker build --target production -t ai-foundations:prod .
```

Les variables requises sont lues depuis le même fichier `.env`.*
*(Adaptez le port et la gestion des variables d'environnement selon votre plateforme de déploiement.)*

## 🐳 Commandes Docker Compose Utiles

| Commande                                       | Description                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `docker-compose up -d frontend`                | Démarre le service frontend en arrière-plan.                                |
| `docker-compose --profile api up -d backend-api` | Démarre le service backend API (si le profil `api` est utilisé).            |
| `docker-compose down`                          | Arrête et supprime les conteneurs définis dans `docker-compose.yml`.        |
| `docker-compose down -v`                       | Idem + supprime les volumes anonymes associés.                              |
| `docker-compose logs -f frontend`              | Affiche les logs en temps réel du service frontend.                         |
| `docker-compose ps`                            | Liste les conteneurs actifs gérés par Docker Compose.                       |
| `docker-compose exec frontend sh`              | Ouvre un shell dans le conteneur du service frontend en cours d'exécution.    |

### Scripts Utilitaires (`scripts/`)

-   `scripts/validateEnv.js`: Vérifie la présence des variables d'environnement nécessaires.
-   `scripts/cleanup.sh`: Nettoie l'environnement de développement (node_modules, conteneurs Docker Compose).
-   `scripts/recovery.sh`: Tente une récupération de base de l'environnement.

## 🏗 Structure du Projet (Simplifiée)
```
.
├── apps/
│   ├── frontend/          # Application React (Vite)
│   └── backend/           # Configuration Supabase, API Node.js optionnelle
│       ├── supabase/      # Config Supabase locale (migrations, seeds)
│       │   ├── migrations/ # Générées par `pnpm db:pull`
│       │   └── seeds.sql   # Données initiales pour `supabase db reset` (local)
│       └── src/           # Code source de l'API Node.js (si utilisée)
├── docker-compose.yml     # Pour les services applicatifs (frontend, backend-api)
├── Dockerfile             # Dockerfile multi-stage pour le frontend
├── .env.example           # Modèle pour les variables d'environnement
├── package.json           # Scripts PNPM racine, dépendances du workspace
└── docs/
    └── guides/
        └── supabase-workflow.md # Guide détaillé du workflow Supabase
```

### État du Développement Backend API (Node.js)

Le dossier `apps/backend/src/` peut contenir une API Node.js personnalisée (par exemple, avec Express). Son lancement est optionnel et géré par le profil `api` dans `docker-compose.yml`. Si ce dossier est vide ou si l'API n'est pas nécessaire, vous pouvez omettre le profil `api` lors du lancement de Docker Compose.

## 🔒 Sécurité

### Variables d'Environnement

Les variables sensibles (clés API, tokens) sont gérées via un fichier `.env` qui **ne doit JAMAIS être commité sur Git**. Le fichier `.env.example` sert de modèle.

### Bonnes Pratiques de Sécurité Docker

-   Les images finales de production utilisent des utilisateurs non-privilégiés (ex: `nginx` pour le frontend, `node` pour le backend API).
-   Les Healthchecks sont configurés pour surveiller l'état des services conteneurisés.

## 🛠 Dépannage

### Problèmes Courants

1.  **Erreurs de connexion à Supabase (Cloud) :**
    *   Vérifiez que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env` sont correctes et correspondent à votre projet Supabase Cloud.
    *   Exécutez `pnpm validate:env`.
2.  **Problèmes avec l'instance Supabase locale (`pnpm db:start`) :**
    *   Consultez les logs de la CLI Supabase : `pnpm --filter backend exec supabase status` (pour voir les services actifs) et les logs Docker des conteneurs Supabase (ex: `docker logs supabase-db-<project_ref>`).
    *   Essayez `pnpm db:stop && pnpm db:start`.
    *   En dernier recours : `pnpm --filter backend exec supabase db reset` (attention, cela supprime les données de votre base locale).
3.  **Problèmes de permissions (rares avec Docker Desktop moderne) :**
    *   Assurez-vous que Docker Desktop a les permissions nécessaires pour accéder aux fichiers du projet.
4.  **Nettoyer l'environnement Docker Compose :**
    ```bash
    docker-compose down -v # Arrête et supprime les conteneurs et volumes anonymes
    # Pour un nettoyage plus global (attention, cela affecte tout Docker) :
    # docker system prune -af
    ```

## 📚 Documentation Supplémentaire

-   [Guide du Workflow Supabase](docs/guides/supabase-workflow.md) - **À LIRE ABSOLUMENT** pour comprendre comment gérer le schéma de la base de données.
-   [Documentation Supabase](https://supabase.com/docs)
-   [Documentation Docker](https://docs.docker.com/)
-   [Documentation pnpm](https://pnpm.io/)
-   [Documentation Vite](https://vitejs.dev/)
-   [Style Guide](docs/STYLE_GUIDE.md) (si pertinent)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre les conventions de commit (voir configuration de `commitlint` et les hooks Husky) et vous assurer que les hooks pre-commit passent.

---
*Ce README a été mis à jour pour refléter la nouvelle configuration du projet.*
