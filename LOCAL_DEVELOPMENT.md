# AI Foundations - Guide de Développement Cloud-First

Ce guide vous aidera à configurer rapidement l'environnement de développement pour AI Foundations avec une approche **cloud-first** optimisée pour le développement avec des outils AI.

## 🚀 Configuration Rapide (2 minutes)

### Prérequis Simplifiés

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)
- [Git](https://git-scm.com/)
- Compte [Supabase](https://supabase.com/) (gratuit)

### Setup Ultra-Rapide

```bash
# 1. Cloner et installer
git clone https://github.com/your-user/ai-foundations.git
cd ai-foundations
pnpm install

# 2. Configuration environnement
cp .env.example .env
# Éditer .env avec vos credentials Supabase cloud

# 3. Démarrer le développement
pnpm dev
```

**✅ C'est tout ! Votre app tourne sur http://localhost:5173**

## 🌥️ Pourquoi Cloud-First ?

### ✅ Avantages pour le développement AI-assisted

- **Consistance** : Même base de données pour vous et vos AI tools
- **Simplicité** : Un seul `pnpm dev` suffit
- **Collaboration** : Partage instantané des données entre développeurs
- **Performance** : Pas de virtualisation Docker locale
- **AI-Friendly** : Context simple pour Claude, Copilot, etc.

### 🎯 Perfect pour :

- Développement avec Claude Code
- Pair programming avec AI
- Prototypage rapide
- Collaboration en équipe

## 🔧 Configuration Supabase Cloud

### 1. Créer votre projet Supabase

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Créer un nouveau projet
3. Attendre que l'initialisation soit terminée (~2 minutes)

### 2. Récupérer vos credentials

Dans votre dashboard Supabase, aller dans **Settings > API** :

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Public anon key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Service role key
SUPABASE_PROJECT_REF=your-project-ref
```

### 3. Token personnel (pour CLI)

Dans **Account > Access Tokens**, créer un token :

```env
SUPABASE_ACCESS_TOKEN=sbp_...
```

## 🛠 Commandes de Développement

### Démarrage quotidien

```bash
# Démarrer le dev server (connecté au cloud)
pnpm dev

# En parallèle si besoin
pnpm test:watch
```

### Gestion base de données

```bash
# Voir le statut de votre projet cloud
pnpm supabase:status

# Pousser des migrations vers le cloud
pnpm supabase:db:push

# Générer les types TypeScript depuis le cloud
pnpm types:gen

# Créer une nouvelle migration
pnpm supabase:migration:new "add_user_preferences"
```

### Tests et qualité

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Linting
pnpm lint

# Type checking
pnpm typecheck
```

## 🏗 Structure pour les AI Tools

### Architecture simplifiée

```
ai-foundations/
├── apps/
│   ├── frontend/src/          # Code React principal
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/            # Pages de l'application
│   │   ├── services/         # Logic métier (API calls)
│   │   ├── context/          # État global (Auth, etc.)
│   │   └── types/            # Types TypeScript
│   └── backend/supabase/     # Migrations et config
├── libs/                     # Utilitaires partagés
└── .env                      # Variables d'environnement
```

### Points d'entrée pour AI

- **Nouvelles features** : `apps/frontend/src/pages/`
- **Composants UI** : `apps/frontend/src/components/`
- **API calls** : `apps/frontend/src/services/`
- **Types** : `apps/frontend/src/types/`

## 🤖 Optimisations AI Tools

### Pour Claude Code / Copilot

- ✅ **Context minimal** : Pas de config Docker complexe
- ✅ **Types auto-générés** : Run `pnpm types:gen` après changements schema
- ✅ **Hot reload** : Changements instantanés sans restart
- ✅ **Source unique** : Base cloud partagée entre sessions

### Workflow recommandé avec AI

1. **Décrire la feature** à l'AI
2. **L'AI analyse** le code existant
3. **Développer ensemble** avec hot reload
4. **Tester** avec `pnpm test`
5. **Lint** avec `pnpm lint`

## 🔍 Debugging

### Logs et monitoring

```bash
# Voir les logs frontend
pnpm dev  # logs dans le terminal

# Debug avec les dev tools du navigateur
# Ouvrir http://localhost:5173 + F12
```

### Problèmes courants

#### Port 5173 déjà utilisé

```bash
# Trouver le processus
lsof -i :5173
# Le tuer si nécessaire
kill -9 <PID>
```

#### Erreurs Supabase

```bash
# Vérifier la connection
pnpm supabase:status

# Régénérer les types si schema a changé
pnpm types:gen
```

#### Types obsolètes

```bash
# Toujours après changement de schema
pnpm types:gen
```

## 📚 Ressources

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)

### Guides spécifiques

- [CLAUDE.md](CLAUDE.md) - Guide pour Claude Code
- [STYLE_GUIDE.md](STYLE_GUIDE.md) - Conventions de code

### Support

- **Issues** : GitHub Issues du projet
- **Supabase** : Support Discord officiel
- **AI Tools** : Documentation Claude Code / Copilot

---

**🎯 L'objectif : Permettre un développement fluide avec les AI tools en éliminant la complexité infrastructure !**
