# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **AI Foundations**, a learning management system (LMS) built as a monorepo with React frontend and Supabase backend. The project uses pnpm workspaces for dependency management and provides a comprehensive educational platform with user authentication, course management, progress tracking, and admin features.

## Commands

### Development (Cloud-First)

```bash
# Start development server (connects to Supabase cloud)
pnpm dev

# Build the application
pnpm build

# Run tests (all workspaces)
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Lint code
pnpm lint

# Type checking
pnpm typecheck
```

### Frontend-specific (from apps/frontend/)

```bash
# Start frontend dev server
pnpm dev

# Run frontend tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Format code
pnpm format
```

### Supabase Cloud Management (Cloud-Only Setup)

```bash

#Generate TypeScript types from cloud schema
npx supabase gen types typescript --project-id oqmllypaarqvabuvbqga > apps/frontend/src/types/database.types.ts

# Validate environment variables
pnpm validate:env

# Link to cloud project for migrations (if needed)
pnpm exec supabase link --project-ref oqmllypaarqvabuvbqga

# Push local migrations to cloud
pnpm exec supabase db push

# Pull cloud changes to local
pnpm exec supabase db pull
```

### Quick Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase cloud credentials
# Then start developing
pnpm dev
```

## Architecture

### Monorepo Structure

- **apps/frontend**: React application with Vite
- **apps/backend**: Supabase configuration and migrations
- **libs/**: Shared utilities (logger, supabase-utils, cms-utils)
- **packages/**: Shared configuration packages

### Frontend Architecture

- **React 18** with TypeScript and strict mode
- **React Router 7.6.3** with lazy-loaded page components
- **TanStack Query** for server state management and caching
- **Context API** with strict typing for global state (Auth, Course, Error contexts)
- **Tailwind CSS** for styling with comprehensive design system
- **Zod** for runtime type validation and form schemas

### Key Frontend Patterns

- **Page-based routing** with protected routes using authentication guards
- **Service layer pattern** with dedicated services (courseService, userService, storageService)
- **Context providers** using custom `createContextStrict` utility for type safety
- **Component co-location** with page-specific components in subdirectories
- **Path aliases** configured: `@` (src), `@frontend` (src), `@utils`, `@services`, `@components`, `@contexts`, `@lib`, `@libs` (workspace libs)

### Backend Integration (Cloud-Only)

- **Supabase Cloud** as Backend-as-a-Service with PostgreSQL
- **100% cloud-based development** - no local setup required
- **Row Level Security (RLS)** for data protection
- **Generated TypeScript types** from cloud schema
- **PKCE authentication flow** with multi-provider support (Email, Google OAuth)
- **Real-time subscriptions** capability
- **Migration management** via Supabase CLI and cloud dashboard
- **Zero Docker dependencies** - pure cloud workflow

### State Management

- **Local component state** with React hooks
- **Global state** via Context API (AuthContext, CourseContext, AdminCourseContext, ErrorContext)
- **Server state** managed by TanStack Query with automatic caching and refetching
- **Form state** with react-hook-form and Zod validation

### Testing Strategy

- **Vitest** for unit and integration testing
- **Testing Library** for component testing
- **Playwright** for end-to-end testing
- Tests co-located with components in `__tests__/` directories

## Development Guidelines

### Code Style

- **Strict TypeScript** - avoid `any`, `unknown`, and `@ts-ignore`
- **Function components** with hooks (no class components)
- **Conventional Commits** for commit messages
- **ESLint and Prettier** enforced via pre-commit hooks

### Component Guidelines

- Keep components small and focused on single responsibility
- Use TypeScript interfaces for props
- Co-locate tests with components
- Use Zod schemas for prop validation when needed
- Follow the existing component structure in pages/

### Service Layer

- Use the existing service pattern (courseService, userService, storageService)
- Implement caching strategies where appropriate
- Handle errors consistently using the Result type pattern
- Validate API responses with Zod schemas

### Database Changes (Cloud-Only Workflow)

**Preferred Method - Supabase Dashboard:**

- Make schema changes directly in Supabase Dashboard (SQL Editor)
- Changes are applied instantly to cloud database
- Run `pnpm types:gen` to update TypeScript types

**Alternative Method - Local Migrations:**

- Create migration: `pnpm exec supabase migration new "description"`
- Edit migration file in `apps/backend/supabase/migrations/`
- Push to cloud: `pnpm exec supabase db push`
- Generate types: `pnpm types:gen`

**Note:** No local database setup required - all operations target cloud directly.

### Environment Setup (Cloud-Only)

- Copy `.env.example` to `.env` and configure Supabase cloud credentials
- **Zero local setup required** - direct connection to Supabase cloud
- Validate environment variables with `pnpm validate:env`
- **AI Tools Friendly:** Single source of truth (cloud database)
- **No Docker/PostgreSQL installation needed**

## Key Files and Directories

### Entry Points

- `apps/frontend/src/index.tsx` - React app entry point
- `apps/frontend/src/App.tsx` - Main app component with providers
- `apps/frontend/src/Routes.tsx` - Application routing configuration

### Core Services

- `apps/frontend/src/services/courseService.ts` - Course and progress management
- `apps/frontend/src/services/userService.ts` - User profiles and settings
- `apps/frontend/src/services/storageService.ts` - File upload and management

### Shared Libraries

- `libs/logger/` - Pino-based logging with environment-aware configuration
- `libs/supabase-utils/` - Shared Supabase utilities and result types

### Configuration

- `vite.config.mjs` - Vite configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `.env` - Environment variables for Supabase cloud connection
- `apps/backend/supabase/config.toml` - Supabase configuration (mostly for migration management)

### Types

- `apps/frontend/src/types/database.types.ts` - Generated Supabase types (auto-generated from cloud)
- `apps/frontend/src/types/` - Domain-specific TypeScript types

## AI Development Notes

### For AI Tools (Claude, Copilot, etc.)

- **Pure cloud workflow**: All data lives in Supabase cloud
- **Zero local dependencies**: No Docker, PostgreSQL, or containers needed
- **Instant setup**: Copy `.env.example` → configure cloud credentials → start coding
- **Type safety**: Run `pnpm types:gen` after any schema changes
- **Database changes**: Use Supabase Dashboard SQL Editor directly
- **Clean environment**: No local database corruption or setup issues

## Data and Mock Policy

### Strict Rules - NO EXCEPTIONS

- **NEVER use hardcoded data** in components or services
- **NEVER use mock data** or simulated values
- **IF data doesn't exist in database** → show elegant empty state
- **NO redundancy** with data already displayed elsewhere (e.g., profile header)
- **Calculations based ONLY** on real database data

### Authorized Data Sources

- Table `profiles`: xp, level, current_streak, last_completed_at
- Future tables: xp_history, user_achievements, lesson_progress
- **Nothing else** is authorized for display

### Empty States Policy

- Prefer encouraging message + clear call-to-action
- Explain what will appear once data is available
- Link to actions that will generate the data
- NEVER show placeholder or fake data

### Examples of What NOT to Do

❌ Hardcoded skills: `['Frontend', 'Backend', 'Database']`
❌ Fake XP calculations: `1000 XP = Level 2`
❌ Mock recommendations: `"Complete 3 lessons to level up"`
❌ Arbitrary progress: `"60% to next level"`
❌ Duplicate data: Showing XP/level when already in header

### Examples of What TO Do

✅ Check if `xp_history` table exists and has data
✅ If no data: "Your XP history will appear here once you start learning"
✅ If data exists: Display actual chronological XP gains
✅ Link to `/programmes` to start generating real data
✅ Use only `userProfile.xp`, `userProfile.level` from database

## Gamification & XP Architecture (ULTRA-PRO)

### Architecture Overview - ZÉRO Donnée Hardcodée

L'architecture de gamification a été complètement refactorisée pour éliminer **TOUTES** les données hardcodées et implémenter un système ultra-scalable, configurable et professionnel.

### Core Tables Architecture

#### **`profiles`** - Hub Utilisateur Central
- **Fonction**: Table utilisateur consolidée avec XP/niveau intégrés
- **Champs XP**: `xp` (integer), `level` (integer), `last_xp_event_at` (timestamp)
- **Relations**: Référencée par toutes les tables gamification
- **Source de vérité**: Pour XP total et niveau utilisateur

#### **`xp_events`** - Historique XP (Source de Vérité)
- **Fonction**: Journal complet de tous les événements XP (gains/pertes)
- **Champs**: `user_id`, `source_type`, `action_type`, `xp_delta`, `xp_before/after`, `metadata`
- **Usage**: Audit trail, timeline XP, calculs de cohérence
- **Index optimisé**: `(user_id, created_at DESC)`

#### **`xp_sources`** - Règles XP Configurables ⭐
- **Fonction**: Configuration de TOUTES les règles XP (remplace hardcoding)
- **Champs**: `source_type`, `action_type`, `xp_value`, `is_repeatable`, `cooldown_minutes`, `max_per_day`
- **Exemples**: 
  - `lesson:start → 10 XP`
  - `lesson:completion → 50 XP`
  - `course:completion → 200 XP`
  - `quiz:perfect → 30 XP`
- **Usage**: `XPService.getAvailableXPOpportunities()` remplace StatsPage hardcodé

#### **`level_definitions`** - Système Niveaux Dynamique 🚀
- **Fonction**: Configuration progression niveaux (remplace "100 XP/niveau" hardcodé)
- **Champs**: `level`, `xp_required`, `xp_for_next`, `title`, `badge_icon`, `badge_color`, `rewards`
- **Progression**: Exponentielle configurée (0→100→250→450→700→1000→1350...)
- **Usage**: `XPService.calculateLevelInfo(totalXP)` pour calculs dynamiques

#### **`achievement_definitions`** - Templates Achievements
- **Fonction**: Catalogue achievements disponibles avec conditions
- **Champs**: `achievement_key`, `title`, `description`, `condition_type`, `condition_params`, `xp_reward`
- **Types**: Seuils XP, niveaux, streaks, profil completion
- **Auto-unlock**: `AchievementService.checkAndUnlockAchievements()`

#### **`user_achievements`** - Achievements Débloqués
- **Fonction**: Instances achievements par utilisateur
- **Relations**: FK vers `profiles`, référence `achievement_definitions`
- **Audit**: Date unlock, conditions remplies, XP reward

### Services Architecture

#### **XPService** - Service Principal XP
- **`getAvailableXPOpportunities()`**: Remplace données hardcodées StatsPage
- **`calculateLevelInfo(totalXP)`**: Calculs niveau depuis level_definitions
- **`getXpTimeline()`**: Timeline événements XP avec groupement temporel
- **`getXpAggregates()`**: Statistiques XP par période/source

#### **AchievementService** - Gestion Achievements
- **`checkAndUnlockAchievements()`**: Vérification automatique achievements
- **`getUserStats()`**: Statistiques utilisateur pour conditions
- **Logique niveau**: Utilise level_definitions (plus jamais hardcodé)

### Performance Optimizations

#### **Index Stratégiques**
```sql
-- Timeline XP (requête la plus fréquente)
CREATE INDEX idx_xp_events_user_created ON xp_events (user_id, created_at DESC);

