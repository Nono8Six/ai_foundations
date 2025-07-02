# 🚀 AI Foundations - Workflow de Récupération et Développement

## 🆘 Récupération d'Urgence (Votre Situation Actuelle)

### Étape 1 : Nettoyage Total

```bash
# Exécuter le script de récupération
chmod +x scripts/recovery.sh
./scripts/recovery.sh
```

### Étape 2 : Vérification Supabase Cloud

- Aller sur [supabase.com](https://supabase.com/)
- Vérifier que votre projet est actif
- Noter les informations de connexion (Settings > API)

### Étape 3 : Configuration

```bash
# Copier le nouveau .env
cp .env.template .env

# Valider la configuration
pnpm validate:env
```

### Étape 4 : Premier Démarrage

```bash
# Démarrer le frontend uniquement (cloud-first)
pnpm dev

```

## 🎯 Principe Fondamental : Cloud-First

Supabase Cloud = Source de Vérité Unique

- ✅ Base de données : oqmllypaarqvabuvbqga.supabase.co
- ✅ Auth, Storage, Edge Functions : Supabase Cloud
- ✅ Types : Générés depuis le cloud
- ❌ Jamais de données locales critiques

## 🔄 Workflow de Développement Normal

### Démarrage d'un Projet

```bash
# 1. Cloner et installer
git clone https://github.com/votre-utilisateur/ai-foundations.git
pnpm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# 3. Synchroniser le schéma depuis le cloud
pnpm sync:from-cloud

# 4. Démarrer le développement
pnpm dev
```

### Synchronisation des Changements

#### Récupérer les changements du cloud

```bash
# Récupérer le schéma distant
pnpm db:pull

# Générer les types TypeScript
pnpm gen:types
```

#### Envoyer des changements vers le cloud

```bash
# Voir les différences
pnpm db:diff

# Pousser vers le cloud
pnpm db:push
```

## 🚨 Gestion des Problèmes

### Problème : Environnement Local Corrompu

```bash
# Solution rapide
pnpm reset:hard
```

### Problème : Désynchronisation DB

```bash
# Forcer la synchronisation depuis le cloud
pnpm sync:from-cloud
```

### Problème : Services Docker Non Réactifs

```bash
# Nettoyage Docker complet
pnpm clean:docker
docker compose up --build --force-recreate
```

## 🔧 Scripts Disponibles

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `pnpm dev`             | Démarrage frontend (cloud-first)        |
| `pnpm dev:docker`      | Lancement via Docker Compose            |
| `pnpm db:pull`         | Récupérer schéma depuis cloud           |
| `pnpm db:push`         | Envoyer changements vers cloud          |
| `pnpm gen:types`       | Générer types TypeScript                |
| `pnpm test:connection` | Tester connexion Supabase               |
| `pnpm recovery`        | Récupération de base de l'environnement |
| `pnpm reset:hard`      | Reset total (nettoyage + récupération)  |

## 🏗️ Architecture

```
ai_foundations/
├── apps/
│   ├── frontend/          # React/Vite → Supabase Cloud
├── scripts/
│   └── recovery.sh        # Script de récupération
├── .env                   # Variables cloud-first
├── docker-compose.yml     # Services développement
└── README-WORKFLOW.md     # Ce fichier
```

## 📡 Variables d'Environnement

### Obligatoires (Supabase Cloud)

```env
SUPABASE_URL=https://oqmllypaarqvabuvbqga.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### Configuration Frontend

```env
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
```

## ⚡ Cas d'Usage IA/Cloud

Quand vous travaillez avec des IA (Codex, Jules, etc.) :

- Toujours synchroniser avant : `pnpm sync:from-cloud`
- Partager le contexte complet : État du cloud + fichiers locaux
- Valider après modifications : `pnpm test:connection`
- Sauvegarder sur le cloud : `pnpm db:push`

## 🛡️ Préventions

### Éviter la Corruption

- Ne jamais stopper Docker brutalement pendant une migration
- Toujours utiliser `pnpm db:pull` avant de modifier le schéma
- Faire des sauvegardes régulières sur Supabase Cloud

### Bonnes Pratiques

- Commit fréquent des fichiers de migration
- Ne jamais commiter les variables d'environnement
- Tests de connexion avant chaque session

## 🆘 Support

En cas de problème persistant :

```bash
pnpm recovery
pnpm test:connection
pnpm dev
```

Vérifier également le Supabase Cloud Dashboard.

💡 **Rappel** : Supabase Cloud est la source de vérité. En cas de doute, toujours partir du cloud vers le local, jamais l'inverse.
