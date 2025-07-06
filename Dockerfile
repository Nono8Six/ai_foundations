# ==============================================================================
# Dockerfile pour AI Foundations (Développement et Production)
# ==============================================================================

# ==============================================================================
# Dockerfile pour AI Foundations - Frontend
# ==============================================================================

# ------------------------------------------------------------------------------
# Étape 1 : Dépendances
# ------------------------------------------------------------------------------
FROM node:20-slim AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copie des fichiers de manifeste et installation des dépendances de production uniquement (si applicable)
# ou fetch pour peupler le store pnpm
COPY package.json pnpm-lock.yaml ./
# Copie pnpm-workspace.yaml si c'est un monorepo et que le frontend en dépend pour la résolution
COPY pnpm-workspace.yaml ./
# Optimisation: fetcher uniquement les dépendances nécessaires pour le build du frontend
# Cela suppose que le filtrage est possible à ce stade ou que vous copiez les package.json des workspaces.
# Pour un monorepo, il est plus efficace de fetcher toutes les dépendances (y compris dev) pour maximiser le cache.
RUN pnpm fetch
# ------------------------------------------------------------------------------
# Étape 2 : Build des assets du Frontend
# ------------------------------------------------------------------------------
FROM node:20-slim AS build-assets

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copier les fichiers de configuration et les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY tsconfig.json ./
COPY apps/frontend/tsconfig.json ./apps/frontend/tsconfig.json
COPY apps/frontend/vite.config.mjs ./apps/frontend/vite.config.mjs

# Copier le store pnpm depuis l'étape deps
COPY --from=deps /pnpm/store /pnpm/store
# Installer toutes les dépendances (dev incluses pour le build)
# L'installation utilisera le store copié à l'étape précédente, ce qui la rendra rapide.
RUN pnpm install --frozen-lockfile
# Copier le reste du code source
COPY . .

# Construction de l'application frontend
RUN pnpm --filter frontend build

# ------------------------------------------------------------------------------
# Étape 3 : Production (Nginx)
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

# Copier la configuration Nginx
COPY apps/frontend/nginx/default.conf.template /etc/nginx/templates/default.conf.template
# Copier le point d'entrée pour Nginx (si vous en avez un custom)
# COPY --from=build-assets /app/apps/frontend/docker/nginx-entrypoint.sh /docker-entrypoint.d/30-custom-entrypoint.sh
# RUN chmod +x /docker-entrypoint.d/30-custom-entrypoint.sh

# Copier les fichiers construits depuis l'étape build-assets
COPY --from=build-assets /app/apps/frontend/dist /usr/share/nginx/html
# Copier un fichier healthz simple si votre app n'en a pas
COPY apps/frontend/public/healthz.html /usr/share/nginx/html/healthz.html

EXPOSE 80

# Utilisateur non-root pour la sécurité
USER nginx:nginx

# Healthcheck pour surveiller l'état du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/healthz || exit 1

# Commande par défaut pour Nginx (déjà définie dans l'image de base, mais peut être surchargée)
# CMD ["nginx", "-g", "daemon off;"]

# ------------------------------------------------------------------------------
# Étape 4 : Développement (Node.js avec Vite)
# ------------------------------------------------------------------------------
FROM node:20-slim AS development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Installer pnpm globalement pour s'assurer qu'il est disponible pour tous les utilisateurs,
# y compris l'utilisateur 'node' non-root. La version est épinglée pour correspondre
# à celle dans package.json.
RUN npm install -g pnpm@10.12.4

WORKDIR /app

# Copier le store pnpm et les node_modules de l'installation complète (incluant devDependencies)
# Cela est un peu redondant si on monte les volumes locaux, mais assure que l'image est auto-contenue si besoin.
COPY --from=build-assets /pnpm/store /pnpm/store
COPY --from=build-assets /app/node_modules /app/node_modules
COPY --from=build-assets /app/apps/frontend/node_modules /app/apps/frontend/node_modules

# Copier tout le code source (nécessaire pour le hot-reload)
COPY . .

# Changer le propriétaire des fichiers pour l'utilisateur non-root
# afin que le processus Vite puisse écrire dans node_modules/.vite-temp
RUN chown -R node:node /app

# Définir l'utilisateur non-root
USER node

# Se placer dans le dossier frontend pour le dev
WORKDIR /app/apps/frontend

EXPOSE 5173

# Healthcheck pour le développement
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:5173 || exit 1

# Commande par défaut pour le développement frontend
# Utilisation de la forme "exec" pour une meilleure gestion des signaux (ex: Ctrl+C).
# Le script "dev" dans package.json contient déjà --host.
CMD ["pnpm", "dev"]

# ==============================================================================
# Sélection de l'étape par défaut (sera 'development' dans docker-compose)
# ==============================================================================
FROM development

# Métadonnées
LABEL org.opencontainers.image.source="https://github.com/Nono8Six/ai_foundations" \
      org.opencontainers.image.description="AI Foundations - Environnement de développement" \
      org.opencontainers.image.licenses="MIT"
