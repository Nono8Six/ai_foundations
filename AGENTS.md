# Repository Guidelines

## Project Structure & Modules
- Monorepo managed with `pnpm` workspaces.
- `apps/frontend/`: React + Vite + TypeScript UI.
- `apps/backend/`: Supabase config and tooling (types generation).
- `libs/`: Shared utilities (`logger`, `supabase-utils`, `cms-utils`) exported via `index.ts`.
- `src/env.d.ts`: Global TS types for environment.
- Tooling: `.husky`, `lint-staged`, `eslint.config.js`, `.prettierrc`, `scripts/` (types/env helpers).

## Build, Test, and Dev Commands
- `pnpm dev`: Run frontend dev server on `http://localhost:5173`.
- `pnpm build`: Production build (frontend).
- `pnpm preview`: Serve the production build locally.
- `pnpm test` | `test:watch` | `test:coverage`: Frontend tests (Vitest).
- `pnpm lint` / `pnpm format`: ESLint check and Prettier formatting.
- `pnpm typecheck`: TypeScript type checking.
- `pnpm gen:types`: Generate Supabase types.
- `pnpm validate:env`: Validate required environment variables.

## Coding Style & Naming
- TypeScript-first, strict mindset. Format via Prettier (2 spaces, single quotes, semicolons, width 100, trailing commas `es5`).
- ESLint base + React/TS rules; no `prop-types` (TS covers it).
- React components: `PascalCase` filenames; hooks: `useX` naming; other files: `kebab-case`.
- Prefer pure functions in `libs/*`; export through package `index.ts`.

## Testing Guidelines
- Framework: Vitest + Testing Library in `apps/frontend`.
- Test files: `*.test.tsx?` colocated with source or under `__tests__`.
- Use `pnpm test:coverage` before PRs; mock network where possible; unit test shared utilities in `libs/*`.

## Commit & PR Guidelines
- Commit messages: Conventional style preferred (e.g., `feat: add course filter`).
- Keep imperative, concise subjects; scope optional.
- PRs must include: clear description, linked issue, screenshots for UI, and notes for env/DB changes.
- Required checks: `pnpm lint`, `pnpm typecheck`, `pnpm test` (or `test:coverage`) pass locally.

## Security & Configuration
- Do not commit secrets. Use `.env` (frontend uses `VITE_`-prefixed vars); Supabase keys: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`.
- Validate with `pnpm validate:env`; regenerate types after schema changes with `pnpm gen:types`.
