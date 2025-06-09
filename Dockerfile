# --- ÉTAPE 1: BUILDER ---
# Utilise une image Node.js légère pour construire l'application React
FROM node:18-alpine AS builder

# Crée le dossier de travail DANS le conteneur
WORKDIR /app

# Copie les fichiers de dépendances et installe les paquets
# On copie uniquement package.json d'abord pour profiter du cache Docker
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copie TOUT le reste du code source
COPY . .

# Lance la compilation de l'application React
# Les fichiers seront générés dans /app/build
RUN npm run build


# --- ÉTAPE 2: PRODUCTION ---
# Utilise une image Nginx très légère pour servir les fichiers statiques
FROM nginx:stable-alpine

# LA CORRECTION CLÉ :
# On définit une valeur PAR DÉFAUT pour la variable d'environnement PORT.
# - En local (docker-compose), ce sera 80.
# - Sur Cloud Run, cette valeur sera AUTOMATIQUEMENT ÉCRASÉE par 8080.
ENV PORT=80

# On expose le port par défaut pour la documentation.
EXPOSE 80

# Copie notre template de configuration Nginx.
# Le script de démarrage de Nginx remplacera ${PORT} par la bonne valeur.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copie les fichiers de l'application compilés depuis l'étape "builder"
COPY --from=builder /app/build /usr/share/nginx/html

# Commande pour démarrer Nginx au premier plan.
# Le script d'entrée de l'image Nginx s'occupera de tout avant de lancer cette commande.
CMD ["nginx", "-g", "daemon off;"]
