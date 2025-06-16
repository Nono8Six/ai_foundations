# --- ÉTAPE 1: BUILDER ---
# On utilise une image Node.js moderne et légère qui inclut les outils de base
FROM node:20-slim AS builder

# Installation de pnpm, le gestionnaire de paquets recommandé
RUN npm install -g pnpm

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers de manifeste de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances en utilisant le lockfile pour une installation déterministe
RUN pnpm install --frozen-lockfile

# Copier le reste du code source de l'application
COPY . .

# Lancer le build de l'application avec pnpm
RUN pnpm build


# --- ÉTAPE 2: PRODUCTION ---
# Cette étape ne change pas, elle sert pour le déploiement final
FROM nginx:stable-alpine
ENV PORT=80
EXPOSE 80
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]