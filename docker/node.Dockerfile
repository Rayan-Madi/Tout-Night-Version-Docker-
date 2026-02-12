FROM node:18-alpine

# Répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY realtime/package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code de l'application
COPY realtime/ .

# Exposer le port
EXPOSE 4000

# Démarrer l'application
CMD ["node", "src/server.js"]