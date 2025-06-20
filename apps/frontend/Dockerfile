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
FROM nginx:1.25-alpine AS runtime

ENV PORT=3000
EXPOSE 3000

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
