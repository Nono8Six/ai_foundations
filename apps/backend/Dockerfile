# apps/backend/Dockerfile
# Dockerfile pour le service backend Node.js (API optionnelle)

# ------------------------------------------------------------------------------
# Étape 1 : Base avec pnpm et outils
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base-backend

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Installer les outils nécessaires pour le healthcheck ou autres opérations
RUN apk add --no-cache curl

WORKDIR /app

# ------------------------------------------------------------------------------
# Étape 2 : Dépendances Backend
# ------------------------------------------------------------------------------
FROM base-backend AS deps-backend

# Copie des fichiers de manifeste globaux et spécifiques au backend
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

# Fetcher uniquement les dépendances (y compris dev pour le build)
RUN --mount=type=cache,id=pnpm-store-backend,target=/root/.local/share/pnpm/store pnpm fetch

# ------------------------------------------------------------------------------
# Étape 3 : Build de l'application Backend
# ------------------------------------------------------------------------------
FROM base-backend AS build-backend

# Copier les fichiers de configuration globaux et spécifiques au backend
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY tsconfig.json ./
COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json

# Copier le store pnpm depuis l'étape deps-backend
COPY --from=deps-backend /root/.local/share/pnpm/store /root/.local/share/pnpm/store
# Installer toutes les dépendances (dev incluses pour le build)
RUN --mount=type=cache,id=pnpm-store-backend,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --filter backend # Assurer que seul le backend est construit si des scripts de build existent

# Copier le code source du backend et les fichiers partagés potentiels
COPY apps/backend/src ./apps/backend/src
# Si vous avez des packages/libs partagés utilisés par le backend, copiez-les aussi
# COPY packages/ /app/packages/

# Compilation TypeScript pour le backend
# S'assurer que le script "build" dans apps/backend/package.json fait `tsc -p tsconfig.json`
RUN pnpm --filter backend build

# ------------------------------------------------------------------------------
# Étape 4 : Production Backend
# ------------------------------------------------------------------------------
FROM base-backend AS production-backend

WORKDIR /app

# Copier uniquement les dépendances de production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
# Installer uniquement les dépendances de production pour le backend
RUN --mount=type=cache,id=pnpm-store-backend,target=/root/.local/share/pnpm/store pnpm install --prod --frozen-lockfile --filter backend

# Copier les fichiers compilés depuis l'étape build-backend
COPY --from=build-backend /app/apps/backend/dist ./apps/backend/dist
# Copier le package.json du backend à la racine du sous-dossier pour que `node dist/index.js` fonctionne correctement
# COPY --from=build-backend /app/apps/backend/package.json ./apps/backend/package.json # Déjà copié plus haut

# Définir l'utilisateur non-root
USER node

WORKDIR /app/apps/backend
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1 # Assurez-vous que cette route /health existe

CMD ["node", "dist/index.js"]

# ------------------------------------------------------------------------------
# Étape 5 : Développement Backend
# ------------------------------------------------------------------------------
FROM base-backend AS development-backend

WORKDIR /app

# Copier le store pnpm et les node_modules de l'installation complète
COPY --from=build-backend /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY --from=build-backend /app/node_modules /app/node_modules
COPY --from=build-backend /app/apps/backend/node_modules /app/apps/backend/node_modules

# Copier tout le code source (nécessaire pour le hot-reload avec nodemon/tsc-watch)
COPY . .

USER node

WORKDIR /app/apps/backend
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1 # Assurez-vous que cette route /health existe

# La commande "dev" dans apps/backend/package.json doit gérer le watch & rebuild
CMD ["pnpm", "dev"]

# ------------------------------------------------------------------------------
# Étape par défaut (sera 'development-backend' dans docker-compose pour le profil 'api')
# ------------------------------------------------------------------------------
FROM development-backend
