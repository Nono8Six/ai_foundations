# ==============================================================================
# Dockerfile pour AI Foundations (Développement et Production)
# ==============================================================================

# Étape 1 : Builder l'application
FROM node:20-slim AS builder

# Active pnpm
RUN corepack enable

# Définit le répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances (optimisation du cache Docker)
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copie du reste du code source
COPY . .

# Construction de l'application
RUN pnpm --filter frontend build

# ==============================================================================
# Étape 2 : Image de production
# ==============================================================================
FROM nginx:1.27-alpine AS production

# Installation des outils de débogage (utile en développement)
RUN apk add --no-cache curl

# Configuration Nginx
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copie des fichiers construits depuis l'étape builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Exposition du port HTTP standard
EXPOSE 80

# Healthcheck pour surveiller l'état du conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/healthz || exit 1

# Utilisateur non-root pour la sécurité
USER nginx:nginx

# Commande par défaut pour Nginx
CMD ["nginx", "-g", "daemon off;"]

# ==============================================================================
# Étape 3 : Configuration pour le développement
# ==============================================================================
FROM node:20-slim AS development

# Active pnpm
RUN corepack enable

# Définit le répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances (optimisation du cache Docker)
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copie du reste du code source
COPY . .

# Exposition du port utilisé en développement
EXPOSE 3000

# Variables d'environnement par défaut pour le développement
ENV PORT=3000 \
    NODE_ENV=development \
    VITE_APP_ENV=development \
    VITE_DEBUG=true \
    VITE_LOG_LEVEL=debug

# Healthcheck simplifié pour le développement
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=2 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Commande par défaut pour le développement
CMD ["pnpm", "dev", "--host", "--port", "3000"]

# ==============================================================================
# Sélection de l'étape par défaut (développement)
# ==============================================================================
FROM development

# Métadonnées
LABEL org.opencontainers.image.source="https://github.com/Nono8Six/ai_foundations" \
      org.opencontainers.image.description="AI Foundations - Environnement de développement" \
      org.opencontainers.image.licenses="MIT"
