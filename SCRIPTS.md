# Documentation des Commandes

## Commandes Principales (Racine du Projet)

### Développement

#### `pnpm dev`

**Description** : Lance l'application frontend en mode développement.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal principal du projet  
**Quand l'utiliser** :

- Au démarrage d'une session de développement
- Après avoir cloné le dépôt pour la première fois (après `pnpm install`)
- Après avoir changé de branche Git

#### `pnpm build`

**Description** : Construit l'application pour la production.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de build/CI  
**Quand l'utiliser** :

- Avant un déploiement en production
- Pour tester la version de production localement
- Pour vérifier les erreurs de build

#### `pnpm preview`

**Description** : Prévoyez l'application en production localement.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal secondaire  
**Prérequis** : Avoir exécuté `pnpm build` au préalable  
**Quand l'utiliser** :

- Pour tester la version de production localement
- Avant de déployer pour vérifier le rendu final

### Tests

#### `pnpm test`

**Description** : Exécute les tests unitaires avec Vitest.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de test  
**Quand l'utiliser** :

- Après des modifications de logique métier
- Avant de créer une Pull Request
- En continu pendant le développement avec `--watch`

#### `pnpm test:output`

**Description** : Exécute les tests et sauvegarde les résultats dans un fichier JSON.  
**Dossier** : `/` (racine du projet)  
**Fichier de sortie** : `test-results.json`  
**Quand l'utiliser** :

- Quand la sortie du terminal est trop longue
- Pour analyser les résultats des tests plus en détail
- Pour partager les résultats avec l'équipe

### Qualité de Code

#### `pnpm lint`

**Description** : Vérifie le code avec ESLint.  
**Dossier** : `/` (racine du projet)  
**Terminal** : N'importe quel terminal  
**Quand l'utiliser** :

- Avant chaque commit
- Après avoir résolu des conflits Git
- En continu dans l'IDE

#### `pnpm typecheck`

**Description** : Vérifie les types TypeScript.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de vérification  
**Quand l'utiliser** :

- Après des modifications de types
- Avant de pousser du code
- En cas d'erreurs de compilation

#### `pnpm format`

**Description** : Formate le code avec Prettier.  
**Dossier** : `/` (racine du projet)  
**Terminal** : N'importe quel terminal  
**Quand l'utiliser** :

- Avant chaque commit
- Après avoir collé du code
- Pour uniformiser le style de code

### Base de Données (Supabase)

#### `pnpm db:pull`

**Description** : Synchronise le schéma local avec Supabase cloud.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de base de données  
**Quand l'utiliser** :

- Après avoir modifié la structure via l'éditeur SQL web
- Après un `git pull` qui inclut des migrations
- Pour récupérer les changements d'autres développeurs

#### `pnpm db:push`

**Description** : Pousse les migrations locales vers Supabase.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de base de données  
**Attention** : Utiliser avec extrême prudence en production  
**Quand l'utiliser** :

- Après avoir créé des migrations locales
- Uniquement en développement
- Jamais directement en production

#### `pnpm migration:new`

**Description** : Crée un nouveau fichier de migration.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de base de données  
**Quand l'utiliser** :

- Avant de modifier la structure de la base
- Pour documenter des changements manuels
- Pour créer des seeds de données

#### `pnpm gen:types`

**Description** : Génère les types TypeScript du schéma.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de base de données  
**Quand l'utiliser** :

- Après `db:pull`
- Après des modifications de la structure de la base
- Avant d'utiliser de nouvelles tables/colonnes dans le code

### Utilitaires

#### `pnpm prepare`

**Description** : Configure les hooks Git avec Husky.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal d'initialisation  
**Quand l'exécuter** :

- Après le clonage du dépôt
- Après un `git pull` qui met à jour les hooks
- Si les hooks Git ne fonctionnent pas

#### `pnpm validate:env`

**Description** : Valide les variables d'environnement.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de configuration  
**Quand l'utiliser** :

- Après avoir modifié `.env`
- En cas d'erreurs au démarrage
- Avant le déploiement

## Workflow Recommandé

### Configuration Initiale

```bash
# Dans le dossier racine du projet
pnpm install          # Installe les dépendances
cp .env.example .env  # Configure l'environnement
pnpm prepare         # Configure les hooks Git
```

### Développement Quotidien

```bash
# Terminal 1 - Développement
pnpm dev

# Terminal 2 - Tests
pnpm test --watch

# Terminal 3 - Base de données
pnpm db:pull
pnpm gen:types
```

### Avant Commit

```bash
# Dans le dossier racine
pnpm format
pnpm lint
pnpm typecheck
pnpm test
```

## Configuration Requise

- **Node.js** : >=18.0.0 (utiliser `nvm use` si installé)
- **pnpm** : >=9.0.0 (`npm install -g pnpm`)
- **Base de données** : Accès au projet Supabase cloud
- **Variables d'environnement** : Fichier `.env` correctement configuré
