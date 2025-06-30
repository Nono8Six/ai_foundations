# 1 🎯 Mission Statement

The *AI-Foundations* monorepo must remain **bug-free, type-safe and maintainable**. The OpenAI Codex agent is expected to automate repetitive coding tasks while adhering to *every* guideline below. **Human prompts always take precedence** over this file, but if a prompt conflicts with company policy the agent must ask for clarification.

# 2 📚 Scope & Precedence

1. This file governs **all directories** under the repository root.  
2. Deeper `AGENTS.md` files may override rules for their sub-trees.  
3. Direct developer / system instructions *override* any `AGENTS.md` rule.  
4. If multiple rules appear to conflict, **favour safer code-quality defaults**.

# 3 🗺️ Project Overview

| Area      | Tech Stack                                                    | Root Path            |
|-----------|--------------------------------------------------------------|----------------------|
| Front-end | React 18 + TypeScript 5 + Vite 6                              | `apps/frontend/`     |
| Styling   | Tailwind CSS 3 + shadcn/ui                                    | `apps/frontend/src/` |
| State     | TanStack Query 5 • Zustand                                    | `apps/frontend/src/` |
| Back-end  | Supabase (PostgreSQL 16, Auth v3, Storage, Edge Functions TS) | `apps/backend/`      |
| Tooling   | pnpm 10 • Docker • Vitest v1                                  | repo root            |

> *Reference*: Vite 6 release notes ([typescriptlang.org](https://www.typescriptlang.org/tsconfig)) · TanStack Query v5 docs ([tanstack.com](https://tanstack.com/query/v5/docs/react/overview)) · shadcn/ui intro ([ui.shadcn.com](https://ui.shadcn.com/docs)) · Supabase type generation ([supabase.com](https://supabase.com/docs/guides/api/rest/generating-types))

# 4 🛠️ Directives to Codex

## 4.1 Execution Protocol

1. **Stay in the current Git branch.** Branches are forbidden.  
2. Respect the Codex system message – **wait for terminal commands to finish** before replying.  
3. Run the *quality gate* (Section 6) **after each code change**.  
4. Leave the work-tree **clean** (`git status` shows no changes).  
5. Commit using *Conventional Commits* v1 spec.  
6. If **pre-commit** fails, fix issues and retry. Never skip hooks.

## 4.2 When Time-Constrained

If a human prompt explicitly says you may skip long-running tasks, you **may** add the flag `--skip-tests` to the npm script names. Document this deviation in the commit body.

## 4.3 Citations & PR Messages

Follow the OpenAI **Citations instructions** verbatim when referencing repository paths or terminal output in your pull-request message.  
Always supply **file citations** for changed code and **terminal citations** only for runtime output; never cite git hashes.

# 5 💎 Coding Conventions

### 5.1 TypeScript Strictness

- `"strict": true` is **mandatory** in *every* `tsconfig.json`.  
- Disallowed: `any`, `unknown`, `@ts-ignore`, `// eslint-disable`.  
- Prefer *utility types* (`Pick`, `Record`, `NoInfer`) and generics over repetitive interfaces.

### 5.2 React Guidelines

- Function components only; hooks for state/effects.  
- Compose small components instead of prop drilling; lift state via custom hooks.  
- Co-locate tests (`*.test.tsx`) and stories (`*.stories.tsx`).  
- Provide **ARIA labels** and keyboard interactions to satisfy WCAG 2.2 AA.

### 5.3 File and Folder Layout

apps/frontend/src/
pages/<feature>/
Page.tsx # route entrypoint
components/
hooks/
utils/
components/ui/ # shadcn primitives
lib/ # cross-cutting helpers
styles/ # Tailwind entrypoints only

pgsql
Copier
Modifier

Promote reusable logic to `lib/` or `@ai-foundations/utils` to eliminate duplication.

### 5.4 Back-end (Supabase)

1. Write migrations via Supabase CLI (`supabase db diff`).  
2. Regenerate DB types with `pnpm gen:types` and commit along with migration SQL.  
3. Enforce RLS: **no table is world-readable**; use policies.

# 6 ✅ Quality Gate (checks must pass)

| Script                         | Purpose                                            |
|--------------------------------|----------------------------------------------------|
| `pnpm lint`                    | ESLint + Prettier – zero **warnings** allowed      |
| `pnpm typecheck`               | `tsc --noEmit` across monorepo                     |
| `pnpm test`                    | Vitest – 100 % pass rate; aim ≥ 80 % line coverage |
| `pnpm build --filter frontend` | Vite prod build with size analysis                 |

Codex **must** execute these locally and abort commit on failure.

# 7 🔒 Security & Compliance

- Sanitize **all user-generated markdown** via `@ai-foundations/remark-sanitize` before rendering.  
- Prevent XSS/CSRF by relying on Supabase Auth token in `Authorization` header and double-submit CSRF pattern.  
- Store secrets in `docker/.env.example`; never commit real credentials.

# 8 🚀 Performance Budget

- Largest Contentful Paint ≤ 2.5 s on a MacBook Air M3 throttled to 3× CPU.  
- React component tree depth ≤ 20.  
- Postgres queries must use indexes (check EXPLAIN ANALYZE).  
- Images served through Supabase Storage CDN with `?width=` responsive params.

# 9 📝 Commit Message Template

```text
<type>(<scope>): <imperative summary>

Why: <business or UX value>
How: <technical gist>
TEST PLAN: <commands / URLs>
Citations: <F:path†Lx-Ly>, <chunk_id†Lx-Ly>

BREAKING CHANGE: <migration guide>
Example: feat(auth): add magic-link login

10 🧑‍💻 Local Development Workflow
bash
Copier
Modifier
docker compose up -d            # start Postgres + Supabase
pnpm i                          # install deps
pnpm dev --filter frontend      # Vite hot-reload
Use multi-stage Dockerfiles (non-root user). New services belong to the optional tools compose profile unless business-critical.

11 🔄 Continuous Improvement
Whenever Codex touches a file, it must:

Delete unused imports (ESLint autofix).

Detect duplicate code via jscpd and refactor if > 10 loc overlap.

Keep cyclomatic complexity ≤ 10 per function.

12 📜 Licensing
All original code is MIT-licensed. Preserve license headers; do not introduce GPL dependencies without approval.
