# ---------- ÉTAPE 1 : BUILDER ----------
    FROM node:20-slim AS builder

    # (facultatif) installer curl si tu en as vraiment besoin
    # RUN apt-get update && apt-get install -y --no-install-recommends curl \
    #     && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /app
    
    # Dépendances
    COPY package*.json ./
    RUN npm ci                          # lockfile respecté, récupère rollup-linux-x64-gnu
    
    # Code source
    COPY . .
    
    # Build front
    RUN npm run build
    
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
    