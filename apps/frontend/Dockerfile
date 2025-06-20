# --- Builder stage ---
FROM node:20-slim AS builder

# Enable pnpm via corepack
RUN corepack enable

# Application workspace
WORKDIR /app

# Install dependencies based on lockfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build the production assets
RUN pnpm build


# --- Runtime stage ---
FROM node:20-slim AS runtime
RUN corepack enable
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm cache clean --force

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Run as non-root user provided by the base image
USER node

CMD ["pnpm", "run", "serve", "--", "--port", "3000", "--strictPort"]
