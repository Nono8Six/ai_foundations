# --- Builder stage ---
FROM node:20-slim AS builder

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter ia-foundations build


# --- Runtime stage ---
FROM node:20-slim AS runtime
RUN corepack enable
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm cache clean --force

COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist

USER node

CMD ["pnpm", "--filter", "ia-foundations", "run", "serve", "--", "--port", "3000", "--strictPort"]