-- Règles XP actives
CREATE INDEX idx_xp_sources_active_type ON xp_sources (is_active, source_type, action_type);

-- Calculs niveau optimisés
CREATE INDEX idx_level_definitions_xp_required ON level_definitions (xp_required ASC);

-- Profiles XP/niveau
CREATE INDEX idx_profiles_xp_level ON profiles (xp, level);
```

### Frontend Integration

#### **StatsPage.tsx** - REFACTORISÉ COMPLET
- **AVANT**: 90 lignes de recommandations hardcodées
- **APRÈS**: `XPService.getAvailableXPOpportunities()` depuis `xp_sources`
- **Niveau**: `XPService.calculateLevelInfo()` depuis `level_definitions`
- **Résultat**: ZÉRO donnée hardcodée

#### **Services Dynamiques**
- **XP Opportunities**: Depuis `xp_sources` table
- **Level Progress**: Depuis `level_definitions` table
- **Achievement Check**: Automatique avec conditions configurables

### Architecture Scalability

#### **Pour 100+ Utilisateurs**
- Index optimisés pour requêtes concurrentes
- Partitioning `xp_events` si volume > 100K
- Caching Redis pour leaderboards

#### **Pour Futures Features**
- **Nouveaux types XP**: Ajout dans `xp_sources` sans code
- **Nouveaux achievements**: Configuration dans `achievement_definitions`
- **Progression custom**: Modification `level_definitions`
- **Cooldowns/Limites**: Déjà supportés dans `xp_sources`

### Migration Completed ✅

#### **Tables Supprimées**
- ❌ `user_xp_balance` (redondante avec `profiles.xp/.level`)

#### **Données Migrées**
- ✅ XP totals vers `profiles.xp`
- ✅ Niveaux vers `profiles.level`
- ✅ Vue `user_profiles_with_xp` mise à jour

#### **Cohérence Garantie**
- ✅ `xp_events` = source de vérité XP
- ✅ Niveaux calculés depuis `level_definitions`
- ✅ Règles XP depuis `xp_sources`

### Code Examples

#### **Utilisation XP Service**
```typescript
// Récupérer opportunités XP (remplace hardcodé)
const opportunities = await XPService.getAvailableXPOpportunities(userId);

