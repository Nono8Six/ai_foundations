# Local Development

This guide explains how to run the project with Docker and manage the local Supabase instance.

## Docker workflow
1. Build and start the frontend:
   ```bash
   docker compose up --build
   ```
   The app will be available on `http://localhost:5173`.

## Supabase
The repository relies on the Supabase CLI. The commands below use pnpm shortcuts:

- Start the local stack:
  ```bash
  pnpm db:start
  ```
  Supabase Studio is then available at `http://localhost:54323`.

- Stop the stack:
  ```bash
  pnpm db:stop
  ```

- Reset the local database (drops data):
  ```bash
  pnpm db:reset
  ```

## Database connection
Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `SUPABASE_PROJECT_REF` in `.env`. Use your cloud credentials or the defaults printed by `pnpm db:start` for the local instance.

## Regenerating types
Whenever the database schema changes, update the generated TypeScript types with:
```bash
pnpm types:gen
```
