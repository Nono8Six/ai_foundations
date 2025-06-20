# ──────────── Stage 1 : builder ─────────────────────────────────────────────
FROM node:20-slim AS builder

RUN corepack enable
WORKDIR /app

# Dépendances
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Code source front-end uniquement
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend
RUN pnpm build          # génère ./dist

# ──────────── Stage 2 : runtime (Nginx) ─────────────────────────────────────
FROM nginx:1.25-alpine AS runtime
LABEL org.opencontainers.image.source="https://github.com/Nono8Six/ai_foundations"

ENV PORT=3000
EXPOSE 3000

# conf SPA : try_files -> /index.html + headers sécu
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# on copie **uniquement** les fichiers statiques
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# petit health-check HTTP
HEALTHCHECK CMD wget -qO- http://localhost:${PORT}/healthz || exit 1

# user non-root (UID 101 dans l’image officielle Nginx)
USER 101

CMD ["nginx","-g","daemon off;"]
