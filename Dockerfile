# Étape 1: Build de l'application
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY vite.config.mjs ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installer les dépendances avec résolution forcée
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Étape 2: Serveur Nginx pour servir l'application
FROM nginx:stable-alpine

# Copier la configuration Nginx personnalisée
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copier les fichiers construits depuis le builder
COPY --from=builder /app/build  /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
