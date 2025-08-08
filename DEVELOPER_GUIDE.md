# Guide du Développeur - IA Foundations LMS

## Table des matières
- [Prérequis](#prérequis)
- [Commandes Principales (Racine du Projet)](#commandes-principales-racine-du-projet)
  - [Développement](#développement)
  - [Tests](#tests)
  - [Qualité de Code](#qualité-de-code)
  - [Base de Données Supabase](#base-de-données-supabase)
  - [Utilitaires](#utilitaires)
- [Frontend](#frontend)
  - [Développement](#développement-1)
  - [Tests](#tests-1)
  - [Build](#build)
- [Backend](#backend)
  - [Développement](#développement-2)
  - [Base de Données](#base-de-données)
  - [Migrations](#migrations)
- [Workflows Recommandés](#workflows-recommandés)
- [Dépannage](#dépannage)

## Prérequis

- Node.js 18+
- pnpm 8+
- Supabase CLI
- Docker (pour Supabase en local)

## Commandes Principales (Racine du Projet)

### Développement

#### `pnpm dev`
**Description** : Lance le frontend en mode développement.  
**Port** : 5173 par défaut  
**Quand l'utiliser** :
- Pour démarrer le développement frontend
- Après avoir cloné le dépôt (après `pnpm install`)

#### `pnpm start`
**Alias** : `pnpm dev`

#### `pnpm build`
**Description** : Construit l'application frontend pour la production.  
**Dossier de sortie** : `apps/frontend/dist`  
**Quand l'utiliser** :
- Avant un déploiement en production
- Pour tester la version de production localement

#### `pnpm preview`
**Description** : Prévoyez l'application frontend en production localement.  
**Prérequis** : Avoir exécuté `pnpm build` au préalable  
**Quand l'utiliser** :
- Pour tester la version de production localement
- Avant de déployer pour vérifier le rendu final

### Tests

#### `pnpm test`
**Description** : Exécute les tests unitaires du frontend.  
**Options** :
- `--watch` : Exécute les tests en mode watch
- `--coverage` : Génère un rapport de couverture
- `--ui` : Lance l'interface utilisateur de test

#### `pnpm test:watch`
**Description** : Exécute les tests en mode watch.  
**Quand l'utiliser** :
- Pendant le développement pour un retour immédiat
- Pour déboguer des tests spécifiques

#### `pnpm test:coverage`
**Description** : Génère un rapport de couverture de code.  
**Dossier de sortie** : `coverage/`  
**Quand l'utiliser** :
- Avant une PR pour vérifier la couverture des tests
- Pour identifier le code non testé

#### `pnpm test:output`
**Description** : Exécute les tests et sauvegarde les résultats dans un fichier JSON.  
**Fichier de sortie** : `apps/frontend/test-results.json`  
**Quand l'utiliser** :
- Pour l'intégration continue
- Pour analyser les résultats des tests

### Qualité de Code

#### `pnpm lint`
**Description** : Vérifie le code avec ESLint.  
**Quand l'utiliser** :
- Avant chaque commit
- Après avoir résolu des conflits Git
- En continu dans l'IDE

#### `pnpm typecheck`
**Description** : Vérifie les types TypeScript.  
**Quand l'utiliser** :
- Après des modifications de types
- Avant de pousser du code
- Pour détecter les erreurs de typage

#### `pnpm format`
**Description** : Formate le code avec Prettier.  
**Quand l'utiliser** :
- Avant chaque commit
- Pour maintenir un style de code cohérent
- Automatiquement via les hooks Git (recommandé)

### Base de Données Supabase (Cloud-First)

#### Configuration requise
Avant d'utiliser les commandes Supabase, assurez-vous d'avoir configuré ces variables d'environnement :
- `SUPABASE_URL` : L'URL de votre projet Supabase
- `SUPABASE_ANON_KEY` : La clé anonyme de votre projet
- `SUPABASE_PROJECT_REF` : La référence de votre projet (trouvable dans l'URL du dashboard Supabase)

#### `pnpm gen:types`
**Description** : Génère les types TypeScript à partir du schéma de la base de données cloud.  
**Fichier de sortie** : `apps/frontend/src/types/database.types.ts`  
**Prérequis** : 
- Être connecté à Supabase CLI (`supabase login`)
- Avoir les variables d'environnement configurées

**Quand l'utiliser** :
- Après des changements de schéma dans la base de données cloud
- Pour mettre à jour les types côté frontend

**Exemple** :
```bash
# Se connecter à Supabase CLI (une seule fois)
supabase login

# Générer les types
pnpm gen:types
```

### Utilitaires

#### `pnpm clean`
**Description** : Nettoie les dossiers `node_modules`.  
**Quand l'utiliser** :
- En cas d'erreurs étranges de dépendances
- Pour libérer de l'espace disque

#### `pnpm reset`
**Description** : Réinitialise complètement le projet.  
**Quand l'utiliser** :
- Après un changement de branche majeur
- En cas de problèmes avec les dépendances

## Frontend

### Développement

#### `pnpm --filter frontend dev`
**Description** : Lance le serveur de développement frontend.  
**Port** : 5173 par défaut  
**Options** :
- `--host` : Écoute sur toutes les interfaces réseau
- `--port` : Spécifie un port personnalisé
- `--open` : Ouvre automatiquement dans le navigateur

### Tests

#### `pnpm --filter frontend test`
**Description** : Exécute les tests unitaires.  
**Options** :
- `--watch` : Exécute en mode watch
- `--ui` : Lance l'interface utilisateur de test
- `--coverage` : Génère un rapport de couverture

#### `pnpm --filter frontend test:output`
**Description** : Exécute les tests et sauvegarde les résultats dans un fichier JSON.  
**Fichier de sortie** : `test-results.json`  
**Quand l'utiliser** :
- Pour l'intégration continue
- Pour analyser les résultats des tests

### Build

#### `pnpm --filter frontend build`
**Description** : Construit l'application pour la production.  
**Dossier de sortie** : `dist/`  
**Options** :
- `--sourcemap` : Génère des source maps pour le débogage
- `--mode analyze` : Génère un rapport d'analyse du bundle

#### `pnpm --filter frontend preview`
**Description** : Prévoyez l'application en production localement.  
**Prérequis** : Avoir exécuté `pnpm build` au préalable

## Backend

### Développement avec Supabase Cloud

#### `pnpm --filter backend gen:types`
**Description** : Génère les types TypeScript à partir du schéma de la base de données cloud.  
**Fichier de sortie** : `apps/frontend/src/types/database.types.ts`  

**Prérequis** : 
1. Installer Supabase CLI : `npm install -g supabase`
2. Se connecter : `supabase login`
3. Configurer les variables d'environnement :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_PROJECT_REF`

**Quand l'utiliser** :
- Après des modifications du schéma dans l'interface web de Supabase
- Pour synchroniser les types TypeScript avec la structure actuelle de la base de données

**Exemple** :
```bash
# Générer les types
pnpm gen:types

# Ou directement avec la référence du projet
SUPABASE_PROJECT_REF=votre-ref-projet pnpm gen:types
```

### Gestion des migrations (Cloud-First)

En mode cloud-first, les migrations sont gérées directement via l'interface web de Supabase :
1. Connectez-vous à [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans l'onglet "Table Editor" pour gérer vos tables
4. Utilisez l'interface pour créer/modifier les tables
5. Exécutez `pnpm gen:types` pour mettre à jour les types TypeScript

## Workflows Recommandés

### Démarrage d'une Nouvelle Fonctionnalité
```bash
# Terminal 1 - Backend
pnpm --filter backend db:start
pnpm --filter backend dev

# Terminal 2 - Frontend
pnpm dev

# Terminal 3 - Tests
pnpm test:watch
```

### Préparation d'un Commit
```bash
# Vérifier la qualité du code
pnpm validate
pnpm format
pnpm lint
pnpm typecheck

# Exécuter les tests
pnpm test:all
```

### Mise à Jour du Schéma de Base de Données
```bash
# Créer une nouvelle migration
pnpm migration:new add_users_table

# Appliquer la migration
pnpm migration:up

# Générer les types TypeScript
pnpm gen:types
```

## Dépannage

### Problèmes courants

#### Les types ne sont pas mis à jour
```bash
# 1. Vérifiez que vous êtes connecté à Supabase CLI
supabase status

# 2. Vérifiez les variables d'environnement
echo $SUPABASE_PROJECT_REF
echo $SUPABASE_URL

# 3. Générez les types avec plus de verbosité
SUPABASE_DEBUG=1 pnpm gen:types
```

#### Problèmes d'authentification
```bash
# Vérifiez que vous êtes connecté
supabase status

# Si non connecté, connectez-vous
supabase login

# Vérifiez que vous avez les bonnes permissions sur le projet
```

#### Problèmes de connexion à la base de données
```bash
# Vérifiez que les variables d'environnement sont définies
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Testez la connexion avec curl
curl -s "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_ANON_KEY"
```

#### Problèmes avec les dépendances
```bash
# Supprimez le dossier node_modules et le fichier pnpm-lock.yaml
rm -rf node_modules pnpm-lock.yaml
rm -rf apps/frontend/node_modules
rm -rf apps/backend/node_modules

# Réinstallez les dépendances
pnpm install
```

#### Problèmes avec les tests
```bash
# Exécutez les tests en mode debug
pnpm test --debug

# Exécutez un test spécifique
pnpm test path/to/test/file.test.ts
```

### Problèmes de Cache
```bash
# Supprimer les dossiers de cache
rm -rf node_modules/.vite
rm -rf node_modules/.cache
```

## Bonnes Pratiques

1. **Avant chaque commit** :
   - Exécutez `pnpm validate`
   - Vérifiez que tous les tests passent
   - Formatez le code avec `pnpm format`

2. **Gestion des Dépendances** :
   - Mettez à jour régulièrement avec `pnpm update`
   - Vérifiez les vulnérabilités avec `pnpm audit`

3. **Base de Données** :
   - Créez toujours des migrations pour les changements de schéma
   - Testez les migrations en local avant de les pousser
   - Sauvegardez régulièrement avec `pnpm db:dump`

4. **Développement** :
   - Utilisez `pnpm dev` pour le développement frontend
   - Utilisez `pnpm --filter supabase-backend dev` pour le backend
   - Gardez un terminal ouvert pour les tests en continu

## Contribution

1. Créez une branche pour votre fonctionnalité
2. Ajoutez des tests pour vos changements
3. Mettez à jour la documentation si nécessaire
4. Soumettez une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).