// Calcul niveau dynamique (remplace Math.floor(xp/100))
const levelInfo = await XPService.calculateLevelInfo(totalXP);

// Timeline XP avec groupement
const timeline = await XPService.getXpTimeline(userId, filters, pagination);
```

#### **Configuration Règles XP**
```sql
-- Ajouter nouvelle règle XP sans déploiement code
INSERT INTO xp_sources (source_type, action_type, xp_value, description) 
VALUES ('lesson', 'video_watched', 5, 'Regarder vidéo complète');
```

### Architecture Benefits

✅ **ZÉRO hardcoding** - Toutes données depuis DB
✅ **Ultra-configurable** - Règles XP/niveaux modifiables
✅ **Scalable** - Index optimisés, architecture propre  
✅ **Maintenable** - Code DRY, single source of truth
✅ **Future-proof** - Extensible sans refactoring
✅ **Performance** - Index stratégiques, requêtes optimisées

## Architecture XP Unifiée (ULTRA-PRO) 🏆

### Problème Résolu
- **Duplication**: `xp_sources` et `achievement_definitions` avaient des overlaps
- **UX fragmentée**: Sources XP éparpillées entre 2 systèmes
- **Hardcoding**: Logique de mapping hardcodée dans frontend

### Solution - API Unifiée

**Tables clarifiées :**
- **`xp_sources`**: Actions immédiates répétables (lesson:completion, quiz:perfect, etc.)
- **`achievement_definitions`**: Objectifs long terme uniques (atteindre niveau 5, 500 XP total, etc.)
- **Doublons éliminés**: profile_complete, streak_7day_milestone supprimés

**API Unifiée XPService :**
```typescript
// API principale - TOUTES les sources XP
static async getAllXPOpportunities(userId?: string): Promise<XPOpportunity[]>

