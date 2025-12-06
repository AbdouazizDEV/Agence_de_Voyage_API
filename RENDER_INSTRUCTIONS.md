# 📋 Instructions Déploiement Render avec Docker

## ✅ Ce qui a été fait

Tous les fichiers Docker ont été créés et poussés sur GitHub :
- ✅ `Dockerfile` - Configuration Docker optimisée
- ✅ `.dockerignore` - Exclut les fichiers inutiles
- ✅ `docker-compose.yml` - Pour développement local
- ✅ `RENDER_DOCKER_DEPLOY.md` - Guide complet

## 🚀 Ce que vous devez faire sur Render

### Étape 1: Créer un nouveau Web Service

1. **Allez sur [render.com](https://render.com)**
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur "New +"** → **"Web Service"**
4. **Connectez votre repository** : `AbdouazizDEV/Agence_de_Voyage_API`
5. **Sélectionnez la branche** : `main`

### Étape 2: Configuration du Service

#### Informations de base
- **Name:** `agence-de-voyage-api` (ou votre choix)
- **Region:** Choisissez la région la plus proche (ex: Frankfurt)
- **Branch:** `main`
- **Root Directory:** (laissez vide)

#### ⚠️ IMPORTANT - Configuration Docker
- **Environment:** Sélectionnez **`Docker`** (pas "Node")
- **Dockerfile Path:** `Dockerfile` (Render le détecte automatiquement)
- **Docker Context:** `.` (point = racine du projet)

#### Build & Deploy
- **Build Command:** (laissez VIDE - Docker gère tout automatiquement)
- **Start Command:** (laissez VIDE - défini dans le Dockerfile)

#### Health Check (Recommandé)
- **Health Check Path:** `/api`

### Étape 3: Variables d'Environnement

**⚠️ CRITIQUE:** Ajoutez TOUTES ces variables dans la section "Environment" :

```env
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database
JWT_SECRET=votre_secret_jwt_minimum_32_caracteres
JWT_REFRESH_SECRET=votre_refresh_secret_minimum_32_caracteres
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://votre-frontend.com
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_service_key
SUPABASE_STORAGE_BUCKET=imagesVoyages
```

**Notes :**
- Remplacez toutes les valeurs par vos vraies valeurs
- `PORT=3000` est important (Render peut aussi fournir automatiquement)
- `DATABASE_URL` : URL Supabase avec pooler
- `DIRECT_URL` : URL Supabase directe

### Étape 4: Déployer

1. **Cliquez sur "Create Web Service"**
2. **Render va automatiquement :**
   - Détecter le Dockerfile
   - Builder l'image Docker (peut prendre 5-10 minutes la première fois)
   - Déployer le conteneur
   - Démarrer l'application

### Étape 5: Vérifier

Une fois déployé (statut "Live"), testez :

1. **Swagger :** `https://votre-service.onrender.com/api/docs`
2. **API :** `https://votre-service.onrender.com/api/v1/offers`
3. **Health :** `https://votre-service.onrender.com/api`

## 📊 Suivi du Déploiement

Dans le dashboard Render, vous pouvez voir :
- **Logs** : Logs de build et d'exécution
- **Metrics** : CPU, mémoire, requêtes
- **Events** : Historique des déploiements

## ⚠️ Points Importants

1. **Premier build** : Peut prendre 5-10 minutes (téléchargement des images Docker)
2. **Cold start** : Après 15 min d'inactivité (plan gratuit), le service se met en veille
3. **Redémarrage** : Prend 30-60 secondes après veille
4. **Logs** : Consultez les logs si problème

## 🐛 Si Problème

1. **Vérifiez les logs** dans Render
2. **Vérifiez les variables d'environnement** (toutes doivent être définies)
3. **Vérifiez que Docker est sélectionné** (pas Node)
4. **Vérifiez la connexion à la base de données**

## ✅ Checklist

- [ ] Service créé sur Render
- [ ] Environment = **Docker** (pas Node)
- [ ] Toutes les variables d'environnement ajoutées
- [ ] Build réussi
- [ ] Application accessible
- [ ] Swagger fonctionne (`/api/docs`)

## 🎯 URLs Finales

Une fois déployé :
- **Base:** `https://votre-service.onrender.com`
- **Swagger:** `https://votre-service.onrender.com/api/docs`
- **API:** `https://votre-service.onrender.com/api/v1/...`

