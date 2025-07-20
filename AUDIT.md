# Audit Détaillé du Dépôt `ai_foundations_lms`

Ce document présente un audit complet et minutieux du dépôt `ai_foundations_lms`, couvrant sa structure, sa stack technologique, ses conventions de développement et son organisation. L'objectif est de fournir une compréhension chirurgicale du projet.

## 1. Vue d'Ensemble du Projet

Le dépôt `ai_foundations_lms` semble être une application full-stack, probablement un système de gestion de l'apprentissage (LMS) ou une plateforme éducative, avec un frontend basé sur React/Vite et un backend utilisant Supabase pour la base de données et les fonctions Edge. Le projet est organisé en un monorepo géré par pnpm, ce qui permet une gestion efficace des dépendances et un partage de code entre les différentes applications et bibliothèques.

## 2. Stack Technologique

### Frontend
*   **Framework**: React (via Vite)
*   **Langage**: TypeScript
*   **Styling**: Tailwind CSS, PostCSS
*   **Routing**: React Router (implicite via `Routes.tsx` et `react-router-dom.d.ts`)
*   **Tests**: Vitest
*   **Build Tool**: Vite
*   **State Management**: Context API (via `AuthContext.tsx`, `CourseContext.tsx`, etc.)
*   **API Client**: Supabase JS client library (via `supabase.ts`, `supabaseClient.ts`)

### Backend / Services
*   **Base de Données**: Supabase (PostgreSQL)
*   **Fonctions Edge**: Deno (TypeScript)
*   **Authentification**: Supabase Auth
*   **Stockage**: Supabase Storage

### Outils et Conventions Communes
*   **Gestionnaire de Paquets**: pnpm (monorepo)
*   **Linter**: ESLint
*   **Formateur de Code**: Prettier
*   **Hooks Git**: Husky
*   **Pré-commit Hooks**: lint-staged
*   **Conventions de Commit**: commitlint
*   **TypeScript**: Configuration stricte pour l'ensemble du projet.

## 3. Structure du Répertoire (Arborescence)

```
C:/GitHub/ai_foundations_lms/
├── .gitattributes
├── .gitignore
├── .mcp.json
├── .npmrc
├── .pnpmrc
├── .prettierrc
├── CLAUDE.md
├── commitlint.config.js
├── DEVELOPER_GUIDE.md
├── eslint.config.js
├── LICENSE
├── lint-staged.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.json
├── .claude/
│   └── settings.local.json
├── .git/
├── .husky/
│   ├── commit-msg
│   ├── pre-commit
│   └── _/ (Husky internal files)
├── .pnpm-store/ (pnpm's content-addressable store)
├── .vscode/
│   └── extensions.json
├── apps/
│   ├── backend/
│   │   ├── eslint.config.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .vscode/
│   │   ├── node_modules/
│   │   └── supabase/
│   │       ├── .temp/
│   │       ├── backup/
│   │       ├── functions/
│   │       │   └── placeholder.ts
│   │       ├── migrations/
│   │       │   └── 20250719192903_remote_schema.sql
│   │       ├── .gitignore
│   │       └── config.toml
│   └── frontend/
│       ├── eslint_errors.log
│       ├── eslint_report.json
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.mjs
│       ├── vitest.config.ts
│       ├── dist/
│       ├── dist-types/
│       ├── nginx/
│       ├── node_modules/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── __tests__/
│       │   │   ├── layout/
│       │   │   ├── ui/
│       │   │   ├── AdminLayout.tsx
│       │   │   ├── AdminRoute.tsx
│       │   │   ├── AppIcon.tsx
│       │   │   ├── AppImage.tsx
│       │   │   ├── Avatar.tsx
│       │   │   ├── ErrorBoundary.tsx
│       │   │   ├── Header.tsx
│       │   │   ├── ProtectedRoute.tsx
│       │   │   ├── RootLayout.tsx
│       │   │   └── ScrollToTop.tsx
│       │   ├── context/
│       │   │   ├── __tests__/
│       │   │   ├── AdminCourseContext.tsx
│       │   │   ├── AuthContext.tsx
│       │   │   ├── AuthContextV2.tsx
│       │   │   ├── CourseContext.tsx
│       │   │   ├── createContextStrict.tsx
│       │   │   └── ErrorContext.tsx
│       │   ├── hooks/
│       │   │   ├── useAccessibility.tsx
│       │   │   ├── useAchievements.test.ts
│       │   │   ├── useAchievements.ts
│       │   │   ├── useAdminMode.tsx
│       │   │   ├── useAuthMasterclass.ts
│       │   │   ├── useProgressChartData.test.ts
│       │   │   ├── useProgressChartData.ts
│       │   │   ├── useRecentActivity.test.ts
│       │   │   ├── useRecentActivity.ts
│       │   │   ├── useRouteProgress.ts
│       │   │   ├── useSupabaseList.ts
│       │   │   └── useTheme.tsx
│       │   ├── layouts/
│       │   │   ├── AdminLayout.tsx
│       │   │   ├── CompactAdminLayout.tsx
│       │   │   └── SimpleAppLayout.tsx
│       │   ├── lib/
│       │   │   ├── __mocks__/
│       │   │   ├── __tests__/
│       │   │   ├── auth-claims.ts
│       │   │   ├── logger.ts
│       │   │   ├── supabase-interceptor.ts
│       │   │   ├── supabase.ts
│       │   │   └── utils.ts
│       │   ├── pages/
│       │   │   ├── admin-dashboard/
│       │   │   ├── auth/
│       │   │   ├── cms/
│       │   │   ├── lesson-viewer/
│       │   │   ├── not-found/
│       │   │   ├── program-overview/
│       │   │   ├── public-homepage/
│       │   │   ├── user-dashboard/
│       │   │   ├── user-management-admin/
│       │   │   ├── user-profile-management/
│       │   │   └── verify-email/
│       │   ├── services/
│       │   │   ├── __tests__/
│       │   │   ├── authService.ts
│       │   │   ├── courseService.ts
│       │   │   ├── storageService.ts
│       │   │   └── userService.ts
│       │   ├── styles/
│       │   │   ├── admin-nav.css
│       │   │   ├── design-tokens.css
│       │   │   └── tailwind.css
│       │   ├── types/
│       │   │   ├── adminUser.ts
│       │   │   ├── app-error.ts
│       │   │   ├── auth.ts
│       │   │   ├── course.types.ts
│       │   │   ├── database.types.ts
│       │   │   ├── framer-motion-fixes.d.ts
│       │   │   ├── framer-motion.d.ts
│       │   │   ├── global.d.ts
│       │   │   ├── metrics.ts
│       │   │   ├── nprogress.d.ts
│       │   │   ├── polymorphic.ts
│       │   │   ├── react-router-complete.d.ts
│       │   │   ├── react-router-dom.d.ts
│       │   │   ├── react-router-fixes.d.ts
│       │   │   ├── react-router.d.ts
│       │   │   ├── rpc.types.ts
│       │   │   ├── solana.d.ts
│       │   │   ├── strict-optional.types.ts
│       │   │   ├── tailwind.d.ts
│       │   │   ├── user.ts
│       │   │   ├── userProgressRow.ts
│       │   │   ├── userSettings.ts
│       │   │   ├── userSettingsSchemas.ts
│       │   │   ├── userTableRow.ts
│       │   │   ├── utils.ts
│       │   │   └── vite-env-fixes.d.ts
│       │   ├── utils/
│       │   │   ├── __tests__/
│       │   │   ├── auth.ts
│       │   │   ├── supabaseClient.ts
│       │   │   └── theme.ts
│       │   ├── App.tsx
│       │   ├── index.tsx
│       │   ├── Routes.tsx
│       │   ├── setupTests.ts
│       │   └── vite-env.d.ts
│       └── tests/
├── libs/
│   ├── cms-utils/
│   │   ├── index.ts
│   │   └── tsconfig.json
│   │   └── __tests__/
│   ├── logger/
│   │   ├── index.ts
│   │   └── tsconfig.json
│   └── supabase-utils/
│       ├── assertData.ts
│       ├── result.ts
│       └── tsconfig.json
├── node_modules/
└── src/
    └── env.d.ts
```

