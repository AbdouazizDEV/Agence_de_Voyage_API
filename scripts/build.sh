#!/bin/bash

# Script de build pour Vercel
# Ce script sera exécuté automatiquement lors du build

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du build pour Vercel..."

# 1. Installer les dépendances (déjà fait par Vercel, mais on s'assure)
echo "📦 Vérification des dépendances..."
npm install

# 2. Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# 3. Build de l'application NestJS
echo "🏗️  Build de l'application NestJS..."
npm run build

# 4. Vérifier que le build a réussi
if [ ! -d "dist" ]; then
  echo "❌ Erreur: Le dossier dist n'existe pas après le build"
  exit 1
fi

echo "✅ Build terminé avec succès !"
echo "📁 Dossier dist créé avec les fichiers compilés"

