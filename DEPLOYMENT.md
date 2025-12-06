# 🚀 Guide de Déploiement - Agence de Voyage API

## ⚠️ Problème avec Netlify

**Netlify n'est pas adapté pour déployer des applications NestJS complètes.**

Netlify est conçu pour :
- Sites statiques (HTML, CSS, JS)
- Fonctions serverless (serverless functions)
- Applications JAMstack

NestJS nécessite :
- Un serveur Node.js qui tourne en continu
- Support des WebSockets
- Connexions persistantes à la base de données

## ✅ Solutions Recommandées

### 1. **Railway** (Recommandé - Gratuit au début)

Railway est parfait pour déployer des applications NestJS.

**Étapes :**
1. Créer un compte sur [railway.app](https://railway.app)
2. Connecter votre repository GitHub
3. Railway détecte automatiquement NestJS
4. Ajouter les variables d'environnement
5. Déployer !

**Avantages :**
- ✅ Gratuit au début (500$ de crédit/mois)
- ✅ Déploiement automatique depuis GitHub
- ✅ Support PostgreSQL natif
- ✅ Logs en temps réel
- ✅ SSL automatique

### 2. **Render** (Gratuit avec limitations)

**Étapes :**
1. Créer un compte sur [render.com](https://render.com)
2. Créer un nouveau "Web Service"
3. Connecter votre repository GitHub
4. Configuration :
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
5. Ajouter les variables d'environnement

**Avantages :**
- ✅ Plan gratuit disponible
- ✅ Déploiement automatique
- ✅ SSL automatique

**Inconvénients :**
- ⚠️ Le service gratuit se met en veille après 15 min d'inactivité

### 3. **Vercel** (Avec adaptation)

Vercel peut fonctionner mais nécessite une adaptation pour NestJS.

**Configuration nécessaire :**
Créer `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

**Avantages :**
- ✅ Excellent pour les déploiements
- ✅ Gratuit avec limitations
- ✅ CDN global

**Inconvénients :**
- ⚠️ Nécessite une adaptation pour NestJS
- ⚠️ Pas idéal pour les applications long-running

### 4. **Heroku** (Payant maintenant)

Heroku a retiré son plan gratuit, mais reste une option solide.

### 5. **DigitalOcean App Platform**

**Étapes :**
1. Créer un compte sur [digitalocean.com](https://www.digitalocean.com)
2. Créer une nouvelle App
3. Connecter GitHub
4. Configuration automatique

**Avantages :**
- ✅ Très fiable
- ✅ Support complet Node.js
- ✅ Base de données gérée

## 📝 Configuration pour Déploiement

### Variables d'environnement nécessaires

```env
# Base de données
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# JWT
JWT_SECRET=votre_secret_jwt
JWT_REFRESH_SECRET=votre_refresh_secret
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Application
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://votre-frontend.com

# Supabase Storage (optionnel)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_service_key
SUPABASE_STORAGE_BUCKET=imagesVoyages
```

### Build et Start Commands

**Build Command:**
```bash
npm install && npm run build && npx prisma generate
```

**Start Command:**
```bash
npm run start:prod
```

## 🔧 Configuration Swagger pour Production

La configuration Swagger a été mise à jour pour inclure votre URL Netlify, mais pour une vraie production, utilisez une des plateformes ci-dessus.

**URL Swagger:** `https://votre-domaine.com/api/docs`

## 📚 Documentation Swagger

Une fois déployé, la documentation Swagger sera accessible sur :
- `/api/docs` - Interface Swagger UI
- `/api/docs-json` - JSON OpenAPI

## 🎯 Recommandation Finale

**Pour ce projet, je recommande Railway** car :
1. Gratuit au début
2. Très simple à configurer
3. Support complet de NestJS
4. Déploiement automatique depuis GitHub
5. Base de données PostgreSQL incluse

## 📞 Support

Si vous avez des questions sur le déploiement, consultez :
- [Documentation Railway](https://docs.railway.app)
- [Documentation Render](https://render.com/docs)
- [Documentation NestJS Deployment](https://docs.nestjs.com/recipes/deployment)