## 4. Explication Détaillée de la Structure

### 4.1. Répertoire Racine (`C:/GitHub/ai_foundations_lms/`)

Contient les fichiers de configuration globaux du monorepo et les métadonnées du projet.

*   `.gitattributes`, `.gitignore`: Configurations Git pour le contrôle de version.
*   `.mcp.json`, `.npmrc`, `.pnpmrc`: Fichiers de configuration pour les gestionnaires de paquets (pnpm) et les registres.
*   `.prettierrc`: Configuration de Prettier pour le formatage automatique du code.
*   `CLAUDE.md`: Documentation spécifique à l'utilisation de Claude (probablement un agent IA ou un outil).
*   `commitlint.config.js`: Règle pour la validation des messages de commit, assurant une convention uniforme.
*   `DEVELOPER_GUIDE.md`: Guide pour les développeurs, essentiel pour l'onboarding et les bonnes pratiques.
*   `eslint.config.js`: Configuration ESLint pour le linting du code à l'échelle du monorepo.
*   `LICENSE`: Fichier de licence du projet.
*   `lint-staged.config.mjs`: Configuration de `lint-staged` pour exécuter des linters sur les fichiers stagés avant le commit.
*   `package.json`: Manifeste principal du monorepo, définissant les scripts, les dépendances partagées et les workspaces.
*   `pnpm-lock.yaml`: Fichier de verrouillage des dépendances pnpm, garantissant des installations reproductibles.
*   `pnpm-workspace.yaml`: Définit les workspaces du monorepo (`apps/*` et `libs/*`).
*   `README.md`: Description générale du projet.
*   `tsconfig.json`: Configuration TypeScript globale pour le monorepo.
*   `.claude/`: Contient des configurations locales pour l'outil Claude.
*   `.git/`: Répertoire Git interne.
*   `.husky/`: Contient les hooks Git configurés par Husky (`commit-msg`, `pre-commit`).
*   `.pnpm-store/`: Cache local de pnpm pour les paquets.
*   `.vscode/`: Configurations spécifiques à VS Code (extensions recommandées).
*   `node_modules/`: Dépendances installées au niveau racine.
*   `src/env.d.ts`: Déclarations de types pour les variables d'environnement.

### 4.2. Répertoire `apps/`

Contient les applications principales du projet.

#### 4.2.1. `apps/backend/`

Application backend, centrée sur Supabase.

*   `eslint.config.js`, `package.json`, `tsconfig.json`: Configurations spécifiques à l'application backend.
*   `supabase/`: Répertoire clé pour l'intégration Supabase.
    *   `.temp/`, `backup/`: Répertoires temporaires et de sauvegarde.
    *   `functions/`: Contient les fonctions Edge (Deno/TypeScript) déployées sur Supabase. `placeholder.ts` suggère un point de départ.
    *   `migrations/`: Contient les scripts SQL de migration de la base de données Supabase. `20250719192903_remote_schema.sql` est une migration existante.
    *   `.gitignore`, `config.toml`: Configurations Supabase CLI.

#### 4.2.2. `apps/frontend/`

Application frontend basée sur React et Vite.

