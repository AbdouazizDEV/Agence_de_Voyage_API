# 📦 Configuration Supabase Storage

## Problème
Si vous voyez le message `⚠️ Configuration Supabase Storage manquante - Upload désactivé`, cela signifie que les variables d'environnement Supabase ne sont pas configurées.

## Solution

### 1. Obtenir les clés Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet `Agence_de_VoyageAPI`
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (pour l'upload)

### 2. Créer le bucket Storage

1. Allez dans **Storage** dans le menu de gauche
2. Cliquez sur **New bucket**
3. Nom du bucket : `imagesVoyages`
4. Cochez **Public bucket** (pour que les images soient accessibles publiquement)
5. Cliquez sur **Create bucket**

### 3. Configurer les variables d'environnement

Éditez votre fichier `.env` :

```env
# Supabase Configuration
SUPABASE_URL=https://djjtomyrhbtsdgrfvbhr.supabase.co
SUPABASE_KEY=votre-anon-key-ici
SUPABASE_SERVICE_KEY=votre-service-role-key-ici
```

### 4. Redémarrer l'application

```bash
npm run start:dev
```

Le message d'avertissement devrait disparaître et l'upload devrait fonctionner.

## Test de l'upload

Une fois configuré, testez l'upload via Swagger :
- `POST /api/v1/admin/upload/image`
- Utilisez FormData avec le champ `file`

