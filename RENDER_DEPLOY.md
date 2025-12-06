# 🚀 Guide de Déploiement sur Render

## ⚠️ Problèmes Résolus

1. **Port non détecté** : L'application utilise maintenant `process.env.PORT` fourni par Render
2. **Mémoire insuffisante** : Ajout de `NODE_OPTIONS='--max-old-space-size=512'` pour limiter l'utilisation mémoire
3. **Script de démarrage** : Utilisation de `start:prod` au lieu de `start` (mode développement)

## 📋 Configuration Render

### 1. Créer un nouveau Web Service

1. Allez sur [render.com](https://render.com)
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub : `AbdouazizDEV/Agence_de_Voyage_API`

### 2. Configuration du Service

**Settings :**
- **Name:** `agence-de-voyage-api` (ou votre choix)
- **Environment:** `Node`
- **Region:** Choisissez la région la plus proche
- **Branch:** `main`
- **Root Directory:** (laissez vide)
- **Runtime:** `Node 18` (ou utilisez `.nvmrc`)

**Build & Deploy :**
- **Build Command:** 
  ```bash
  npm install && npm run build && npx prisma generate
  ```
- **Start Command:**
  ```bash
  npm run start:prod
  ```

### 3. Variables d'Environnement

Ajoutez toutes ces variables dans la section "Environment" :

```env
# Base de données
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=votre_secret_jwt_super_securise
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://votre-frontend.com

# Supabase Storage (optionnel)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_service_key
SUPABASE_STORAGE_BUCKET=imagesVoyages
```

**⚠️ Important :**
- `PORT` : Render fournit automatiquement le port, mais vous pouvez le définir à `10000` par défaut
- `DATABASE_URL` : Utilisez votre URL Supabase avec le pooler
- `DIRECT_URL` : Utilisez votre URL Supabase directe (pour migrations)

### 4. Health Check (Optionnel)

- **Health Check Path:** `/api`

## 🔧 Modifications Apportées

### 1. `package.json`
- `start` : Changé de `nest start` à `node dist/main` (production)
- `start:prod` : Ajout de `NODE_OPTIONS` pour limiter la mémoire

### 2. `src/main.ts`
- Utilisation de `process.env.PORT` en priorité (fourni par Render)
- Écoute sur `0.0.0.0` pour accepter les connexions externes

### 3. Fichiers créés
- `.nvmrc` : Spécifie Node.js 18.20.0
- `render.yaml` : Configuration Render (optionnel)

## 📝 Commandes de Build

Render exécutera automatiquement :
```bash
npm install && npm run build && npx prisma generate
```

Puis au démarrage :
```bash
npm run start:prod
```

## 🎯 Après le Déploiement

Une fois déployé, votre API sera accessible sur :
- **URL de base:** `https://votre-service.onrender.com`
- **Swagger:** `https://votre-service.onrender.com/api/docs`
- **API v1:** `https://votre-service.onrender.com/api/v1/...`

## ⚠️ Limitations du Plan Gratuit

- **Sleep après 15 min d'inactivité** : Le service se met en veille
- **Démarrage lent** : Premier démarrage peut prendre 30-60 secondes après veille
- **Limite de mémoire** : 512 MB (d'où la limitation dans `start:prod`)

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Test de santé :**
   ```bash
   curl https://votre-service.onrender.com/api
   ```

2. **Test Swagger :**
   Ouvrez dans votre navigateur :
   ```
   https://votre-service.onrender.com/api/docs
   ```

3. **Test d'endpoint :**
   ```bash
   curl https://votre-service.onrender.com/api/v1/offers
   ```

## 🐛 Dépannage

### Problème : "No open ports detected"
**Solution :** Vérifiez que `main.ts` utilise `process.env.PORT` et écoute sur `0.0.0.0`

### Problème : "JavaScript heap out of memory"
**Solution :** Le script `start:prod` inclut maintenant `NODE_OPTIONS='--max-old-space-size=512'`

### Problème : "Cannot find module"
**Solution :** Assurez-vous que `npx prisma generate` est dans la commande de build

### Problème : Service en veille
**Solution :** C'est normal avec le plan gratuit. Le service redémarre automatiquement à la première requête (peut prendre 30-60 secondes)

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le dashboard Render
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que la base de données est accessible depuis Render

