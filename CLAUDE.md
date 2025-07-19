# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **AI Foundations**, a learning management system (LMS) built as a monorepo with React frontend and Supabase backend. The project uses pnpm workspaces for dependency management and provides a comprehensive educational platform with user authentication, course management, progress tracking, and admin features.

## Commands

### Development (Cloud-First)

```bash
# Start development server (connects to Supabase cloud)
pnpm dev

# Build the application
pnpm build

# Run tests (all workspaces)
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Lint code
pnpm lint

# Type checking
pnpm typecheck
```

### Frontend-specific (from apps/frontend/)

```bash
# Start frontend dev server
pnpm dev

# Run frontend tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Format code
pnpm format
```

### Supabase Cloud Management (Cloud-Only Setup)

```bash
# Generate TypeScript types from cloud schema
pnpm types:gen

# Validate environment variables
pnpm validate:env

# Link to cloud project for migrations (if needed)
pnpm exec supabase link --project-ref oqmllypaarqvabuvbqga

# Push local migrations to cloud
pnpm exec supabase db push

# Pull cloud changes to local
pnpm exec supabase db pull
```

### Quick Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase cloud credentials
# Then start developing
pnpm dev
```

## Architecture

### Monorepo Structure

- **apps/frontend**: React application with Vite
- **apps/backend**: Supabase configuration and migrations
- **libs/**: Shared utilities (logger, supabase-utils, cms-utils)
- **packages/**: Shared configuration packages

### Frontend Architecture

- **React 18** with TypeScript and strict mode
- **React Router 7.6.3** with lazy-loaded page components
- **TanStack Query** for server state management and caching
- **Context API** with strict typing for global state (Auth, Course, Error contexts)
- **Tailwind CSS** for styling with comprehensive design system
- **Zod** for runtime type validation and form schemas

### Key Frontend Patterns

- **Page-based routing** with protected routes using authentication guards
- **Service layer pattern** with dedicated services (courseService, userService, storageService)
- **Context providers** using custom `createContextStrict` utility for type safety
- **Component co-location** with page-specific components in subdirectories
- **Path aliases** configured: `@` (src), `@frontend` (src), `@utils`, `@services`, `@components`, `@contexts`, `@lib`, `@libs` (workspace libs)

### Backend Integration (Cloud-Only)

- **Supabase Cloud** as Backend-as-a-Service with PostgreSQL
- **100% cloud-based development** - no local setup required
- **Row Level Security (RLS)** for data protection
- **Generated TypeScript types** from cloud schema
- **PKCE authentication flow** with multi-provider support (Email, Google OAuth)
- **Real-time subscriptions** capability
- **Migration management** via Supabase CLI and cloud dashboard
- **Zero Docker dependencies** - pure cloud workflow

### State Management

- **Local component state** with React hooks
- **Global state** via Context API (AuthContext, CourseContext, AdminCourseContext, ErrorContext)
- **Server state** managed by TanStack Query with automatic caching and refetching
- **Form state** with react-hook-form and Zod validation

### Testing Strategy

- **Vitest** for unit and integration testing
- **Testing Library** for component testing
- **Playwright** for end-to-end testing
- Tests co-located with components in `__tests__/` directories

## Development Guidelines

### Code Style

- **Strict TypeScript** - avoid `any`, `unknown`, and `@ts-ignore`
- **Function components** with hooks (no class components)
- **Conventional Commits** for commit messages
- **ESLint and Prettier** enforced via pre-commit hooks

### Component Guidelines

- Keep components small and focused on single responsibility
- Use TypeScript interfaces for props
- Co-locate tests with components
- Use Zod schemas for prop validation when needed
- Follow the existing component structure in pages/

### Service Layer

- Use the existing service pattern (courseService, userService, storageService)
- Implement caching strategies where appropriate
- Handle errors consistently using the Result type pattern
- Validate API responses with Zod schemas

### Database Changes (Cloud-Only Workflow)

**Preferred Method - Supabase Dashboard:**

- Make schema changes directly in Supabase Dashboard (SQL Editor)
- Changes are applied instantly to cloud database
- Run `pnpm types:gen` to update TypeScript types

**Alternative Method - Local Migrations:**

- Create migration: `pnpm exec supabase migration new "description"`
- Edit migration file in `apps/backend/supabase/migrations/`
- Push to cloud: `pnpm exec supabase db push`
- Generate types: `pnpm types:gen`

**Note:** No local database setup required - all operations target cloud directly.

### Environment Setup (Cloud-Only)

- Copy `.env.example` to `.env` and configure Supabase cloud credentials
- **Zero local setup required** - direct connection to Supabase cloud
- Validate environment variables with `pnpm validate:env`
- **AI Tools Friendly:** Single source of truth (cloud database)
- **No Docker/PostgreSQL installation needed**

## Key Files and Directories

### Entry Points

- `apps/frontend/src/index.tsx` - React app entry point
- `apps/frontend/src/App.tsx` - Main app component with providers
- `apps/frontend/src/Routes.tsx` - Application routing configuration

### Core Services

- `apps/frontend/src/services/courseService.ts` - Course and progress management
- `apps/frontend/src/services/userService.ts` - User profiles and settings
- `apps/frontend/src/services/storageService.ts` - File upload and management

### Shared Libraries

- `libs/logger/` - Pino-based logging with environment-aware configuration
- `libs/supabase-utils/` - Shared Supabase utilities and result types

### Configuration

- `vite.config.mjs` - Vite configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `.env` - Environment variables for Supabase cloud connection
- `apps/backend/supabase/config.toml` - Supabase configuration (mostly for migration management)

### Types

- `apps/frontend/src/types/database.types.ts` - Generated Supabase types (auto-generated from cloud)
- `apps/frontend/src/types/` - Domain-specific TypeScript types

## AI Development Notes

### For AI Tools (Claude, Copilot, etc.)

- **Pure cloud workflow**: All data lives in Supabase cloud
- **Zero local dependencies**: No Docker, PostgreSQL, or containers needed
- **Instant setup**: Copy `.env.example` → configure cloud credentials → start coding
- **Type safety**: Run `pnpm types:gen` after any schema changes
- **Database changes**: Use Supabase Dashboard SQL Editor directly
- **Clean environment**: No local database corruption or setup issues
