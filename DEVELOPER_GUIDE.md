# Guide du Développeur - IA Foundations LMS

## Table des matières
- [Commandes Principales](#commandes-principales-racine-du-projet)
  - [Développement](#développement)
  - [Tests](#tests)
  - [Qualité de Code](#qualité-de-code)
  - [Base de Données](#base-de-données-supabase)
  - [Utilitaires](#utilitaires)
- [Frontend](#frontend)
  - [Développement](#développement-1)
  - [Tests](#tests-1)
  - [Build](#build)
- [Backend](#backend)
  - [Développement](#développement-2)
  - [Base de Données](#base-de-données)
  - [Migrations](#migrations)
  - [Qualité de Code](#qualité-de-code-1)
- [Workflows Recommandés](#workflows-recommandés)

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

#### `pnpm start`
**Alias** : `pnpm dev`

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
**Description** : Exécute les tests unitaires du frontend.  
**Dossier** : `/` (racine du projet)  
**Terminal** : Terminal de test  
**Quand l'utiliser** :
- Après des modifications de logique métier
- Avant de créer une Pull Request
- En continu pendant le développement avec `--watch`

#### `pnpm test:backend`
**Description** : Exécute les tests du backend.  
**Dossier** : `/` (racine du projet)  
**Quand l'utiliser** :
- Pour tester la logique côté serveur
- Avant de déployer des changements d'API

#### `pnpm test:all`
**Description** : Exécute tous les tests (frontend et backend).  
**Dossier** : `/` (racine du projet)  
**Quand l'utiliser** :
- Avant de pousser des changements majeurs
- En préparation d'une release

#### `pnpm test:output`
**Description** : Exécute les tests et sauvegarde les résultats dans un fichier JSON.  
**Dossier** : `/` (racine du projet)  
**Fichier de sortie** : `test-results.json`  
**Quand l'utiliser** :
- Pour analyser les résultats des tests plus en détail
- Pour partager les résultats avec l'équipe

### Qualité de Code

#### `pnpm lint`
**Description** : Vérifie le code avec ESLint.  
**Dossier** : `/` (racine du projet)  
**Quand l'utiliser** :
- Avant chaque commit
- Après avoir résolu des conflits Git
- En continu dans l'IDE

#### `pnpm typecheck`
**Description** : Vérifie les types TypeScript.  
**Dossier** : `/` (racine du projet)  
**Quand l'utiliser** :
- Après des modifications de types
- Avant de pousser du code
- En cas d'erreurs de compilation

#### `pnpm format`
**Description** : Formate le code avec Prettier.  
**Dossier** : `/` (racine du projet)  
**Quand l'utiliser** :
- Avant chaque commit
- Après avoir collé du code
- Pour uniformiser le style de code

#### `pnpm validate`
**Description** : Exécute le linting et les tests.  
**Quand l'utiliser** :
- Avant de pousser du code
- Pour s'assurer que tout est valide

### Base de Données (Supabase)

#### `pnpm db:pull`
**Description** : Télécharge le schéma de la base de données distante.  
**Quand l'utiliser** :
- Après des changements de schéma en production
- Pour synchroniser l'environnement local avec la production

#### `pnpm db:push`
**Description** : Pousse les changements de schéma local vers la base de données.  
**Quand l'utiliser** :
- Après avoir créé des migrations locales
- Pour appliquer des changements de schéma

#### `pnpm migration:new`
**Description** : Crée une nouvelle migration.  
**Quand l'utiliser** :
- Après chaque modification du schéma de base de données

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

### Tests

#### `pnpm --filter frontend test:ui`
**Description** : Lance l'interface utilisateur de test.  
**Quand l'utiliser** :
- Pour déboguer visuellement les tests
- Pour examiner l'état du DOM pendant les tests

#### `pnpm --filter frontend test:coverage`
**Description** : Génère un rapport de couverture de code.  
**Quand l'utiliser** :
- Pour identifier le code non testé
- Avant une revue de code

### Build

#### `pnpm --filter frontend build`
**Description** : Construit l'application pour la production.  
**Options** :
- `--sourcemap` : Génère des source maps pour le débogage
- `--mode analyze` : Génère un rapport d'analyse du bundle

## Backend

### Développement

#### `pnpm --filter supabase-backend dev`
**Description** : Lance le serveur de développement backend avec rechargement à chaud.  
**Quand l'utiliser** :
- Pendant le développement du backend
- Pour tester des changements d'API

### Base de Données

#### `pnpm --filter supabase-backend db:start`
**Description** : Démarre les services Supabase localement.  
**Quand l'utiliser** :
- Pour travailler avec une base de données locale
- Pour tester des migrations

#### `pnpm --filter supabase-backend db:status`
**Description** : Affiche l'état des services Supabase.  
**Quand l'utiliser** :
- Pour vérifier que tout est correctement démarré
- En cas de problèmes de connexion

### Migrations

#### `pnpm --filter supabase-backend migration:up`
**Description** : Applique les migrations en attente.  
**Quand l'utiliser** :
- Après avoir créé une nouvelle migration
- Après un `git pull` avec de nouvelles migrations

#### `pnpm --filter supabase-backend migration:down`
**Description** : Annule la dernière migration.  
**Quand l'utiliser** :
- Pour annuler une migration problématique
- Pour revenir à une version antérieure du schéma

### Qualité de Code

#### `pnpm --filter supabase-backend lint`
**Description** : Vérifie le code TypeScript du backend.  
**Quand l'utiliser** :
- Avant de pousser du code
- Pour maintenir la qualité du code

## Workflows Recommandés

### Démarrage d'une Nouvelle Fonctionnalité
```bash
# Terminal 1 - Backend
pnpm --filter supabase-backend db:start
pnpm --filter supabase-backend dev

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

### Problèmes de Dépendances
```bash
# Nettoyer et réinstaller
pnpm clean
pnpm install
```

### Problèmes de Base de Données
```bash
# Redémarrer les services
pnpm db:stop
pnpm db:start

# Réinitialiser la base de données (attention : supprime les données)
pnpm db:reset
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
