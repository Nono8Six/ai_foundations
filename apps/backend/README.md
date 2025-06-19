# Backend

This folder contains the Supabase resources and database scripts used by the application.

## Setup

Install the Supabase CLI and link it to your project:

```bash
pnpm exec supabase login
pnpm exec supabase link
```

## Useful commands

```bash
pnpm db:push   # Apply local migrations to the linked project
pnpm db:pull   # Pull the remote schema into local migrations
pnpm migrate   # Run scripts/migrate.sh to apply migrations locally
```