// API simplifiée - Top 3 actions pour bloc "Comment gagner plus d'XP"
static async getAvailableXPOpportunities(userId?: string): Promise<XPOpportunity[]>
```

**Type unifié XPOpportunity :**
```typescript
interface XPOpportunity {
  id: string;
  title: string;            // Généré dynamiquement depuis DB
  description: string;      // Depuis description DB ou généré
  xpValue: number;
  icon: string;             // Mappé sur sourceType
  actionText: string;       // Action button text
  available: boolean;
  sourceType: string;       // lesson, course, quiz, profile, etc.
  actionType: string;       // completion, perfect, start, etc.
  isRepeatable: boolean;
  cooldownMinutes: number;
  maxPerDay?: number;
  
  // Nouveaux champs unifiés
  category: 'action' | 'achievement'; // Différenciation type
  conditionType?: string;             // Pour achievements
  conditionParams?: Record<string, any>;
  progress?: number;                  // Progression 0-100%
  isUnlocked?: boolean;              // Pour achievements seulement
}
```

### AchievementsGrid - Refactoring Total

**AVANT :**
- Multiples requêtes: `achievement_definitions` + `user_achievements` + `user_xp_balance`
- Données hardcodées: `profile_completion: 100`, `member_rank: 2`
- Affichage seulement achievements

**APRÈS :**
- **Une seule API**: `XPService.getAllXPOpportunities(userId)`
- **TOUTES les sources XP**: Actions répétables + Achievements uniques
- **Filtres unifiés**: Type (Actions/Achievements), Catégorie, Statut
- **Zéro hardcoding**: Tout vient de la base dynamiquement

**Interface unifiée :**
```typescript
// Filtres étendus
type FilterType = 'all' | 'actions' | 'achievements' | 'unlocked' | 'locked';
type CategoryType = 'all' | 'lesson' | 'course' | 'quiz' | 'profile' | 'streak' | 
                   'module' | 'level' | 'xp' | 'special';

