# ---------- ÉTAPE 1 : BUILDER ----------
    FROM node:20-slim AS builder
    WORKDIR /app
    
    # (facultatif) basculer vers un npm corrigé
    RUN corepack enable && corepack prepare npm@latest --activate
    
    # Dépendances (le lockfile reste respecté)
    COPY package*.json ./
    RUN npm install         # <-- plus de npm ci
    
    # Code source
    COPY . .
    RUN npm run build       # -> crée /app/build
    
    # ---------- ÉTAPE 2 : DEV ----------
    FROM node:20-slim AS development
    WORKDIR /app
    COPY --from=builder /app /app
    EXPOSE 3000
    CMD ["npm", "run", "dev", "--", "--host"]
    
    # ---------- ÉTAPE 3 : PROD ----------
    FROM nginx:stable-alpine AS production
    COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
    COPY --from=builder /app/build /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    