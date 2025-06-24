# Repository Overview

This document provides a quick tour of the project layout. For a visual project structure, see the "Structure du Projet" section in [README.md](../README.md) which includes an architecture diagram. Development setup steps are detailed in [README-DEV.md](../README-DEV.md) and database workflows in [README-SUPABASE.md](../README-SUPABASE.md).

## Top-Level Folders and Files

- **`apps/`** – Contains the two main codebases.
  - `frontend/` – React application (Vite). Includes components, pages and hooks.
  - `backend/` – Supabase configuration and related scripts.
- **`docs/`** – Additional documentation such as the style guide and UI references.
- **`nginx/`** – Template used when building the production container.
- **`packages/`** – Shared package configurations (e.g., TypeScript config).
- **`scripts/`** – Utility scripts for maintenance and environment validation.
- **`docker-compose.yml`** – Defines development containers.
- **`Dockerfile` / `Dockerfile.backend`** – Build instructions for frontend and backend images.
- **`Makefile`** – Shortcuts for common commands.
- **`pnpm-workspace.yaml` and lockfile** – Monorepo dependency management.
- **`tsconfig.json`** – Base TypeScript configuration.
- **`README.md`**, **`README-DEV.md`**, **`README-SUPABASE.md`**, **`README-WORKFLOW.md`** – Main documentation and workflow guides.

## Applications Directory – `apps/`

### Frontend

- **`public/`** – Static assets served by Vite.
- **`src/`** – Main React source code.
  - `components/` – Layout pieces like `AdminLayout`, `Header` and UI subcomponents.
  - `context/` – React contexts (Auth, Course, Toast, AdminCourse, Error).
  - `hooks/` – Custom hooks such as `useAchievements` and `useProgressChartData`.
  - `pages/` – Feature pages organised by folder:
    - `admin-dashboard/`, `user-dashboard/`, `user-management-admin/`, etc., each containing page components and tests.
    - Lesson tools (`lesson-viewer/`), content management (`cms/`), public landing page (`public-homepage/`) and authentication flow (`auth/`, `verify-email/`).
  - `services/` – Small helpers for data access (`courseService.ts`, `storageService.ts`).
  - `utils/` and `lib/` – Utility functions, Supabase client wrapper and test helpers.
  - `types/` – Generated TypeScript types for Supabase and other shared definitions.
- **Config Files** – `vite.config.mjs`, `tailwind.config.js`, `tsconfig.json`, etc.

### Backend

- **`supabase/`** – Local Supabase project containing `config.toml` and migration files.
- **`scripts/`** – Helpers like `migrate.sh` for applying migrations.
- **`docs/`** – References for stored functions
  ([`backend/function_inventory.md`](backend/function_inventory.md)) and RLS
  policies ([`backend/rls_policies.md`](backend/rls_policies.md)).
- **`package.json`** – Scripts for running the Supabase CLI and generating types.

For the overall workflow of keeping the backend in sync with Supabase Cloud, consult the “Workflow de Développement” section in [README-WORKFLOW.md](../README-WORKFLOW.md).


