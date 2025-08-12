# Gemini Code Assistant Context

## Project Overview

This is a monorepo for a modern learning management system (LMS) called "AI Foundations LMS". It's built with a cloud-first approach using Supabase for the backend and a React frontend. The project is managed using pnpm workspaces.

### Key Technologies:

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, TanStack Query, React Router
*   **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
*   **Tooling:** pnpm, ESLint, Prettier, Vitest, Testing Library, Husky, lint-staged

### Architecture:

The repository is structured as a monorepo with the following key directories:

*   `apps/frontend`: The React frontend application.
*   `apps/backend`: Supabase configuration, migrations, and serverless functions.
*   `libs`: Shared utility libraries for logging, Supabase helpers, and CMS utilities.

## Gamification System

The project features a sophisticated and highly configurable gamification system designed to be scalable and maintainable. The system is built around a set of core tables that manage user experience (XP), levels, achievements, and the rules that govern them.

### Core Tables:

*   **`profiles`**: The central user hub, consolidating user data with their XP and level.
*   **`xp_events`**: A complete history of all XP-related events, serving as an audit trail.
*   **`xp_sources`**: Defines the rules for all XP-awarding activities, replacing hardcoded logic.
*   **`level_definitions`**: A dynamic system for configuring level progression.
*   **`achievement_definitions`**: A catalog of available achievements and their unlock conditions.
*   **`user_achievements`**: Tracks the achievements unlocked by each user.

## Database Schema

### `profiles`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key. |
| `full_name` | `text` | The user's full name. |
| `avatar_url` | `text` | URL for the user's avatar. |
| `email` | `text` | The user's email address. |
| `xp` | `integer` | The user's total experience points. |
| `level` | `integer` | The user's current level. |
| `current_streak` | `integer` | The user's current daily streak. |
| `last_completed_at` | `timestamp` | The timestamp of the last completed lesson. |

### `courses`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key. |
| `title` | `text` | The title of the course. |
| `description` | `text` | A description of the course. |
| `slug` | `text` | The URL-friendly slug for the course. |
| `cover_image_url` | `text` | URL for the course's cover image. |
| `is_published` | `boolean` | Whether the course is published and visible to users. |

### `modules`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key. |
| `course_id` | `uuid` | Foreign key to the `courses` table. |
| `title` | `text` | The title of the module. |
| `module_order` | `integer` | The order of the module within the course. |

### `lessons`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key. |
| `module_id` | `uuid` | Foreign key to the `modules` table. |
| `title` | `text` | The title of the lesson. |
| `content` | `jsonb` | The content of the lesson. |
| `lesson_order` | `integer` | The order of the lesson within the module. |
| `type` | `enum` | The type of lesson (e.g., `video`, `text`, `quiz`). |

### `user_progress`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key. |
| `user_id` | `uuid` | Foreign key to the `profiles` table. |
| `lesson_id` | `uuid` | Foreign key to the `lessons` table. |
| `status` | `text` | The user's progress status for the lesson (e.g., `not_started`, `in_progress`, `completed`). |
| `completed_at` | `timestamp` | The timestamp when the user completed the lesson. |

## Development Guidelines

### Cloud-First Approach

This project follows a "cloud-first" development methodology. The Supabase backend is hosted entirely in the cloud, and there is no local database setup required. This simplifies the development process and ensures consistency across the team.

### Data and Mock Policy

*   **No hardcoded data:** Never use hardcoded data in components or services.
*   **No mock data:** Never use mock data or simulated values.
*   **Elegant empty states:** If data doesn't exist in the database, show an elegant empty state.

## Available Scripts

### Root

*   `pnpm dev`: Starts the frontend development server.
*   `pnpm build`: Builds the frontend for production.
*   `pnpm test`: Runs the frontend tests.
*   `pnpm lint`: Lints the entire codebase.
*   `pnpm typecheck`: Type-checks the entire codebase.
*   `pnpm format`: Formats the entire codebase.

### Supabase

*   `pnpm gen:types`: Generates TypeScript types from the Supabase schema.
*   `pnpm exec supabase db push`: Pushes local migrations to the Supabase cloud.
*   `pnpm exec supabase db pull`: Pulls cloud changes to local.
