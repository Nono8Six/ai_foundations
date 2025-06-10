# --- ÉTAPE 1: BUILDER ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# --- ÉTAPE 2: PRODUCTION ---
FROM nginx:stable-alpine
ENV PORT=80
EXPOSE 80
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
