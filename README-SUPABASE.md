# Guide Supabase

Ce document explique comment utiliser l'instance Supabase locale du projet **AI Foundations**.

## Prérequis

- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Commandes principales

### Démarrer l'environnement

```bash
pnpm db:start
```

Lance Supabase avec PostgreSQL et Studio.

### Arrêter l'environnement

```bash
pnpm db:stop
```

### Réinitialiser la base

```bash
pnpm db:reset
```

Supprime toutes les données locales.

### Synchroniser avec le cloud

```bash
pnpm db:pull   # récupérer les migrations
pnpm db:push   # envoyer vos modifications
```

### Générer les types

```bash
pnpm gen:types
```

Met à jour `apps/frontend/src/types/database.types.ts`.
