# 🐳 Guide de Déploiement Docker sur Render

## 📋 Vue d'ensemble

Ce guide vous explique comment déployer l'application NestJS dockerisée sur Render.

## 🐳 Fichiers Docker créés

### 1. `Dockerfile`
- Build multi-stage (optimisé pour la production)
- Utilise Node.js 18.20.0 Alpine (léger)
- Génère Prisma Client
- Build l'application
- Utilisateur non-root pour la sécurité

### 2. `.dockerignore`
- Exclut les fichiers inutiles du contexte Docker
- Réduit la taille de l'image

### 3. `docker-compose.yml`
- Pour le développement local
- Configuration complète avec variables d'environnement

## 🚀 Déploiement sur Render

### Étape 1: Préparer le Repository

1. **Vérifier que tous les fichiers sont poussés sur GitHub**
   ```bash
   git add .
   git commit -m "feat: Ajout Docker pour déploiement"
   git push origin main
   ```

### Étape 2: Créer un Service sur Render

1. **Aller sur [render.com](https://render.com)**
2. **Se connecter** avec votre compte GitHub
3. **Cliquer sur "New +"** → **"Web Service"**
4. **Connecter le repository** : `AbdouazizDEV/Agence_de_Voyage_API`
5. **Sélectionner la branche** : `main`

### Étape 3: Configuration du Service

#### Informations de base
- **Name:** `agence-de-voyage-api` (ou votre choix)
- **Region:** Choisissez la région la plus proche (ex: Frankfurt, Allemagne)
- **Branch:** `main`
- **Root Directory:** (laissez vide)

#### Configuration Docker
- **Environment:** `Docker`
- **Dockerfile Path:** `Dockerfile` (par défaut, Render le détecte automatiquement)
- **Docker Context:** `.` (racine du projet)

#### Build & Deploy
- **Build Command:** (laissez vide - Docker gère tout)
- **Start Command:** (laissez vide - défini dans Dockerfile)

#### Health Check (Optionnel mais recommandé)
- **Health Check Path:** `/api`

### Étape 4: Variables d'Environnement

**⚠️ IMPORTANT:** Ajoutez toutes ces variables dans la section "Environment" :

```env
# Base de données
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_minimum_32_caracteres
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise_minimum_32_caracteres
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://votre-frontend.com

# Supabase Storage (optionnel)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_service_key
SUPABASE_STORAGE_BUCKET=imagesVoyages
```

**Notes importantes :**
- `PORT` : Render fournit automatiquement le port, mais vous pouvez le définir à `3000`
- `DATABASE_URL` : Utilisez votre URL Supabase avec le pooler
- `DIRECT_URL` : Utilisez votre URL Supabase directe (pour migrations Prisma)

### Étape 5: Déployer

1. **Cliquez sur "Create Web Service"**
2. **Render va automatiquement :**
   - Détecter le Dockerfile
   - Builder l'image Docker
   - Déployer le conteneur
   - Démarrer l'application

### Étape 6: Vérifier le Déploiement

Une fois déployé, votre API sera accessible sur :
- **Base URL:** `https://votre-service.onrender.com`
- **Swagger:** `https://votre-service.onrender.com/api/docs`
- **API v1:** `https://votre-service.onrender.com/api/v1/...`

## 🔍 Vérification

### Test de santé
```bash
curl https://votre-service.onrender.com/api
```

### Test Swagger
Ouvrez dans votre navigateur :
```
https://votre-service.onrender.com/api/docs
```

### Test d'endpoint
```bash
curl https://votre-service.onrender.com/api/v1/offers
```

## 📊 Avantages de Docker sur Render

1. **Environnement reproductible** : Même environnement en dev et prod
2. **Build optimisé** : Multi-stage build pour images légères
3. **Sécurité** : Utilisateur non-root
4. **Isolation** : Conteneur isolé avec toutes les dépendances
5. **Facilité de déploiement** : Render gère automatiquement Docker

## 🐛 Dépannage

### Problème : Build échoue
**Solution :**
- Vérifiez les logs dans Render
- Assurez-vous que `DATABASE_URL` et `DIRECT_URL` sont définis
- Vérifiez que Prisma peut se connecter à la base de données

### Problème : Application ne démarre pas
**Solution :**
- Vérifiez les logs dans Render
- Assurez-vous que toutes les variables d'environnement sont définies
- Vérifiez que le port est correct (Render fournit `PORT` automatiquement)

### Problème : Erreur Prisma
**Solution :**
- Vérifiez que `npx prisma generate` s'exécute correctement
- Assurez-vous que `DATABASE_URL` est accessible depuis Render
- Vérifiez les permissions de la base de données

### Problème : Timeout
**Solution :**
- Le premier démarrage peut prendre 1-2 minutes (cold start)
- Vérifiez les logs pour voir où ça bloque

## 📝 Commandes Docker Locales (pour tester)

### Build l'image
```bash
docker build -t agence-de-voyage-api .
```

### Lancer le conteneur
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="votre_url" \
  -e JWT_SECRET="votre_secret" \
  agence-de-voyage-api
```

### Avec docker-compose
```bash
docker-compose up --build
```

## ⚠️ Limitations du Plan Gratuit Render

- **Sleep après 15 min d'inactivité** : Le service se met en veille
- **Démarrage lent** : Premier démarrage peut prendre 30-60 secondes après veille
- **Limite de ressources** : 512 MB RAM, 0.5 CPU

## 🎯 Checklist de Déploiement

- [ ] Fichiers Docker créés et poussés sur GitHub
- [ ] Service créé sur Render avec Docker
- [ ] Toutes les variables d'environnement ajoutées
- [ ] Build réussi
- [ ] Application accessible
- [ ] Swagger fonctionne (`/api/docs`)
- [ ] API fonctionne (`/api/v1/offers`)

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le dashboard Render
2. Vérifiez que toutes les variables d'environnement sont définies
3. Testez l'image Docker localement avec `docker-compose up`

