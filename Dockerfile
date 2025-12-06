# Dockerfile pour NestJS - Agence de Voyage API

# Étape 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Étape 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer uniquement les dépendances de production
RUN npm ci --only=production && \
    npm cache clean --force

# Générer le client Prisma (nécessaire en production aussi)
RUN npx prisma generate

# Copier les fichiers compilés depuis le builder
COPY --from=builder /app/dist ./dist

# Copier les fichiers nécessaires
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Changer le propriétaire
RUN chown -R nestjs:nodejs /app

# Passer à l'utilisateur non-root
USER nestjs

# Exposer le port
EXPOSE 3000

# Variable d'environnement pour le port
ENV PORT=3000
ENV NODE_ENV=production

# Commande de démarrage
CMD ["node", "dist/src/main.js"]