*   `eslint_errors.log`, `eslint_report.json`: Logs et rapports ESLint.
*   `eslint.config.js`, `package.json`, `postcss.config.js`, `tailwind.config.js`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.mjs`, `vitest.config.ts`: Configurations spécifiques au frontend (linting, build, styling, tests).
*   `index.html`: Point d'entrée HTML de l'application.
*   `dist/`, `dist-types/`: Répertoires de sortie de la build.
*   `nginx/`: Probablement des configurations Nginx pour le déploiement.
*   `public/`: Assets statiques.
*   `src/`: Code source de l'application frontend.
    *   `App.tsx`: Composant racine de l'application React.
    *   `index.tsx`: Point d'entrée principal de l'application (rendu React).
    *   `Routes.tsx`: Définit les routes de l'application (probablement avec React Router).
    *   `setupTests.ts`: Fichier de configuration pour les tests (Vitest).
    *   `vite-env.d.ts`: Déclarations de types spécifiques à Vite.
    *   `components/`: Composants React réutilisables.
        *   `layout/`, `ui/`: Sous-catégories pour l'organisation des composants.
        *   `AdminLayout.tsx`, `ProtectedRoute.tsx`, `RootLayout.tsx`: Composants de layout et de protection de routes.
    *   `context/`: Contextes React pour la gestion de l'état global (`AuthContext`, `CourseContext`, `ErrorContext`).
    *   `hooks/`: Hooks React personnalisés (`useAchievements`, `useAdminMode`, `useSupabaseList`).
    *   `layouts/`: Layouts de page spécifiques.
    *   `lib/`: Utilitaires et configurations de bibliothèques tierces (`supabase.ts` pour l'initialisation du client Supabase, `logger.ts`).
    *   `pages/`: Composants de page, organisés par fonctionnalité (`admin-dashboard`, `auth`, `cms`, `lesson-viewer`, `user-dashboard`).
    *   `services/`: Logique métier et appels API (`authService`, `courseService`, `userService`).
    *   `styles/`: Fichiers CSS et configurations de style (`tailwind.css`, `design-tokens.css`).
    *   `types/`: Déclarations de types TypeScript spécifiques à l'application (types de base de données, d'utilisateurs, etc.).
    *   `utils/`: Fonctions utilitaires diverses (`supabaseClient.ts`, `auth.ts`).

### 4.3. Répertoire `libs/`

Contient des bibliothèques partagées entre les applications du monorepo.

*   `cms-utils/`: Utilitaires liés au système de gestion de contenu.
    *   `index.ts`: Point d'entrée de la bibliothèque.
    *   `tsconfig.json`: Configuration TypeScript spécifique.
    *   `__tests__/`: Tests unitaires.
*   `logger/`: Bibliothèque de logging partagée.
    *   `index.ts`: Point d'entrée.
    *   `tsconfig.json`: Configuration TypeScript spécifique.
*   `supabase-utils/`: Utilitaires liés à Supabase, partagés entre frontend et backend (potentiellement).
    *   `assertData.ts`, `result.ts`: Fonctions utilitaires pour la manipulation des données Supabase ou la gestion des résultats.
    *   `tsconfig.json`: Configuration TypeScript spécifique.

## 5. Workflows de Développement

Le projet est configuré avec des outils qui imposent des workflows de développement robustes et des standards de qualité.

*   **Gestion des Dépendances**: `pnpm` est utilisé pour une installation rapide et efficace des dépendances, avec un cache global et un support monorepo.
*   **Formatage de Code**: `Prettier` est configuré pour formater automatiquement le code, garantissant une cohérence stylistique à travers le projet. Le fichier `.prettierrc` définit les règles.
*   **Linting**: `ESLint` est utilisé pour identifier et rapporter les problèmes dans le code. `eslint.config.js` au niveau racine et dans chaque application permet une configuration granulaire.
*   **Hooks Git**: `Husky` est configuré pour exécuter des scripts à des moments spécifiques du workflow Git.
    *   `pre-commit`: Exécute `lint-staged` avant chaque commit.
    *   `commit-msg`: Exécute `commitlint` pour valider le format du message de commit.
*   **Pré-commit Staging**: `lint-staged` exécute des commandes (comme ESLint et Prettier) uniquement sur les fichiers modifiés et stagés, accélérant le processus de validation.
*   **Conventions de Commit**: `commitlint` assure que les messages de commit suivent une convention prédéfinie (par exemple, Conventional Commits), ce qui facilite la génération de changelogs et la compréhension de l'historique du projet.
*   **Tests**: `Vitest` est utilisé pour les tests unitaires et d'intégration dans l'application frontend. Les fichiers `*.test.ts` et les répertoires `__tests__` sont présents.
*   **Build**: `Vite` est le bundler pour le frontend, offrant un développement rapide et des builds optimisées.
*   **Déploiement Supabase**: Le répertoire `apps/backend/supabase` indique une intégration directe avec la CLI Supabase pour la gestion des migrations de base de données et le déploiement des fonctions Edge.

## 6. Points Forts et Bonnes Pratiques

*   **Monorepo**: Facilite le partage de code entre le frontend, le backend (fonctions Edge) et les bibliothèques utilitaires.
*   **TypeScript**: Utilisation généralisée de TypeScript pour une meilleure maintenabilité, détection d'erreurs et autocomplétion.
*   **Conventions Strictes**: L'utilisation de Prettier, ESLint, Husky, lint-staged et commitlint garantit une haute qualité de code et une cohérence à travers l'équipe.
*   **Structure Modulaire**: Les applications et bibliothèques sont bien séparées, et le frontend est organisé en modules clairs (components, hooks, contexts, pages, services).
*   **Intégration Supabase**: L'organisation des fonctions Edge et des migrations SQL dans le répertoire `supabase` est une bonne pratique pour les projets Supabase.
*   **Documentation**: La présence de `README.md`, `DEVELOPER_GUIDE.md` et `CLAUDE.md` indique un effort de documentation.

## 7. Recommandations / Prochaines Étapes

*   **Documentation des Fonctions Edge**: Ajouter des `README.md` ou des commentaires détaillés dans `apps/backend/supabase/functions/placeholder.ts` et les futures fonctions pour expliquer leur rôle et leur utilisation.
*   **Schéma de Base de Données**: Générer et documenter le schéma de base de données Supabase (par exemple, via `supabase gen types typescript --db-url ...` pour `database.types.ts`).
*   **CI/CD**: Mettre en place des pipelines CI/CD pour automatiser les tests, le linting, le build et le déploiement.
*   **Gestion des Secrets**: S'assurer que les clés API et autres secrets sont gérés de manière sécurisée (variables d'environnement, secrets de déploiement).
*   **Performance Frontend**: Examiner les bundles de production pour optimiser la taille et les performances (code splitting, lazy loading).
*   **Tests Complets**: S'assurer que la couverture de test est adéquate pour toutes les parties critiques du code, y compris les fonctions Edge et les services frontend.

## 8. Analyse Détaillée des Fichiers de Configuration

### 8.1. `package.json` (Racine du Monorepo)

Ce fichier est le manifeste principal du monorepo. Il définit les scripts globaux, les dépendances partagées et la configuration de pnpm pour les workspaces.

*   **`name`**: `ai-foundations-monorepo` - Nom du projet monorepo.
*   **`private`**: `true` - Indique que ce package n'est pas destiné à être publié sur un registre npm.
*   **`type`**: `module` - Spécifie que les fichiers JavaScript dans ce package sont des modules ES.
*   **`packageManager`**: `pnpm@10.13.1...` - Définit la version de pnpm à utiliser, assurant la cohérence entre les développeurs.
*   **`engines`**: Spécifie les versions minimales de Node.js et pnpm requises.
*   **`scripts`**:
    *   `dev`, `build`, `preview`, `start`, `test`: Scripts qui délèguent les commandes aux applications frontend et backend via `pnpm --filter`.
    *   `lint`: Exécute ESLint sur l'ensemble du monorepo.
    *   `typecheck`: Exécute `tsc --noEmit` pour vérifier les types dans tout le projet.
    *   `format`: Exécute Prettier pour formater le code.
    *   `prepare`: Script exécuté après `pnpm install` pour configurer Husky.
    *   `db:pull`, `db:push`, `migration:new`, `gen:types`: Scripts liés à Supabase, délégués à l'application backend.
    *   `validate:env`: Script personnalisé pour valider les variables d'environnement.
*   **`devDependencies`**: Contient les outils de développement pour le monorepo, tels que `@commitlint/cli`, `eslint`, `husky`, `lint-staged`, `prettier`, `typescript`, etc.
*   **`dependencies`**: Dépendances partagées par plusieurs packages ou utilisées au niveau racine, comme `@supabase/supabase-js`, `pino`, `sonner`.
*   **`lint-staged`**: Configuration pour `lint-staged`, qui exécute `prettier --write` sur les fichiers stagés (JS, JSX, TS, TSX, JSON, MD, MDX) et `eslint --fix` sur les fichiers JS, JSX, TS, TSX.

### 8.2. `tsconfig.json` (Racine du Monorepo)

Ce fichier est la configuration TypeScript de base pour l'ensemble du monorepo. Les autres `tsconfig.json` des applications et bibliothèques étendent cette configuration.

*   **`compilerOptions`**:
    *   `target`, `module`, `moduleResolution`, `lib`: Définissent la cible de compilation, le système de modules et les bibliothèques disponibles.
    *   `strict`: Active toutes les options de vérification de type strictes, favorisant un code robuste.
    *   `skipLibCheck`: Ignore la vérification de type des fichiers de déclaration des bibliothèques tierces.
    *   `noUnusedLocals`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`: Options pour renforcer la qualité du code et prévenir les erreurs courantes.
    *   `isolatedModules`: Assure que chaque fichier peut être compilé indépendamment, utile pour les bundlers comme Vite.
    *   `noEmit`: Empêche TypeScript de générer des fichiers JavaScript, car le bundling est géré par Vite.
    *   `jsx`: `react-jsx` - Configure la transformation JSX pour React 17+.
    *   `baseUrl`, `paths`: Définissent les chemins d'importation des modules, permettant des imports absolus et des alias (`@libs/*`, `@frontend/*`, `@/*`, `tailwind-config`).
    *   `typeRoots`, `types`: Spécifient où trouver les fichiers de déclaration de types.
*   **`include`**: Spécifie les fichiers à inclure dans la compilation TypeScript.
*   **`exclude`**: Spécifie les fichiers et répertoires à exclure de la compilation (par exemple, `node_modules`, `dist`, fichiers de test, scripts).

### 8.3. `apps/backend/package.json`

Manifeste de l'application backend, principalement axée sur les opérations Supabase.

*   **`name`**: `supabase-backend` - Nom du package backend.
*   **`private`**: `true` - Non destiné à être publié.
*   **`scripts`**:
    *   `db:pull`, `db:push`, `migration:new`: Scripts pour interagir avec la base de données Supabase (pull du schéma, push des migrations, création de nouvelles migrations).
    *   `gen:types`: Génère les types TypeScript de la base de données Supabase et les place dans le répertoire du frontend, assurant la synchronisation des types.
*   **`devDependencies`**: Contient `lint-staged` et la CLI `supabase`.

### 8.4. `apps/backend/tsconfig.json`

Configuration TypeScript spécifique à l'application backend.

*   **`extends`**: `../../tsconfig.json` - Hérite de la configuration TypeScript racine.
*   **`compilerOptions`**:
    *   `rootDir`, `outDir`: Définissent les répertoires racine des sources et de sortie.
    *   `noEmit`: `false` - Contrairement au frontend, le backend peut avoir besoin d'émettre des fichiers JS compilés (par exemple, pour les fonctions Edge).
    *   `module`, `moduleResolution`, `target`: Spécifiques à l'environnement Node.js (`NodeNext`, `ES2022`).
    *   `paths`: Alias pour les imports locaux (`@/*`).
*   **`include`**: Inclut tous les fichiers `.ts` dans le répertoire.
*   **`exclude`**: Exclut `node_modules` et `dist`.

### 8.5. `apps/frontend/package.json`

Manifeste de l'application frontend.