// Affichage différentié
- Actions: Badge bleu, icône Zap, informations cooldown/max-per-day
- Achievements: Badge violet, icône Trophy, barre progression
- Unlockés: Fond vert, CheckCircle
```

### Génération Dynamique - Zéro Hardcoding

**Titres générés :**
```typescript
// AVANT: Map hardcodée de 50+ titres
// APRÈS: Génération dynamique
generateDynamicTitle(actionType, sourceType) {
  // "completion" + "lesson" = "Terminer une leçon"
  // "perfect_score" + "quiz" = "Réussir parfaitement un quiz"
}
```

**Descriptions intelligentes :**
```typescript
// Utilise description DB ou génère selon pattern
- Si actionType.includes('perfect') → "Excellez dans..."
- Si actionType.includes('completion') → "Terminez..."
- Si sourceType === 'profile' → "Améliorez votre profil..."
```

### Résultat Final

**Stats :**
- **Tables nettoyées**: 34 → 33 xp_sources, 10 → 9 achievement_definitions
- **Zéro duplication**: Aucun overlap entre tables
- **API unifiée**: Une seule source de vérité pour frontend
- **Hardcoding éliminé**: 100% données depuis DB

**Avantages :**
- **Scalabilité**: Ajouter XP source = automatiquement visible partout
- **Maintenance**: Une seule API à maintenir
- **UX cohérente**: Même affichage pour toutes sources XP
- **Performance**: Requête unifiée optimisée

**Usage :**
```typescript
// Bloc "Comment gagner plus d'XP" (top 3 actions)
const topActions = await XPService.getAvailableXPOpportunities(userId);

// Bloc "Achievements disponibles" (tout unifié)
const allSources = await XPService.getAllXPOpportunities(userId);
```

### Commandes de Test Architecture Unifiée

```bash
# Vérifier aucun doublon dans les données
SELECT source_type, action_type, COUNT(*) FROM xp_sources 
GROUP BY 1,2 HAVING COUNT(*) > 1;

# Vérifier cohérence XP entre tables
SELECT 'xp_sources' as table, COUNT(*), SUM(xp_value) 
FROM xp_sources WHERE is_active=true;

# Tester API unifiée frontend
pnpm dev # Vérifier /profile?tab=stats
```

## Documentation Backend - Maintenance Obligatoire

### CONSIGNE CRITIQUE : Maintenance BACKEND_ARCHITECTURE.md

**TOUJOURS maintenir le fichier `BACKEND_ARCHITECTURE.md` à jour lors de TOUTE modification backend.**

#### Workflow Obligatoire

**À CHAQUE modification de la base de données :**

1. **📝 Documenter IMMÉDIATEMENT** dans `BACKEND_ARCHITECTURE.md`
2. **🔍 Mettre à jour les sections concernées** (schémas, tables, fonctions, RLS)
3. **📊 Actualiser les métriques** et statistiques
4. **🧪 Ajouter les tests** de validation effectués
5. **📅 Dater la modification** en bas du document

#### Sections à Maintenir

- **Métriques et Statistiques** : Nombre tables, RLS policies, fonctions
- **Architecture par Schéma** : Ajouts/modifications tables
- **Templates RLS** : Nouvelles politiques appliquées  
- **Fonctions RPC** : Nouvelles fonctions créées
- **Tests et Validation** : Résultats tests nouveaux composants
- **Index et Performance** : Nouveaux index créés

#### Template Mise à Jour

```markdown
### Étape X : [Nom Étape] - [Date]

#### Modifications Apportées
- **Nouveau schéma** : `schema_name` avec X tables
- **Nouvelles tables** : table1, table2, table3
- **Politiques RLS** : +X politiques ajoutées
- **Fonctions RPC** : fonction1(), fonction2()

#### Métriques Mises à Jour
- **Schémas Totaux** : X
- **Tables Totales** : X 
- **Politiques RLS** : X
- **Tests Validés** : X/X ✅

#### Tests Effectués
```sql
-- Tests de validation spécifiques
```
```

#### Responsabilité

**Claude Code DOIT** maintenir cette documentation avec la même rigueur que le code. 

**Aucune modification backend** ne doit être committée sans mise à jour correspondante de `BACKEND_ARCHITECTURE.md`.

Cette documentation est la **single source of truth** de l'architecture backend et doit refléter l'état exact du système en temps réel.
