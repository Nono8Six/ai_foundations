# ==============================================================================
# Dockerfile Production pour AI Foundations
# ==============================================================================

# --- Étape 1 : Builder ---
# On utilise Node.js pour compiler l'application.
FROM node:20-slim AS builder

RUN corepack enable
WORKDIR /app

# Copier et installer les dépendances (cette étape sera mise en cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# --- Injection des variables d'environnement au moment du build ---
# On déclare les arguments qui seront passés par docker-compose
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# On les expose comme variables d'environnement pour que Vite puisse les lire
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
# ---

# Construire l'application frontend. La sortie sera dans /app/apps/frontend/dist
RUN pnpm --filter frontend build

# --- Étape 2 : Runtime ---
# On utilise une image Nginx légère et sécurisée pour servir les fichiers.
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.source="https://github.com/Nono8Six/ai_foundations"

ENV PORT=3000
EXPOSE 3000

# Copier les fichiers statiques compilés
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copier le template de configuration Nginx
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/healthz || exit 1

# Utiliser un utilisateur non-root pour la sécurité
USER 101

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
