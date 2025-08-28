# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by `pnpm` workspaces.
- `apps/frontend`: Vite + React + TypeScript app. Source in `src/`, assets in `public/`, tests as `*.test.ts(x)` or under `__tests__/`.
- `apps/backend`: Supabase project files. SQL migrations in `supabase/migrations/`, edge functions in `supabase/functions/`.
- `libs/*`: Shared TypeScript utilities (`cms-utils`, `supabase-utils`, `logger`).
- `docs/*`: Architecture and plans. Key configs at repo root (`eslint.config.js`, `commitlint.config.js`, `lint-staged.config.mjs`, `tsconfig.json`).

## Build, Test, and Development Commands
- Prereqs: Node >= 18, pnpm >= 9. Install deps: `pnpm install`.
- Run dev server: `pnpm dev` (filters to `apps/frontend`).
- Build and preview: `pnpm build` then `pnpm preview`.
- Tests: `pnpm test` (Vitest), watch `pnpm test:watch`, coverage `pnpm test:coverage`.
- Lint/format/typecheck: `pnpm lint`, `pnpm format`, `pnpm typecheck`.
- Env validation: `pnpm run validate:env`.
- Generate Supabase types: `pnpm run gen:types` (root) or `pnpm --filter backend gen:types`.

## Coding Style & Naming Conventions
- TypeScript first; 2-space indentation; Prettier enforced via lint-staged.
- ESLint with `typescript-eslint`, React, and Hooks. CI treats warnings as errors (`--max-warnings 0`).
- React components: PascalCase files (e.g., `UserCard.tsx`). Hooks: `useXxx.ts`. Tests: `Component.test.tsx` aligned with source.

## Testing Guidelines
- Frameworks: Vitest + React Testing Library + jsdom.
- Unit tests colocated next to files or in `__tests__/` folders.
- E2E-like suite: `apps/frontend/src/tests/p10/`. Run with `pnpm --filter frontend run p10:test:e2e`.
- Use `test:coverage` locally before PRs; include tests for new features/bug fixes.

## Commit & Pull Request Guidelines
- Conventional Commits enforced by commitlint (e.g., `feat: add course progress`, `fix: handle null user`).
- Pre-commit uses Husky + lint-staged to format and lint staged files.
- PRs: clear description, linked issues, screenshots for UI changes, and notes on testing/coverage. Ensure `lint`, `typecheck`, and all tests pass.

## Security & Configuration Tips
- Required env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`. Do not commit secrets.
- Database changes belong in `apps/backend/supabase/migrations/`; keep migrations idempotent and reviewed.
