Working Philosophy

Write idiomatic, modern TypeScript. Aim for self‑documenting code, minimal duplication and clear separation of concerns.

Prefer quality over quantity: smaller, well‑factored patches are valued over large monolithic ones.

When legacy issues block progress, surface them and propose incremental fixes instead of stalling.

Execution Protocol

Work on the current branch; if necessary, create a temporary codex/<topic> branch.

Run the Quality Gate (see below) before the final commit, not after every micro‑edit.

Keep the work‑tree clean (git status shows no changes) before committing.

Use Conventional Commits v1 for commit messages.

If pre‑commit hooks fail on untouched code, log a warning, attempt an auto‑fix, and continue.

Environment

All secrets live in docker/.env (mirrored to Codex). Use docker compose up -d to launch Postgres & Supabase when needed.

Quality Gate (lightweight)

Script

Purpose

Failure Policy

pnpm lint

ESLint + Prettier

block commit

pnpm typecheck

tsc --noEmit (changed packages only)

block commit

pnpm test

Vitest unit tests

warn only

pnpm build --filter frontend

Vite production build

warn only

If the human prompt explicitly allows, add --skip-tests or similar flags to speed up the gate.

Coding Conventions

TypeScript: strict: true; avoid any, unknown, and @ts-ignore.

React: function components with hooks; co‑locate _.test.tsx and _.stories.tsx.

Accessibility: provide ARIA labels and keyboard navigation (WCAG 2.2 AA).

Group shared logic in lib/ or @ai-foundations/utils.

Security & Compliance

Sanitise all user‑generated Markdown via @ai-foundations/remark-sanitize.

Apply RLS on every Supabase table; avoid world‑readable data.

Never commit real credentials.

Performance Budget

Largest Contentful Paint ≤ 2.5 s (MacBook Air M3, 3× CPU throttle).

React component tree depth ≤ 20.

Serve images via Supabase Storage CDN with responsive params (?width=).

Continuous Improvement Checklist

When Codex edits a file it should:

Remove unused imports (ESLint fix).

Detect structural duplication (> 10 LOC) with jscpd and suggest refactors.

Keep cyclomatic complexity ≤ 10 per function.

Sandbox Hints

Supabase services map to default ports (54322, 54323).

Generate migrations with supabase db diff; regenerate types with pnpm gen:types.

Edge Functions are under apps/backend/functions/ and built via npx supabase functions build.

Warning Policy : if lint or type errors already exist in unmodified files, report them but do not block the commit.