*   **`name`**: `frontend` - Nom du package frontend.
*   **`version`**: `0.1.0` - Version de l'application.
*   **`private`**: `true` - Non destiné à être publié.
*   **`displayName`**: `IA Foundations` - Nom affiché de l'application.
*   **`type`**: `module` - Fichiers JavaScript sont des modules ES.
*   **`dependencies`**: Dépendances de production pour le frontend, incluant `@supabase/supabase-js`, `@tanstack/react-query`, `react`, `react-dom`, `react-router-dom`, `framer-motion`, `lucide-react`, `recharts`, `sonner`, `zod`, etc.
*   **`scripts`**:
    *   `start`, `dev`, `build`, `serve`: Scripts pour le développement, la compilation et le service de l'application Vite.
    *   `lint`, `format`, `test`, `test:watch`, `test:coverage`, `typecheck`: Scripts pour le linting, le formatage, les tests (Vitest) et la vérification de type.
*   **`browserslist`**: Spécifie les navigateurs cibles pour la compatibilité.
*   **`devDependencies`**: Outils de développement spécifiques au frontend, comme `@vitejs/plugin-react`, `autoprefixer`, `postcss`, `tailwindcss`, `typescript`, `vitest`, `@testing-library/react`, etc.

### 8.6. `apps/frontend/tsconfig.json`

Configuration TypeScript principale pour l'application frontend.

*   **`extends`**: `../../tsconfig.json` - Hérite de la configuration TypeScript racine.
*   **`compilerOptions`**:
    *   `composite`: `false` - Indique que ce projet n'est pas un projet de compilation composite (bien que les libs le soient).
    *   `outDir`, `rootDir`, `baseUrl`: Définissent les chemins de sortie et de base.
    *   `target`, `lib`, `module`, `moduleResolution`, `isolatedModules`, `noEmit`, `jsx`: Configurations adaptées à un environnement de navigateur et à Vite.
    *   `useDefineForClassFields`: Nécessaire pour la compatibilité avec les champs de classe dans les navigateurs modernes.
    *   `allowImportingTsExtensions`, `resolveJsonModule`: Permettent l'importation de fichiers `.ts` et `.json`.
    *   `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`: Options de vérification de type strictes.
    *   `paths`: Alias d'importation spécifiques au frontend (`@/*`, `@frontend/*`, `@utils/*`, `@services/*`, etc.) et un alias pour les bibliothèques partagées (`@libs/*`).
    *   `typeRoots`, `types`: Spécifient les répertoires pour les définitions de types, y compris les types personnalisés dans `src/types`.
*   **`include`**: Inclut les fichiers source, les déclarations de types et les fichiers spécifiques à Vite.
*   **`exclude`**: Exclut `node_modules`, `dist` et les fichiers de test.
*   **`references` (commenté)**: Indique la possibilité de lier les projets de bibliothèque (`libs`) pour une meilleure vérification de type inter-packages.

### 8.7. `apps/frontend/tsconfig.node.json`

Configuration TypeScript pour les fichiers Node.js utilisés dans le processus de build du frontend (par exemple, `vite.config.mjs`).

*   **`compilerOptions`**:
    *   `composite`: `true` - Peut être un projet composite.
    *   `skipLibCheck`: Ignore la vérification de type des bibliothèques.
    *   `module`, `moduleResolution`: Spécifiques à Node.js.
*   **`include`**: Inclut `vite.config.mjs`.

### 8.8. `libs/cms-utils/tsconfig.json`

Configuration TypeScript pour la bibliothèque `cms-utils`.

*   **`extends`**: `../../tsconfig.json` - Hérite de la configuration TypeScript racine.
*   **`compilerOptions`**:
    *   `rootDir`, `outDir`: Définissent les répertoires racine des sources et de sortie.
    *   `noEmit`: `false` - Permet la compilation de la bibliothèque.
    *   `composite`: `true` - Indique que c'est un projet de compilation composite, permettant d'être référencé par d'autres projets.
    *   `declaration`: `true` - Génère des fichiers de déclaration `.d.ts`.
    *   `paths`: Alias pour les imports locaux (`@/*`).
*   **`include`**: Inclut tous les fichiers `.ts`.
*   **`exclude`**: Exclut `node_modules`, `dist` et les fichiers de test.

### 8.9. `libs/logger/tsconfig.json`

Configuration TypeScript pour la bibliothèque `logger`. Similaire à `cms-utils/tsconfig.json`.

*   **`extends`**: `../../tsconfig.json` - Hérite de la configuration TypeScript racine.
*   **`compilerOptions`**:
    *   `rootDir`, `outDir`: Définissent les répertoires racine des sources et de sortie.
    *   `noEmit`: `false` - Permet la compilation de la bibliothèque.
    *   `composite`: `true` - Projet composite.
    *   `declaration`: `true` - Génère des fichiers de déclaration `.d.ts`.
    *   `paths`: Alias pour les imports locaux (`@/*`).
*   **`include`**: Inclut tous les fichiers `.ts`.
*   **`exclude`**: Exclut `node_modules`, `dist` et les fichiers de test.

### 8.10. `libs/supabase-utils/tsconfig.json`

Configuration TypeScript pour la bibliothèque `supabase-utils`.

*   **`extends`**: `../../tsconfig.json` - Hérite de la configuration TypeScript racine.
*   **`compilerOptions`**:
    *   `composite`: `true` - Essentiel pour les références de projet.
    *   `noEmit`: `false` - Nécessaire pour les projets référencés.
    *   `outDir`, `rootDir`: Définissent les répertoires de sortie et racine.
*   **`include`**: Inclut tous les fichiers `.ts` et `.d.ts`.
*   **`exclude`**: Exclut `node_modules` et `dist`.

### 8.11. `.prettierrc`

Fichier de configuration pour Prettier, l'outil de formatage de code. Il assure une cohérence stylistique à travers tout le projet.

*   **`semi`**: `true` - Ajoute des points-virgules à la fin des instructions.
*   **`singleQuote`**: `true` - Utilise des guillemets simples pour les chaînes de caractères.
*   **`tabWidth`**: `2` - Définit la largeur d'une tabulation à 2 espaces.
*   **`trailingComma`**: `es5` - Ajoute des virgules de fin pour les objets et tableaux compatibles ES5.
*   **`printWidth`**: `100` - Définit la largeur maximale d'une ligne à 100 caractères.
*   **`bracketSpacing`**: `true` - Ajoute des espaces entre les accolades des objets.
*   **`jsxSingleQuote`**: `true` - Utilise des guillemets simples pour les attributs JSX.
*   **`arrowParens`**: `avoid` - Omet les parenthèses autour d'un seul paramètre dans les fonctions fléchées.

### 8.12. `eslint.config.js`

Configuration ESLint pour le linting du code. Ce fichier utilise la nouvelle configuration plate d'ESLint.

*   **`ignores`**: Définit les chemins à ignorer par ESLint (répertoires de build, `node_modules`, fichiers de test, etc.).
*   **Configurations de base**:
    *   `js.configs.recommended`: Règles JavaScript recommandées.
    *   `tseslint.configs.recommended`: Règles TypeScript recommandées.
*   **Configuration React (pour `apps/frontend`)**:
    *   Applique les plugins `eslint-plugin-react` et `eslint-plugin-react-hooks`.
    *   Désactive `react/react-in-jsx-scope` (non nécessaire avec React 17+ et Vite) et `react/prop-types` (géré par TypeScript).
*   **Scripts Node.js**: Règles spécifiques pour les scripts dans le répertoire `scripts/`.
*   **Règles générales**:
    *   `no-console`: Avertit sur l'utilisation de `console.log` (sauf `warn` et `error`).
    *   `@typescript-eslint/no-unused-vars`: Avertit sur les variables inutilisées (ignore les arguments préfixés par `_`).
    *   Règles strictes TypeScript (`@typescript-eslint/ban-ts-comment`, `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-non-null-assertion`).
    *   Règles JavaScript modernes (`prefer-const`, `no-var`, `eqeqeq`, `no-duplicate-imports`, etc.).
