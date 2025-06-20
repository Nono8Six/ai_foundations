# --- Builder stage ---
FROM node:20-slim AS builder

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter ia-foundations build


# --- Runtime stage ---
FROM nginx:1.25-alpine AS runtime

ENV PORT=3000
EXPOSE 3000

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
