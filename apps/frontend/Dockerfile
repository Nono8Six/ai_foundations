# --- ÉTAPE 1: BUILDER / BASE ---
FROM node:20-slim AS builder

# Activation de corepack pour gérer pnpm
RUN corepack enable

# Définition du répertoire de travail
WORKDIR /app/frontend

# Afficher la structure du répertoire avant la copie
RUN ls -la

# Copier les fichiers de manifeste de dépendances
COPY package.json pnpm-lock.yaml ./

# Vérifier que les fichiers ont été copiés
RUN ls -la
RUN cat package.json

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste du code
COPY . .

# Vérifier la structure complète
RUN find /app -type f -name "package.json" -o -name "vite.config.*" | xargs ls -la

# Build l'application avec Vite et afficher la structure des fichiers
RUN echo "=== Avant le build ===" && \
    pwd && \
    ls -la && \
    echo "=== Exécution du build ===" && \
    pnpm run build && \
    echo "=== Après le build ===" && \
    ls -la && \
    echo "=== Contenu du répertoire dist/ ===" && \
    ls -la dist/ || (echo "ERREUR: Le répertoire dist/ n'a pas été créé" && exit 1)

# --- ÉTAPE 2: PRODUCTION ---
FROM nginx:stable-alpine
ENV PORT=80
EXPOSE 80

# Afficher la version de Nginx pour le débogage
RUN nginx -v

# Créer le répertoire pour la configuration Nginx
RUN mkdir -p /etc/nginx/templates

# Copier la configuration Nginx
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copier les fichiers buildés depuis le builder (Vite utilise le dossier 'dist' par défaut)
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
