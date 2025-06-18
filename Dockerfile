# --- ÉTAPE 1: BUILDER ---
# Utilise une image Node.js moderne et légère
FROM node:20-slim AS builder

# Activation de corepack pour gérer pnpm (méthode standard et recommandée)
RUN corepack enable

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers de manifeste de dépendances
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# --- ÉTAPE 2: PRODUCTION ---
# Cette étape ne change pas, elle sert pour le déploiement final
FROM nginx:stable-alpine
ENV PORT=80
EXPOSE 80
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]