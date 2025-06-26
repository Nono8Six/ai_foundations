# apps/backend/Dockerfile
FROM node:20-alpine AS base

# Activer pnpm
RUN corepack enable

# Installer les outils nécessaires
RUN apk add --no-cache curl git

WORKDIR /app

# ------------------------------------------------------------------------------
# Étape 1 : Builder l'application backend
# ------------------------------------------------------------------------------
FROM base AS builder

# Copier les fichiers de configuration du workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source complet
COPY . .

# Compilation TypeScript
RUN pnpm --filter backend build

# ------------------------------------------------------------------------------
# Étape 2 : Développement
# ------------------------------------------------------------------------------
FROM builder AS development

WORKDIR /app/apps/backend

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["pnpm", "dev"]

# ------------------------------------------------------------------------------
# Étape 3 : Production
# ------------------------------------------------------------------------------
FROM base AS production

WORKDIR /app

# Copier uniquement les dépendances nécessaires
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod --filter backend

# Copier les fichiers compilés
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY apps/backend/package.json ./apps/backend/package.json

WORKDIR /app/apps/backend

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]

# ------------------------------------------------------------------------------
# Étape par défaut
# ------------------------------------------------------------------------------
FROM development AS final
LABEL stage="final"
