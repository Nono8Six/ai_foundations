# --- ÉTAPE 1: BUILDER ---
FROM node:18-alpine AS builder

# Installation des dépendances système nécessaires
RUN apk add --no-cache bash curl

WORKDIR /app

# Copier d'abord les fichiers de dépendances
COPY package*.json ./
COPY package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers
COPY . .

# Copier les fichiers d'environnement
COPY .env* ./

# Note: 'npm run build' n'est pas utilisé pour le développement, mais on le laisse pour la cohérence.
RUN npm run build

# --- ÉTAPE 2: DÉVELOPPEMENT ---
FROM node:18-alpine AS development

WORKDIR /app

# Copier les fichiers du builder
COPY --from=builder /app /app

# Exposer le port 3000 pour le serveur de développement
EXPOSE 3000

# Commande par défaut pour le développement
CMD ["npm", "run", "dev", "--", "--host"]

# --- ÉTAPE 3: PRODUCTION ---
FROM nginx:stable-alpine AS production

# Installer les dépendances nécessaires
RUN apk add --no-cache bash

# Copier la configuration Nginx
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copier les fichiers construits depuis le builder
COPY --from=builder /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]