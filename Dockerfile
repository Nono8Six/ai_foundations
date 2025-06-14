# --- ÉTAPE 1: BUILDER ---
    FROM node:18-alpine AS builder

    # --- AJOUT IMPORTANT ---
    # Installation des dépendances système nécessaires pour nos scripts.
    # 'apk' est le gestionnaire de paquets pour Alpine Linux.
    RUN apk add --no-cache bash curl
    
    WORKDIR /app
    COPY package.json ./
    RUN npm install --legacy-peer-deps
    COPY . .
    # Copier les fichiers d'environnement
    COPY .env* ./
    # Note: 'npm run build' n'est pas utilisé pour le développement, mais on le laisse pour la cohérence.
    RUN npm run build
    
    # --- ÉTAPE 2: PRODUCTION ---
    # Cette étape est utilisée pour créer une image de production optimisée.
    # Votre docker-compose en mode développement n'utilise que l'étape "builder".
    FROM nginx:stable-alpine
    ENV PORT=80
    EXPOSE 80
    COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
    COPY --from=builder /app/build /usr/share/nginx/html
    CMD ["nginx", "-g", "daemon off;"]