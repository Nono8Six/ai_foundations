# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed with `pnpm` workspaces.
- Apps: `apps/frontend/` (React + Vite + TS), `apps/backend/` (Supabase config + types tooling).
- Shared libs: `libs/` (`logger`, `supabase-utils`, `cms-utils`) exported via each package `index.ts`.
- Global types: `src/env.d.ts`. Scripts/tools: `.husky/`, `lint-staged`, `eslint.config.js`, `.prettierrc`, `scripts/`.
- Tests: colocated in `apps/frontend` as `*.test.tsx?` or under `__tests__/`.

## Build, Test, and Development
- `pnpm dev`: Start frontend at `http://localhost:5173`.
- `pnpm build`: Production build (frontend); `pnpm preview`: serve the build.
- `pnpm test` | `pnpm test:watch` | `pnpm test:coverage`: Run unit tests and coverage (Vitest).
- `pnpm lint` / `pnpm format`: ESLint check and Prettier formatting.
- `pnpm typecheck`: TypeScript project-wide checks.
- `pnpm gen:types`: Regenerate Supabase types after schema changes.
- `pnpm validate:env`: Verify required env vars.

## Coding Style & Naming Conventions
- TypeScript-first; strict typing.
- Prettier: 2 spaces, single quotes, semicolons, width 100, trailing commas `es5`.
- ESLint: base + React/TS; no `prop-types`.
- Naming: components `PascalCase`; hooks `useX`; other files `kebab-case`.
- Prefer pure functions in `libs/*`; export via package `index.ts`.

## Testing Guidelines
- Frameworks: Vitest + Testing Library (frontend).
- File names: `*.test.ts` / `*.test.tsx`; colocate with source or `__tests__/`.
- Mock network I/O; aim for meaningful unit tests.
- Run `pnpm test:coverage` before PRs; keep coverage healthy.

## Commit & Pull Request Guidelines
- Commits: Conventional style, e.g., `feat: add course filter`.
- PRs: clear description, linked issue, screenshots for UI, and notes for env/DB changes.
- Required checks must pass locally: `pnpm lint`, `pnpm typecheck`, `pnpm test` (or coverage).

## Security & Configuration
- Do not commit secrets. Use `.env` (frontend reads `VITE_*`).
- Supabase: set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`.
- Validate with `pnpm validate:env`; update types with `pnpm gen:types` after schema changes.

