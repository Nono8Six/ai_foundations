# AI Foundations

A monorepo for the **AI Foundations** learning platform. The project bundles a React front‑end with a Supabase backend and shared utilities managed via pnpm workspaces.

## Repository layout

- `apps/frontend` – Vite based React client
- `apps/backend` – Supabase configuration and scripts
- `libs/` – reusable utilities
- `packages/` – shared configuration such as tsconfig presets
- `scripts/` – helper shell scripts

## Tooling

- Node.js 18+ with pnpm
- ESLint and Prettier for code quality
- Vitest and Playwright for testing
- Docker and the Supabase CLI for local services

## Coding conventions

- Strict TypeScript, avoid `any` and `unknown`
- React function components with hooks
- Keep components small and easy to test

See [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) to run the project locally.

## Development workflow

Install all workspace dependencies before running the Quality Gate:

```bash
pnpm install --frozen-lockfile
```

CI executes `scripts/setup.sh` to automate this step prior to linting, type
checks and tests.
