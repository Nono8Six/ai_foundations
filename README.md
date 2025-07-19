# AI Foundations LMS

> **Plateforme d'apprentissage moderne construite pour le développement cloud-first avec Supabase**

## 🚀 Démarrage Rapide

```bash
# 1. Installation
git clone <repo-url>
cd ai_foundations_lms
pnpm install

# 2. Configuration
cp .env.example .env
# Éditer .env avec vos credentials Supabase cloud

# 3. Lancement
pnpm dev
```

**✅ Votre application tourne sur http://localhost:5173**

## 🏗 Architecture

**Monorepo avec pnpm workspaces :**

```
ai_foundations_lms/
├── apps/
│   ├── frontend/          # React + Vite + TypeScript
│   └── backend/           # Supabase config + migrations
├── libs/                  # Utilitaires partagés
│   ├── logger/           # Logging avec Pino
│   ├── supabase-utils/   # Helpers Supabase
│   └── cms-utils/        # Utilitaires CMS
└── packages/             # Configuration partagée
```

## 🌥️ Approche Cloud-First

**Pourquoi cloud-first ?**

- ✅ **Simplicité** : Un seul `pnpm dev` suffit
- ✅ **Consistance** : Même DB pour toute l'équipe
- ✅ **AI-Friendly** : Context simple pour Claude Code
- ✅ **Performance** : Pas de virtualisation locale
- ✅ **Collaboration** : Données partagées en temps réel

## 📚 Documentation

- [Commandes disponibles](SCRIPTS.md) - Documentation complète des commandes et de leur utilisation
- [Documentation Supabase](https://supabase.com/docs) - Documentation officielle de Supabase
- [Documentation Vite](https://vitejs.dev/guide/) - Guide de développement Vite

## 🛠 Commandes Principales

Pour une documentation détaillée de chaque commande, consultez [SCRIPTS.md](SCRIPTS.md).

### Développement

```bash
# Démarrer l'application en mode développement
pnpm dev

# Générer les types TypeScript à partir du schéma Supabase
pnpm gen:types
```

### Base de Données

```bash
# Synchroniser le schéma local avec Supabase cloud
pnpm db:pull

# (Optionnel) Pousser les migrations locales vers le cloud
pnpm db:push
```

- **[CLOUD_SYNC_GUIDE.md](CLOUD_SYNC_GUIDE.md)** - Guide complet de synchronisation
- **[CLAUDE.md](CLAUDE.md)** - Instructions pour Claude Code

## 🛠 Commandes Principales

### Développement

```bash
pnpm dev           # Démarrer le serveur de développement
pnpm build         # Build de production
pnpm test          # Tests unitaires
pnpm test:e2e      # Tests end-to-end
pnpm lint          # Linting ESLint
pnpm typecheck     # Vérification TypeScript
```

### Base de données

```bash
pnpm db:status     # Statut de la DB cloud
pnpm db:sync       # Synchroniser avec le cloud
pnpm db:pull       # Récupérer les changements cloud
pnpm db:push       # Pousser les migrations
pnpm db:check      # Vérifier l'état de sync
pnpm types:gen     # Générer les types TypeScript
```

## 🔧 Stack Technique

**Frontend :**

- React 18 + TypeScript
- Vite pour le build
- TanStack Query pour le state management
- Tailwind CSS pour le styling
- React Router pour la navigation

**Backend :**

- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Row Level Security (RLS)
- Migrations automatisées

**Outils :**

- pnpm workspaces
- ESLint + Prettier
- Vitest + Testing Library + Playwright
- Husky + lint-staged

## 🎯 Workflow Recommandé

1. **Synchronisation** : `pnpm db:check` avant de commencer
2. **Développement** : `pnpm dev` + coding
3. **Tests** : `pnpm test` + `pnpm lint`
4. **Migrations** : Si changements DB, `pnpm types:gen`
5. **Commit** : Git commit (pre-commit hooks actifs)

## 🔍 Debugging

**Logs frontend :** Console du navigateur + terminal Vite
**Logs backend :** Supabase Dashboard > Logs
**DB inspection :** Supabase Dashboard > Table Editor

## 🚨 Problèmes Courants

**Port 5173 occupé :**

```bash
lsof -i :5173
kill -9 <PID>
```

**Types obsolètes :**

```bash
pnpm types:gen
```

**DB désynchronisée :**

```bash
pnpm db:check
pnpm db:sync
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Committer (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Créer une Pull Request

**Conventions :**

- Commits : [Conventional Commits](https://conventionalcommits.org/)
- Code : TypeScript strict, ESLint, Prettier
- Tests : Écrire des tests pour les nouvelles features

## 📄 License

MIT - Voir [LICENSE](LICENSE) pour plus de détails.

---

**🎯 Optimisé pour le développement avec des outils AI comme Claude Code !**
