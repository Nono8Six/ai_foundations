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

### Supabase Cloud Management

```bash
# Generate TypeScript types from cloud schema
pnpm types:gen

# Validate environment variables
pnpm validate:env
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

### Backend Integration (Cloud-First)

- **Supabase Cloud** as Backend-as-a-Service with PostgreSQL
- **Direct cloud connection** for development (no local Supabase needed)
- **Row Level Security (RLS)** for data protection
- **Generated TypeScript types** from cloud schema
- **PKCE authentication flow** with multi-provider support (Email, Google OAuth)
- **Real-time subscriptions** capability
- **Supabase branching** for feature development and testing

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

### Database Changes (Cloud-First)

- Make schema changes directly in Supabase Dashboard (SQL Editor)
- Always run `pnpm types:gen` after schema changes to update TypeScript types
- No local migrations needed - cloud is the source of truth

### Environment Setup (Simplified)

- Copy `.env.example` to `.env` and configure Supabase cloud credentials
- No Docker required - direct connection to Supabase cloud
- Validate environment variables with the provided validation script
- AI Tools Friendly: Single source of truth (cloud database)

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

- **Single source of truth**: All data lives in Supabase cloud
- **No Docker complexity**: Just `pnpm dev` to start
- **Type safety**: Run `pnpm types:gen` after any schema changes
- **Simple setup**: Copy `.env.example` → configure cloud credentials → start coding
- **Database changes**: Use Supabase Dashboard SQL Editor directly
