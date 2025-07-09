# 🚀 Guide Ultime Supabase - AI Foundations

**Votre source de vérité unique** pour synchroniser parfaitement votre environnement local, GitHub et Supabase Cloud. Conçu spécifiquement pour le projet AI Foundations.

## 📌 Table des matières

1. [Les 3 Règles d'Or](#-les-3-règles-dor)
2. [Configuration Initiale](#-configuration-initiale)
3. [Commandes Essentielles](#-commandes-essentielles)
4. [Workflows Complets](#-workflows-complets)
5. [Gestion des Types TypeScript](#-gestion-des-types-typescript)
6. [Dépannage](#-dépannage)
7. [Automatisation & Astuces](#-automatisation--astuces)
8. [Scripts d'initialisation](#-scripts-dinitialisation)

## 🛡️ Les 3 Règles d'Or

1. **La Base en Ligne est la Source** :
   - La base Supabase Cloud est la **référence principale** pour le schéma
   - `pnpm db:pull` sert à synchroniser le dossier `/apps/backend/supabase/migrations`

2. **Les Types Suivent le Schéma** :
   - `apps/frontend/src/types/database.types.ts` doit TOUJOURS être à jour après chaque modification
   - C'est le pont vital entre votre base de données et votre code React

3. **Tout est Versionné** :
   - Chaque modification de schéma doit être commitée sur Git
   - Aucun changement ne doit rester uniquement sur le cloud ou une machine locale

## ⚙️ Configuration Initiale

### 1. Installation des outils

```bash
# Dans le dossier racine du projet
cd .

# Installation de la CLI Supabase (si pas déjà fait)
npm install -g supabase

# Vérification de l'installation
supabase --version

# Connexion à votre compte Supabase
supabase login
```

### 2. Configuration du Projet Local

```bash
# Se placer dans le dossier backend
cd apps/backend

# Lier le projet à votre instance Supabase (première fois uniquement)
pnpm exec supabase link --project-ref votre-reference-projet

# Démarrer l'environnement local (utilise Docker)
pnpm db:start
```

Préparez ensuite le fichier `.env` à la racine :

```bash
cp .env.example .env
# Renseignez SUPABASE_PROJECT_REF, SUPABASE_ACCESS_TOKEN,
# SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_PASSWORD et SUPABASE_JWT_SECRET
```

- `SUPABASE_PROJECT_REF` : identifiant du projet Supabase
- `SUPABASE_ACCESS_TOKEN` : token personnel pour la CLI
- `SUPABASE_SERVICE_ROLE_KEY` : clé service_role
- `SUPABASE_DB_PASSWORD` : mot de passe PostgreSQL

> **Sécurité** : si l'une de ces clés est exposée (commit Git, capture d'écran,
> etc.), révoquez-la immédiatement dans le tableau de bord Supabase et
> générez-en une nouvelle. Ne comptez pas uniquement sur le nettoyage de
> l'historique Git pour protéger vos données.

## 🎯 Commandes Essentielles

Toutes les commandes suivantes se lancent depuis le dossier `apps/backend`.

| Commande        | Description                               |
| --------------- | ----------------------------------------- |
| `pnpm db:start` | Démarrer l'environnement local            |
| `pnpm db:reset` | Réinitialiser complètement la base locale |

| `pnpm db:pull` | Synchroniser le dossier `migrations` depuis Supabase Cloud |
| `pnpm db:push` | Appliquer vos migrations sur Supabase Cloud |

| `pnpm gen:types` | Générer les types TypeScript |

## 🔄 Workflows Complets

### A. Développement Local (Recommandé)

1. **Démarrer l'environnement**

   ```bash
   cd apps/backend
   pnpm db:start
   ```

2. **Synchroniser avec la base en ligne**

   ```bash
   pnpm db:pull
   ```

3. **Créer une migration**

   ```bash
   pnpm exec supabase migration new nom_descriptif
   # Éditez le fichier créé dans supabase/migrations/
   ```

4. **Tester la migration**

   ```bash
   pnpm db:reset
   ```

5. **Mettre à jour les types**

   ```bash
   pnpm gen:types
   ```

6. **Déployer en production**
   ```bash
   pnpm db:push # exceptionnel
   ```

### B. Quand un collègue a fait des changements

1. **Récupérer les changements**

   ```bash
   git pull
   cd apps/backend
   pnpm install
   ```

2. **Synchroniser les migrations**

   ```bash
   pnpm db:pull
   ```

3. **Mettre à jour votre base locale**

   ```bash
   pnpm db:reset
   ```

4. **Générer les nouveaux types**
   ```bash
   pnpm gen:types
   ```

## 📝 Gestion des Types TypeScript

Après CHAQUE modification de la structure de la base de données :

```bash
# Depuis le dossier backend
pnpm gen:types
```

Ce script exécute :

````bash
supabase gen types typescript --local > ../frontend/src/types/database.types.ts

**IMPORTANT** : Ces types sont utilisés par votre application React pour un typage fort. Sans cette étape, TypeScript ne connaîtra pas vos nouvelles tables/champs.

## 🔄 Workflow de synchronisation

Exécutez les commandes suivantes depuis le dossier `apps/backend`.

### 1. Depuis l'interface web vers le local

```bash
# Se placer dans le dossier backend
cd apps/backend
# 1. Récupérer les dernières modifications
supabase db pull

# 2. Vérifier les changements
git diff

# 3. Créer une migration à partir des changements
supabase migration new nom_de_la_migration

# 4. Vérifier que tout fonctionne en local
pnpm db:reset
````

### 2. Du local vers l'interface web

```bash
# Se placer dans le dossier backend
cd apps/backend
# 1. Appliquer les migrations locales (opération exceptionnelle)
pnpm db:push

# 2. Vérifier dans l'interface web que tout est à jour
```

### 3. Gestion des conflits

En cas de conflit de schéma :

1. Sauvegarder l'état actuel :

   ```bash
   supabase db dump -f backup_avant_conflit.sql
   ```

2. Fusionner manuellement les schémas

3. Appliquer la fusion :
   ```bash
   pnpm db:reset
   ```

## Récupérer la base locale depuis Supabase Cloud

Quand votre environnement local devient instable ou si vous souhaitez repartir sur une base propre, exécutez les commandes suivantes depuis `apps/backend` :

```bash
pnpm db:reset
pnpm db:pull
```

La première commande vide la base locale, la seconde télécharge le schéma stocké sur Supabase Cloud. Après chaque synchronisation, pensez à régénérer les types TypeScript :

```bash
pnpm gen:types
```

## 🐛 Dépannage

### 1. Erreurs de Connexion

```bash
# Vérifier que Supabase est bien démarré
pnpm db:status

# Voir les logs
docker logs -f ai-foundations-supabase-cli
```

Le niveau de log par défaut est `info` (modifiable via `LOG_LEVEL` dans `.env`).

### 2. Problèmes de Migrations

```bash
# Voir l'état des migrations
pnpm exec supabase migration list

# Forcer une réinitialisation (attention aux données locales !)
pnpm db:reset --force
```

### 3. Types Obsolètes

Si TypeScript se plaint de types manquants :

1. Arrêtez votre serveur de développement
2. `pnpm gen:types`
3. Redémarrez le serveur

## 🤖 Automatisation & Astuces

### Hooks Git (Optionnel mais Recommandé)

Ajoutez ceci à `.git/hooks/pre-commit` :

```bash
#!/bin/sh

# Vérifier si des migrations non commitées existent
if [ -n "$(git ls-files --others --exclude-standard supabase/migrations/)" ]; then
    echo "⚠️  Attention : Des migrations non suivies par Git ont été détectées !"
    echo "   Utilisez 'git add' pour les ajouter avant de commiter."
    exit 1
fi

exit 0
```

### Script de Synchronisation Rapide

Créez un fichier `sync.sh` dans le dossier backend :

```bash
#!/bin/bash

# Synchronisation complète
if [ "$1" = "--full" ]; then
    echo "🔄 Synchronisation complète..."
    git pull
    pnpm install
    pnpm db:reset
    pnpm gen:types
    exit 0
fi

# Mise à jour rapide
if [ "$1" = "--quick" ]; then
    echo "⚡ Mise à jour rapide..."
    git pull
    pnpm db:reset
    exit 0
fi

echo "Utilisation :"
echo "  ./sync.sh --full   # Synchronisation complète"
echo "  ./sync.sh --quick  # Mise à jour rapide"
```

Rendez-le exécutable :

```bash
chmod +x sync.sh
```

## 📞 Support

Pour toute question ou problème :

1. Vérifiez d'abord les logs avec `docker logs`
2. Consultez [la documentation officielle](https://supabase.com/docs)
3. Si le problème persiste, contactez l'équipe avec les logs d'erreur

---

Dernière mise à jour : 22/06/2025

## ✅ Bonnes pratiques

1. **Toujours utiliser des migrations**
   - Créez une migration pour chaque modification de schéma
   - Nommez clairement les migrations (ex: `20230101_ajout_table_utilisateurs.sql`)

2. **Synchronisation régulière**

   ```bash
   # Avant de commencer à travailler
   git pull
   supabase db pull

    # Après des modifications (opération exceptionnelle)
    pnpm db:push
   git add .
   git commit -m "feat: mise à jour du schéma pour la fonctionnalité X"
   git push
   ```

3. **Documentation**
   - Mettez à jour ce fichier README avec les procédures spécifiques
   - Documentez les étapes de migration complexes

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de permission**

   ```bash
   # Régénérer le schéma de type
   supabase gen types typescript --linked > types/database.types.ts
   ```

2. **Conflits de schéma**

   ```bash
   # Voir les différences
   supabase db diff

   # Forcer une synchronisation (attention aux pertes de données)
   pnpm db:reset --force
   ```

3. **Problèmes de connexion**

   ```bash
   # Vérifier la configuration
   supabase status

   # Redémarrer les services
   supabase stop
   supabase start
   ```

## 🤖 Automatisation

### Script de synchronisation

Créez un fichier `scripts/sync-supabase.sh` :

```bash
#!/bin/bash

# Synchronise avec Supabase. Sans argument, lance un `pull`.
if [ -z "$1" ] || [ "$1" = "--pull" ]; then
    echo "🔄 Récupération des dernières modifications..."
    supabase db pull
    exit 0
fi

# Pousser les modifications locales (usage exceptionnel)
if [ "$1" = "--push" ]; then
    echo "🚀 Envoi des modifications (opération exceptionnelle)..."
    pnpm db:push
    exit 0
fi

echo "Usage: $0 [--pull|--push]"
exit 1
```

Rendez-le executable :

```bash
chmod +x scripts/sync-supabase.sh
```

Utilisation rapide :

```bash
./scripts/sync-supabase.sh         # Récupérer les modifications
./scripts/sync-supabase.sh --push  # Envoyer vos migrations
```

### Hooks Git

Ajoutez un hook pre-commit pour vérifier l'état de la base de données :

```bash
#!/bin/sh

# Vérifier si des migrations sont en attente
if ! supabase migration list | grep -q "No migrations found"; then
    echo "⚠️  Des migrations sont en attente. Exécutez 'pnpm db:push' d'abord (cas exceptionnel)."
    exit 1
fi

exit 0
```

## 📝 Scripts d'initialisation

Les scripts SQL du dossier `apps/backend/supabase/init-scripts` sont exécutés automatiquement lors d'un `supabase start`.
Utilisez-les pour définir des rôles personnalisés ou préremplir la base.

## 📚 Ressources

- [Documentation officielle Supabase](https://supabase.com/docs)
- [Guide des migrations](https://supabase.com/docs/guides/database/migrations)
- [CLI Supabase](https://supabase.com/docs/reference/cli/introduction)

---

Dernière mise à jour : 2025-06-22
