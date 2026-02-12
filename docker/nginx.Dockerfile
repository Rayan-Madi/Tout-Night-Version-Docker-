# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

# Copier package.json
COPY frontend/package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY frontend/ .

# Build de production
RUN npm run build

# Stage 2: Servir avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]