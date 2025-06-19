# --- ÉTAPE 1: BUILDER / BASE ---
# On renomme cette étape "builder" car elle sert de base pour le dev ET la prod
FROM node:20-slim AS builder

# Activation de corepack pour gérer pnpm
RUN corepack enable

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers de manifeste de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer UNIQUEMENT les dépendances. C'est la seule chose dont
# on a besoin pour préparer l'environnement.
RUN pnpm install --frozen-lockfile

# On copie le reste du code.
COPY . .

# On retire "RUN pnpm run dev". Le serveur sera lancé par docker-compose.
# On garde la commande de build pour l'étape de production.
RUN pnpm build


# --- ÉTAPE 2: PRODUCTION ---
# Cette étape est maintenant de nouveau fonctionnelle car elle peut
# trouver l'étape "builder".
FROM nginx:stable-alpine
ENV PORT=80
EXPOSE 80
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
# On copie bien depuis "builder"
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
