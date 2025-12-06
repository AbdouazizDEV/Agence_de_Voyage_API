# 🚀 Guide de Déploiement sur Vercel

## ⚠️ Note Importante

Vercel est conçu pour des **fonctions serverless**, pas pour des applications Node.js long-running comme NestJS. Cependant, on peut adapter NestJS pour fonctionner sur Vercel en utilisant un handler serverless.

## 📋 Configuration Créée

### 1. Script de Build (`scripts/build.sh`)

Ce script sera exécuté automatiquement lors du build sur Vercel :

```bash
#!/bin/bash
# 1. Installe les dépendances
# 2. Génère le client Prisma
# 3. Build l'application NestJS
# 4. Vérifie que le build a réussi
```

### 2. Configuration Vercel (`vercel.json`)

- **buildCommand**: Exécute le script de build
- **outputDirectory**: `dist` (fichiers compilés)
- **rewrites**: Redirige toutes les requêtes vers `/api/index.js`
- **functions**: Configuration pour la fonction serverless

### 3. Handler Serverless (`api/index.js`)

Ce fichier permet d'exécuter NestJS comme une fonction serverless :
- Charge l'application NestJS
- Configure CORS, validation, etc.
- Gère les requêtes HTTP

## 🔧 Configuration Vercel

### Dans le Dashboard Vercel

1. **Build & Development Settings:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build:vercel` (ou laisser vide, `vercel.json` le gère)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

2. **Environment Variables:**
   Ajoutez toutes vos variables d'environnement :
   ```env
   DATABASE_URL=postgresql://...
   DIRECT_URL=postgresql://...
   JWT_SECRET=...
   JWT_REFRESH_SECRET=...
   NODE_ENV=production
   CORS_ORIGIN=https://votre-frontend.com
   # ... autres variables
   ```

## 🎯 URLs après Déploiement

Une fois déployé, votre API sera accessible sur :
- **Base URL:** `https://votre-projet.vercel.app`
- **API:** `https://votre-projet.vercel.app/api/v1/...`
- **Swagger:** `https://votre-projet.vercel.app/api/docs`

## ⚠️ Limitations Vercel

1. **Timeout:** 30 secondes maximum par requête (configurable jusqu'à 60s sur Pro)
2. **Cold Start:** Premier démarrage peut prendre 1-3 secondes
3. **Mémoire:** 1024 MB maximum (configuré dans `vercel.json`)
4. **Pas de WebSockets:** Les WebSockets ne sont pas supportés
5. **Pas de processus long-running:** Chaque requête est une nouvelle instance

## 🔍 Dépannage

### Problème : "Cannot GET /"
**Solution:** Vérifiez que `vercel.json` redirige correctement vers `/api/index.js`

### Problème : "Module not found"
**Solution:** Assurez-vous que `npx prisma generate` est exécuté dans le script de build

### Problème : Timeout
**Solution:** Augmentez `maxDuration` dans `vercel.json` (jusqu'à 60s sur Pro)

### Problème : Cold Start lent
**Solution:** C'est normal avec les fonctions serverless. Utilisez Vercel Pro pour de meilleures performances.

## 📝 Alternative : Utiliser Render ou Railway

Si vous rencontrez trop de problèmes avec Vercel, je recommande :
- **Railway** : Gratuit, support complet NestJS
- **Render** : Gratuit avec limitations

Voir `RENDER_DEPLOY.md` pour plus de détails.

## 🚀 Déploiement

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement `vercel.json`
3. Ajoutez les variables d'environnement
4. Déployez !

Le script `build.sh` sera exécuté automatiquement lors de chaque build.