*   **`prettierConfig`**: Doit être la dernière configuration pour s'assurer que Prettier gère le formatage final et évite les conflits avec les règles de linting.

### 8.13. `commitlint.config.js`

Configuration pour `commitlint`, qui valide les messages de commit selon la convention Conventional Commits.

*   **`extends`**: `['@commitlint/config-conventional']` - Étend les règles conventionnelles de commit.
*   **`rules`**:
    *   `type-empty`: `[0, 'always']` - Désactivé, permettant des commits sans type (ex: "correction supabase").
    *   `subject-empty`: `[0, 'always']` - Désactivé, car le parseur peut échouer sans type, rendant le sujet nul.
    *   `header-min-length`: `[2, 'always', 3]` - Assure que le message de commit (l'en-tête) a une longueur minimale de 3 caractères.

### 8.14. `lint-staged.config.mjs`

Configuration pour `lint-staged`, qui exécute des commandes sur les fichiers stagés avant un commit.

*   `'*.{js,jsx,ts,tsx}'`: Exécute `eslint --fix --max-warnings 0 --no-warn-ignored` sur les fichiers JavaScript et TypeScript stagés. Cela corrige automatiquement les problèmes de linting.
*   `'*.{json,md,yml,yaml}'`: Exécute `prettier --write` sur les fichiers JSON, Markdown, YAML stagés. Cela formate automatiquement ces fichiers.

### 8.15. `apps/frontend/vite.config.mjs`

Configuration de Vite pour l'application frontend.

*   **`envDir`**: `'../../'` - Indique à Vite de chercher les fichiers `.env` à la racine du monorepo.
*   **`build`**:
    *   `outDir`: `'dist'` - Répertoire de sortie pour la build.
    *   `chunkSizeWarningLimit`: `2000` - Limite d'avertissement pour la taille des chunks.
*   **`plugins`**:
    *   `react()`: Plugin React pour Vite.
    *   `visualizer()`: Plugin `rollup-plugin-visualizer` pour analyser la taille du bundle (activé si `process.env.ANALYZE` est défini).
*   **`resolve.alias`**: Configure les alias d'importation pour faciliter l'organisation du code et éviter les chemins relatifs longs.
    *   `@`, `@frontend`: Alias vers `src/`.
    *   `@utils`, `@services`, `@components`, `@contexts`, `@lib`: Alias vers les sous-répertoires correspondants dans `src/`.
    *   `@libs`: Alias vers le répertoire `../../libs` pour les bibliothèques partagées.
    *   `@logger`: Alias spécifique vers `../../libs/logger`.
    *   `tailwind-config`: Alias vers le fichier `tailwind.config.js`.
*   **`server`**: Configuration du serveur de développement Vite.
    *   `port`: `5173`, `host`: `'0.0.0.0'`, `strictPort`: `true` - Configuration du port et de l'hôte.
    *   `allowedHosts`: Liste des hôtes autorisés.
    *   `hmr`: Configuration du Hot Module Replacement.
    *   `watch`: Configuration du watcher de fichiers, incluant l'utilisation du polling pour les environnements où le watcher natif ne fonctionne pas bien (ex: WSL, Docker).

### 8.16. `apps/frontend/tailwind.config.js`

Configuration de Tailwind CSS pour l'application frontend.

*   **`content`**: Spécifie les fichiers à analyser par Tailwind pour générer les classes CSS (fichiers HTML et tous les fichiers JS/TS/JSX/TSX dans `src/`).
*   **`theme.extend`**: Permet d'étendre le thème par défaut de Tailwind avec des couleurs personnalisées, des polices, des espacements, des ombres, des transitions, des animations et des `z-index`.
    *   **`colors`**: Définit une palette de couleurs sémantiques (primary, secondary, accent, background, surface, text, status colors comme success, warning, error) avec des nuances.
    *   **`fontFamily`**: Définit les polices personnalisées (`Inter`, `JetBrains Mono`).
    *   **`fontSize`**: Définit des tailles de police personnalisées.
    *   **`spacing`**: Définit des espacements supplémentaires.
    *   **`boxShadow`**: Définit des ombres personnalisées pour les élévations.
    *   **`transitionTimingFunction`**, **`transitionDuration`**: Fonctions et durées de transition personnalisées.
    *   **`animation`**, **`keyframes`**: Animations CSS personnalisées (`fade-in`, `slide-in`, `bounce-subtle`).
    *   **`zIndex`**: Définit des niveaux de `z-index` sémantiques pour les couches de l'interface utilisateur (header, sidebar, modal, etc.).
*   **`plugins`**: Inclut les plugins `@tailwindcss/typography` (pour styliser le contenu riche) et `@tailwindcss/forms` (pour réinitialiser les styles de formulaire).

### 8.17. `apps/frontend/postcss.config.js`

Configuration de PostCSS, un outil pour transformer le CSS avec des plugins JavaScript.

*   **`plugins`**:
    *   `postcss-import`: Gère les `@import` dans le CSS.
    *   `tailwindcss/nesting`: Permet l'imbrication des règles CSS avec Tailwind.
    *   `tailwindcss`: Le plugin principal de Tailwind CSS.
    *   `autoprefixer`: Ajoute automatiquement les préfixes vendeurs aux propriétés CSS pour la compatibilité navigateur.

### 8.18. `apps/backend/supabase/config.toml`

Fichier de configuration pour la CLI Supabase, utilisé pour gérer le projet Supabase localement et interagir avec le projet distant.

*   **`project_id`**: Identifiant du projet Supabase (ici "backend" pour le contexte local).
*   **`[api]`**: Configuration de l'API Supabase locale.
    *   `enabled`, `port`, `schemas`, `extra_search_path`, `max_rows`.
*   **`[db]`**: Configuration de la base de données locale.
    *   `port`, `shadow_port`, `major_version` (important pour la compatibilité avec la DB distante).
*   **`[db.migrations]`**:
    *   `enabled`: `true` - Les migrations sont activées.
    *   `schema_paths`: Chemins vers les fichiers de schéma SQL.
*   **`[db.seed]`**:
    *   `enabled`: `true` - Le fichier `seed.sql` est exécuté après les migrations lors d'un `db reset`.
*   **`[realtime]`**: Configuration du service Realtime.
*   **`[studio]`**: Configuration de Supabase Studio local.
    *   `port`, `api_url`, `openai_api_key` (peut être défini via env).
*   **`[inbucket]`**: Configuration du serveur de test d'emails local.
*   **`[storage]`**: Configuration du service de stockage de fichiers.
    *   `file_size_limit`.
*   **`[auth]`**: Configuration du service d'authentification.
    *   `site_url`, `additional_redirect_urls`, `jwt_expiry`, `enable_signup`, `minimum_password_length`, etc.
    *   Sections pour la gestion des taux (`rate_limit`), l'email (`email`), les SMS (`sms`), l'authentification multi-facteurs (`mfa`), les fournisseurs OAuth externes (`external`), Web3 (`web3`), et les intégrations tierces (`third_party`).
*   **`[edge_runtime]`**: Configuration de l'environnement d'exécution des fonctions Edge (Deno).
    *   `enabled`, `policy`, `inspector_port`, `deno_version`.
*   **`[analytics]`**: Configuration du service d'analyse.
*   **`[experimental]`**: Section pour les fonctionnalités expérimentales.

## 9. Résumé des Documents de Documentation Clés

### 9.1. `README.md`

Le `README.md` est le point d'entrée principal du projet. Il fournit un aperçu rapide du LMS "AI Foundations", des instructions de démarrage rapide, une vue d'ensemble de l'architecture monorepo, et met en avant l'approche "Cloud-First" du projet avec Supabase. Il liste également les commandes principales et la stack technique, et renvoie vers des documentations plus détaillées (`DEVELOPER_GUIDE.md`, `CLAUDE.md`).

### 9.2. `DEVELOPER_GUIDE.md`

Ce guide est une ressource exhaustive pour les développeurs. Il détaille toutes les commandes `pnpm` disponibles, organisées par catégorie (développement, tests, qualité de code, base de données, utilitaires), à la fois au niveau racine et pour les applications spécifiques (frontend, backend). Il propose également des workflows recommandés pour le démarrage de fonctionnalités, la préparation des commits, la mise à jour du schéma de base de données, et inclut une section de dépannage et de bonnes pratiques. C'est le manuel opérationnel pour tout développeur travaillant sur le projet.

### 9.3. `CLAUDE.md`

Ce fichier est spécifiquement conçu pour guider les outils d'IA comme Claude Code. Il résume l'architecture du projet, les commandes clés, et met l'accent sur l'approche "Cloud-Only" du développement avec Supabase. Il fournit des informations concises sur la structure du monorepo, l'architecture frontend, l'intégration backend (100% cloud), la gestion de l'état, la stratégie de test, les directives de développement (style de code, composants, couche de service), et les procédures de modification de la base de données. Il insiste sur l'absence de dépendances locales (Docker, PostgreSQL) pour faciliter l'interaction des IA.

## 10. Gestion des Variables d'Environnement

Le projet utilise des variables d'environnement pour la configuration sensible, notamment les identifiants Supabase.

*   **Fichier `.env`**: Les variables sont chargées à partir d'un fichier `.env` situé à la racine du monorepo. Le `README.md` et `CLAUDE.md` indiquent de copier `.env.example` vers `.env` et de le configurer.
*   **`envalid`**: La dépendance `envalid` est utilisée dans le frontend (`apps/frontend/package.json`) et probablement dans le script `validate-env.js` pour valider les variables d'environnement au démarrage de l'application, assurant que toutes les variables requises sont présentes et ont le bon format.
*   **Accès**: Les variables sont accessibles via `process.env` dans le code Node.js et via `import.meta.env` dans le code frontend (Vite).
*   **Sécurité**: L'approche "Cloud-First" et l'absence de base de données locale réduisent la surface d'attaque pour les secrets locaux, mais il est crucial de ne jamais committer le fichier `.env` dans le contrôle de version.

## 11. Stratégie de Test Approfondie

Le projet met en œuvre une stratégie de test complète pour garantir la qualité et la stabilité du code.

*   **Tests Unitaires/Intégration (Frontend)**:
    *   **Framework**: `Vitest` est le moteur de test principal.
    *   **Bibliothèques**: `Testing Library` (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`) est utilisée pour tester les composants React de manière axée sur le comportement utilisateur.
    *   **Organisation**: Les tests sont co-localisés avec le code source dans des répertoires `__tests__/` (ex: `apps/frontend/src/components/__tests__`).
    *   **Scripts**:
        *   `pnpm test` (racine) ou `pnpm --filter frontend test`: Exécute les tests une fois.
        *   `pnpm --filter frontend test:watch`: Lance les tests en mode "watch" pour un feedback instantané pendant le développement.
        *   `pnpm --filter frontend test:coverage`: Génère un rapport de couverture de code (`@vitest/coverage-v8`).
        *   `pnpm test:output`: Exécute les tests et sauvegarde les résultats dans un fichier JSON (`test-results.json`), utile pour l'intégration continue ou l'analyse.
*   **Tests End-to-End (E2E)**:
    *   **Framework**: `Playwright` est mentionné dans la stack technique du `README.md` et `CLAUDE.md`, indiquant une capacité à effectuer des tests de bout en bout simulant des interactions utilisateur réelles dans un navigateur. Bien que les fichiers de test E2E ne soient pas explicitement listés dans l'arborescence fournie, leur mention implique leur existence ou leur intention.
    *   **Script**: `pnpm test:e2e` (racine) est le script pour les exécuter.
*   **Tests Backend**:
    *   Le `DEVELOPER_GUIDE.md` mentionne `pnpm test:backend`, suggérant l'existence de tests spécifiques pour la logique côté serveur (probablement les fonctions Edge Supabase ou d'autres services backend).
*   **Vérification de Type**: `pnpm typecheck` (racine) exécute `tsc --noEmit` pour s'assurer que le code TypeScript est exempt d'erreurs de type, agissant comme une forme de test statique.
*   **Qualité de Code**: Le linting (`pnpm lint`) et le formatage (`pnpm format`) sont intégrés dans le workflow de développement et les hooks de pré-commit pour maintenir une haute qualité de code avant même l'exécution des tests.

## 12. Aperçu des Fichiers de Code Principaux

Cette section fournit une brève description de la finalité et des fonctions clés de certains fichiers de code importants, donnant une compréhension de haut niveau de leur rôle.

### 12.1. Frontend (`apps/frontend/src/`)

*   **`App.tsx`**: Le composant racine de l'application React. Il est responsable de la mise en place des fournisseurs de contexte (authentification, cours, erreurs) et de la structure globale de l'application, y compris le rendu des routes.
*   **`index.tsx`**: Le point d'entrée principal de l'application frontend. Il initialise l'application React en rendant le composant `App` dans le DOM.
*   **`Routes.tsx`**: Ce fichier centralise la définition des routes de l'application, probablement en utilisant `react-router-dom`. Il gère la navigation entre les différentes pages et peut inclure la logique de protection des routes (par exemple, via `ProtectedRoute.tsx`).
*   **`lib/supabase.ts`**: Ce fichier est crucial pour l'intégration avec Supabase. Il initialise le client Supabase (`createClient`) avec les clés API et l'URL du projet, et exporte cette instance pour être utilisée dans toute l'application. Il peut également configurer des intercepteurs ou des gestionnaires d'erreurs spécifiques à Supabase.
*   **`services/authService.ts`**: Gère toute la logique liée à l'authentification des utilisateurs (connexion, inscription, déconnexion, réinitialisation de mot de passe, gestion des sessions) en interagissant directement avec l'API d'authentification de Supabase.
*   **`services/courseService.ts`**: Contient la logique métier pour la gestion des cours, des leçons, du suivi des progrès des utilisateurs, et des interactions avec la base de données Supabase pour les données relatives aux cours.
*   **`services/userService.ts`**: Gère les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) pour les profils utilisateurs, les paramètres, et d'autres données spécifiques à l'utilisateur dans la base de données Supabase.
*   **`types/database.types.ts`**: Ce fichier est généré automatiquement par la CLI Supabase à partir du schéma de la base de données. Il fournit des définitions de types TypeScript pour les tables, vues, fonctions et types personnalisés de la base de données, assurant une forte typisation des interactions avec la base de données.
*   **`context/AuthContext.tsx`**: Fournit un contexte React pour gérer l'état d'authentification de l'utilisateur à travers l'application. Il encapsule la logique d'authentification et rend les informations utilisateur et les fonctions d'authentification disponibles pour les composants enfants.

### 12.2. Bibliothèques Partagées (`libs/`)

*   **`libs/cms-utils/index.ts`**: Contient des fonctions utilitaires pour interagir avec un système de gestion de contenu (CMS), potentiellement pour parser ou formater du contenu. L'exemple montre des fonctions pour créer un client Supabase et pour parser/formater du JSON.
*   **`libs/logger/index.ts`**: Fournit une instance de logger configurée (utilisant `pino` et `pino-pretty`). Cette bibliothèque permet une journalisation centralisée et formatée des événements de l'application, utile pour le débogage et la surveillance.
*   **`libs/supabase-utils/assertData.ts`**: Une fonction utilitaire pour affirmer la présence de données et gérer les erreurs provenant des requêtes Supabase. Elle simplifie la gestion des réponses de l'API Supabase en levant des erreurs si les données sont nulles ou si une erreur Postgrest est présente.
*   **`libs/supabase-utils/result.ts`**: Définit un type `Result` (similaire à un `Either` ou `Option` en programmation fonctionnelle) pour encapsuler les résultats d'opérations qui peuvent réussir ou échouer. Cela encourage une gestion explicite des erreurs et des succès, améliorant la robustesse du code. La fonction `fromSupabase` est un adaptateur pour les réponses Supabase.

### 12.3. Backend (`apps/backend/supabase/`)

*   **`functions/placeholder.ts`**: Un exemple ou un point de départ pour les fonctions Edge Supabase. Ces fonctions sont des fonctions sans serveur écrites en TypeScript (exécutées avec Deno) qui peuvent être déployées sur Supabase pour étendre la logique backend.
*   **`migrations/20250719192903_remote_schema.sql`**: Un fichier de migration SQL. Ces fichiers contiennent des instructions SQL (DDL et DML) pour modifier le schéma de la base de données Supabase. Ils sont gérés par la CLI Supabase pour assurer des mises à jour de base de données versionnées et reproductibles.

## 13. État Actuel du Projet Supabase

Cette section présente un aperçu de l'état actuel du projet Supabase, obtenu via des requêtes directes à l'API Supabase. Ces informations sont dynamiques et reflètent la configuration et les données en temps réel.

### 13.1. Informations Générales

*   **URL du Projet**: `https://oqmllypaarqvabuvbqga.supabase.co`
*   **Clé Anonyme (Anon Key)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbWxseXBhYXJxdmFidXZicWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NDEzNzIsImV4cCI6MjA2NDUxNzM3Mn0.WgYEEB7Uc3KiBuMY-J5Nblr6KPQHCzTFGIxadCjY7rk`

### 13.2. Branches de Développement

Actuellement, aucune branche de développement Supabase n'est listée.

```json
[]
```

### 13.3. Tables de la Base de Données (`public` schema)

Le schéma `public` contient les tables suivantes, avec leurs colonnes, clés primaires et relations :

*   **`profiles`**:
    *   **Colonnes**: `id` (uuid, PK), `full_name` (text), `avatar_url` (text), `email` (text, unique), `level` (integer, default: 1), `xp` (integer, default: 0), `current_streak` (integer, default: 0), `last_completed_at` (timestamptz), `is_admin` (boolean, default: false), `created_at` (timestamptz, default: CURRENT_TIMESTAMP), `phone` (text), `profession` (text), `company` (text), `updated_at` (timestamptz, default: now())
    *   **Relations**: `profiles_id_fkey` -> `auth.users.id`
*   **`courses`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `title` (text), `description` (text), `slug` (text, unique), `cover_image_url` (text), `is_published` (boolean, default: false), `created_at` (timestamptz, default: CURRENT_TIMESTAMP), `updated_at` (timestamptz, default: CURRENT_TIMESTAMP), `category` (text), `thumbnail_url` (text), `difficulty` (text)
    *   **Relations**: `modules_course_id_fkey` -> `public.courses.id`
*   **`modules`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `course_id` (uuid), `title` (text), `description` (text), `module_order` (integer, check: > 0), `is_published` (boolean, default: false), `created_at` (timestamptz, default: CURRENT_TIMESTAMP), `updated_at` (timestamptz, default: CURRENT_TIMESTAMP)
    *   **Relations**: `modules_course_id_fkey` -> `public.courses.id`, `lessons_module_id_fkey` -> `public.modules.id`
*   **`lessons`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `module_id` (uuid), `title` (text), `content` (jsonb), `lesson_order` (integer, check: > 0), `is_published` (boolean, default: false), `created_at` (timestamptz, default: CURRENT_TIMESTAMP), `updated_at` (timestamptz, default: CURRENT_TIMESTAMP), `duration` (integer), `type` (USER-DEFINED: `lesson_type` enum: `video`, `text`, `quiz`, `exercise`), `video_url` (text), `transcript` (text), `text_content` (text), `resources` (jsonb, default: '[]', check: is array), `xp_reward` (integer, default: 0, check: >= 0)
    *   **Relations**: `lesson_analytics_lesson_id_fkey` -> `public.lessons.id`, `user_progress_lesson_id_fkey` -> `public.lessons.id`, `user_notes_lesson_id_fkey` -> `public.lessons.id`, `lessons_module_id_fkey` -> `public.modules.id`
*   **`user_progress`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `lesson_id` (uuid), `status` (text, check: `not_started`, `in_progress`, `completed`), `completed_at` (timestamptz), `created_at` (timestamptz, default: CURRENT_TIMESTAMP), `updated_at` (timestamptz, default: CURRENT_TIMESTAMP)
    *   **Relations**: `user_progress_user_id_fkey` -> `auth.users.id`, `user_progress_lesson_id_fkey` -> `public.lessons.id`
*   **`coupons`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `code` (text, unique), `discount_percent` (integer), `valid_from` (timestamptz, default: CURRENT_TIMESTAMP), `valid_to` (timestamptz), `is_active` (boolean, default: true), `max_uses` (integer), `current_uses` (integer, default: 0), `created_at` (timestamptz, default: CURRENT_TIMESTAMP)
    *   **Relations**: Aucune
*   **`activity_log`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `type` (text), `action` (text), `details` (jsonb, default: '{}'), `created_at` (timestamptz, default: now())
    *   **Relations**: `activity_log_user_id_fkey` -> `auth.users.id`
*   **`achievements`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `title` (text), `description` (text), `icon` (text), `rarity` (text, check: `common`, `uncommon`, `rare`, `epic`, `legendary`), `xp_reward` (integer, default: 0, check: >= 0), `earned` (boolean, default: true), `created_at` (timestamptz, default: CURRENT_TIMESTAMP)
    *   **Relations**: `achievements_user_id_fkey` -> `auth.users.id`
*   **`user_settings`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid, unique), `notification_settings` (jsonb, default: `{"weeklyReport": true, "achievementAlerts": true, "pushNotifications": false, "emailNotifications": true, "reminderNotifications": true}`), `privacy_settings` (jsonb, default: `{"showProgress": false, "allowMessages": false, "showAchievements": true, "profileVisibility": "private"}`), `learning_preferences` (jsonb, default: `{"autoplay": true, "language": "fr", "dailyGoal": 30, "preferredDuration": "medium", "difficultyProgression": "adaptive"}`), `created_at` (timestamptz, default: CURRENT_TIMESTAMP), `updated_at` (timestamptz, default: CURRENT_TIMESTAMP)
    *   **Relations**: `user_settings_user_id_fkey` -> `auth.users.id`
*   **`user_notes`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `lesson_id` (uuid), `content` (text), `selected_text` (text), `position` (jsonb, default: '{}'), `tags` (text[]), `is_private` (boolean, default: true), `created_at` (timestamptz, default: now()), `updated_at` (timestamptz, default: now())
    *   **Relations**: `user_notes_user_id_fkey` -> `auth.users.id`, `user_notes_lesson_id_fkey` -> `public.lessons.id`
*   **`media_files`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `filename` (text), `original_name` (text), `file_type` (text), `file_size` (bigint), `storage_path` (text, unique), `metadata` (jsonb, default: '{}'), `is_public` (boolean, default: false), `created_at` (timestamptz, default: now())
    *   **Relations**: `media_files_user_id_fkey` -> `auth.users.id`
*   **`user_sessions`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `started_at` (timestamptz, default: now()), `ended_at` (timestamptz), `duration_minutes` (integer), `pages_visited` (text[]), `device_info` (jsonb, default: '{}')
    *   **Relations**: `user_sessions_user_id_fkey` -> `auth.users.id`
*   **`lesson_analytics`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `lesson_id` (uuid), `user_id` (uuid), `started_at` (timestamptz, default: now()), `completed_at` (timestamptz), `time_spent_minutes` (integer), `completion_percentage` (integer, default: 0), `interactions` (jsonb, default: '{}')
    *   **Relations**: `lesson_analytics_lesson_id_fkey` -> `public.lessons.id`, `lesson_analytics_user_id_fkey` -> `auth.users.id`
*   **`rgpd_requests`**:
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `user_id` (uuid), `type` (USER-DEFINED: `rgpd_request_type` enum: `access`, `deletion`, `rectification`), `status` (USER-DEFINED: `rgpd_request_status` enum: `pending`, `processing`, `completed`, `rejected`), `details` (jsonb, default: '{}'), `created_at` (timestamptz, default: now()), `updated_at` (timestamptz, default: now()), `completed_at` (timestamptz)
    *   **Relations**: `rgpd_requests_user_id_fkey` -> `auth.users.id`
*   **`achievement_row_camel_type`** (Type template for AchievementRowCamel - used for TypeScript generation only):
    *   **Colonnes**: `id` (uuid, PK, default: gen_random_uuid()), `title` (text), `description` (text), `icon` (text), `rarity` (text), `earned` (boolean, default: false), `userId` (uuid), `xpReward` (integer, default: 0), `createdAt` (timestamptz, default: now())
    *   **Relations**: Aucune

### 13.4. Migrations de la Base de Données

Une migration a été appliquée au projet :

*   `20250719192903_remote_schema`

### 13.5. Extensions PostgreSQL

Plusieurs extensions PostgreSQL sont disponibles, dont certaines sont installées (`pg_net`, `pgcrypto`, `uuid-ossp`, `supabase_vault`, `pg_graphql`, `pg_stat_statements`, `plpgsql`).

### 13.6. Fonctions Edge (Deno)

Actuellement, aucune fonction Edge n'est déployée.

### 13.7. Conseils de Sécurité (Advisors)

Des problèmes de sécurité ont été détectés, principalement liés aux politiques de sécurité au niveau des lignes (RLS) et à la configuration de l'authentification. Il est fortement recommandé de revoir et de corriger ces points pour renforcer la sécurité du projet.

*   **`security_definer_view` (ERROR)**: Des vues sont définies avec `SECURITY DEFINER`, ce qui peut entraîner des fuites de permissions. (Ex: `public.user_course_progress`, `public.achievement_row_camel`)
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view)
*   **`function_search_path_mutable` (WARN)**: Des fonctions ont un `search_path` mutable, ce qui peut être une vulnérabilité. (Ex: `public.update_updated_at_column`, `public.update_user_profile`, `public.create_default_profile`, etc.)
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
*   **`rls_disabled_in_public` (ERROR)**: La RLS est désactivée sur la table `public.achievement_row_camel_type` alors qu'elle est publique.
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public)
*   **`rls_references_user_metadata` (ERROR)**: Les politiques RLS référencent `user_metadata` de manière non sécurisée, car `user_metadata` est éditable par les utilisateurs. (Ex: `public.profiles`, `public.courses`, `public.modules`, `public.lessons`)
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0015_rls_references_user_metadata](https://supabase.com/docs/guides/database/database-linter?lint=0015_rls_references_user_metadata)
*   **`auth_leaked_password_protection` (WARN)**: La protection contre les mots de passe divulgués est désactivée.
    *   **Remédiation**: [https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
*   **`auth_insufficient_mfa_options` (WARN)**: Trop peu d'options MFA sont activées.
    *   **Remédiation**: [https://supabase.com/docs/guides/auth/auth-mfa](https://supabase.com/docs/guides/auth/auth-mfa)

### 13.8. Conseils de Performance (Advisors)

Plusieurs avertissements de performance ont été identifiés, principalement liés à l'évaluation des politiques RLS.

*   **`auth_rls_initplan` (WARN)**: Les appels à `current_setting()` et `auth.<function>()` dans les politiques RLS sont réévalués inutilement pour chaque ligne, ce qui impacte la performance à grande échelle. (Concerne de nombreuses tables comme `profiles`, `courses`, `modules`, `lessons`, `user_progress`, `coupons`, `activity_log`, `achievements`, `user_settings`, `user_notes`, `media_files`, `user_sessions`, `lesson_analytics`, `rgpd_requests`)
    *   **Remédiation**: [https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)
*   **`unused_index` (INFO)**: Plusieurs index ne sont pas utilisés et pourraient être supprimés pour améliorer les performances. (Ex: `user_notes_user_id_idx`, `media_files_created_at_idx`, `idx_profiles_admin`, etc.)
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)
*   **`multiple_permissive_policies` (WARN)**: Plusieurs politiques RLS permissives pour le même rôle et la même action sur une table peuvent dégrader les performances. (Concerne de nombreuses tables comme `achievements`, `activity_log`, `coupons`, `courses`, `lesson_analytics`, `lessons`, `media_files`, `modules`, `profiles`, `rgpd_requests`, `user_notes`, `user_progress`, `user_sessions`, `user_settings`)
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies)
*   **`duplicate_index` (WARN)**: Des index identiques existent sur certaines tables, ce qui est redondant et peut impacter la performance. (Ex: `public.courses` (`courses_slug_key`, `courses_slug_unique`), `public.user_notes` (`idx_user_notes_lesson_id`, `user_notes_lesson_id_idx`), `public.user_progress` (`user_progress_user_id_lesson_id_key`, `user_progress_user_lesson_unique`))
    *   **Remédiation**: [https://supabase.com/docs/guides/database/database-linter?lint=0009_duplicate_index](https://supabase.com/docs/guides/database/database-linter?lint=0009_duplicate_index)

## 14. Interaction avec Supabase via les Outils AI

En tant qu'agent AI, je dispose d'un ensemble d'outils spécifiques pour interagir directement avec les services Supabase, ce qui me permet de comprendre, de diagnostiquer et d'assister dans les tâches liées à la base de données, à l'authentification, aux fonctions Edge, et plus encore. La présence du fichier `.mcp.json` dans le dépôt confirme et configure ces capacités.

Mes capacités d'interaction avec Supabase incluent, mais ne se limitent pas à :

*   **Gestion des Branches de Développement**:
    *   `create_branch`: Créer une nouvelle branche de développement Supabase.
    *   `list_branches`: Lister toutes les branches de développement existantes.
    *   `delete_branch`: Supprimer une branche de développement.
    *   `merge_branch`: Fusionner les migrations et fonctions Edge d'une branche de développement vers la production.
    *   `reset_branch`: Réinitialiser les migrations d'une branche de développement.
    *   `rebase_branch`: Rebaser une branche de développement sur la production.

*   **Opérations sur la Base de Données**:
    *   `list_tables`: Lister toutes les tables dans un ou plusieurs schémas.
    *   `list_extensions`: Lister toutes les extensions de la base de données.
    *   `list_migrations`: Lister toutes les migrations appliquées à la base de données.
    *   `apply_migration`: Appliquer une migration SQL (pour les opérations DDL).
    *   `execute_sql`: Exécuter des requêtes SQL brutes (pour les opérations DML ou de lecture).

*   **Gestion des Fonctions Edge**:
    *   `list_edge_functions`: Lister toutes les fonctions Edge déployées.
    *   `deploy_edge_function`: Déployer une nouvelle fonction Edge ou mettre à jour une existante.

*   **Surveillance et Diagnostic**:
    *   `get_logs`: Récupérer les logs pour différents services Supabase (API, Postgres, Edge Functions, Auth, Storage, Realtime) pour le débogage.
    *   `get_advisors`: Obtenir des avis de sécurité ou de performance pour le projet Supabase.

*   **Informations sur le Projet**:
    *   `get_project_url`: Obtenir l'URL de l'API du projet.
    *   `get_anon_key`: Obtenir la clé API anonyme du projet.
    *   `generate_typescript_types`: Générer les types TypeScript à partir du schéma de la base de données.

*   **Recherche Documentaire**:
    *   `search_docs`: Rechercher dans la documentation Supabase via GraphQL pour obtenir des informations détaillées sur les fonctionnalités, les erreurs, les CLI commands, etc.

Ces outils me permettent d'interagir de manière programmatique et sécurisée avec votre projet Supabase, facilitant ainsi les tâches de développement, de débogage et de maintenance directement depuis cette interface.