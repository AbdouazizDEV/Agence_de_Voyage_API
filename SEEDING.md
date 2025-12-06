# 🌱 Guide de Seeding - Base de Données

Ce guide explique comment peupler la base de données avec des données de test.

## 📋 Données créées

Le seeder crée automatiquement :

### 👥 Administrateurs (3)
- **admin@travelagency.sn** / `Admin123!` (super_admin)
- **manager@travelagency.sn** / `Manager123!` (admin)
- **assistant@travelagency.sn** / `Assistant123!` (admin)

### 👤 Clients (12)
- 12 clients de test avec des noms sénégalais
- Email : `client1@example.com` à `client12@example.com`
- Mot de passe : `Client123!`
- Tous actifs sauf `client11@example.com`

### 📂 Catégories (6)
- Vols ✈️
- Hôtels 🏨
- Séjours 🏖️
- Packages 🎁
- Croisières 🚢
- Circuits 🗺️

### 🎫 Offres (10)
- **2 Vols** : Dakar-Paris, Dakar-New York (avec promotion)
- **2 Hôtels** : Radisson Blu Dakar, Pullman Paris (avec promotion)
- **3 Séjours** : Zanzibar, Marrakech (avec promotion), Cap-Vert
- **3 Packages** : Dubaï, Istanbul (avec promotion), Safari Kenya

Chaque offre inclut :
- Images (URLs Unsplash)
- Itinéraires détaillés
- Éléments inclus/exclus
- Ratings, reviews, bookings, views
- Dates de départ/retour (pour certains)
- Tags et difficulté

### 📱 Logs WhatsApp (5)
- 5 logs de test avec différents statuts
- Liés aux offres créées

## 🚀 Utilisation

### Lancer le seeder

```bash
npm run seed
```

Ou avec Prisma directement :

```bash
npm run db:seed
```

### Réinitialiser et re-seeder

Si vous voulez réinitialiser complètement la base :

```bash
# Supprimer toutes les données (ATTENTION : destructif)
npx prisma migrate reset

# Ou simplement re-lancer le seed (utilise upsert, donc met à jour si existe)
npm run seed
```

## ⚙️ Configuration

Le seeder utilise `upsert` pour éviter les doublons :
- Si un admin/client existe déjà (par email), il est mis à jour
- Si une catégorie existe déjà (par slug), elle est mise à jour
- Si une offre existe déjà (par slug), elle est mise à jour

## 📝 Personnalisation

Pour modifier les données, éditez le fichier :
```
prisma/seed.ts
```

### Ajouter plus d'offres

Ajoutez simplement des objets dans le tableau `offers` de la fonction `seedOffers()`.

### Modifier les mots de passe

Les mots de passe sont hashés avec bcrypt. Pour changer :
1. Modifiez le mot de passe dans `seed.ts`
2. Le hash sera généré automatiquement

## 🔒 Sécurité

⚠️ **Important** : Ne jamais utiliser ces données en production !

Les mots de passe sont simples et prévisibles. Ce seeder est uniquement pour le développement et les tests.

## 🧪 Tests

Après le seeding, vous pouvez tester :

1. **Connexion admin** :
   ```
   POST /api/v1/auth/admin/login
   {
     "email": "admin@travelagency.sn",
     "password": "Admin123!"
   }
   ```

2. **Connexion client** :
   ```
   POST /api/v1/auth/client/login
   {
     "email": "client1@example.com",
     "password": "Client123!"
   }
   ```

3. **Voir les offres** :
   ```
   GET /api/v1/offers
   ```

4. **Voir les promotions** :
   ```
   GET /api/v1/offers/promotions
   ```

## 📊 Statistiques créées

- **3 admins** (1 super_admin, 2 admins)
- **12 clients** (11 actifs, 1 inactif)
- **6 catégories** (toutes actives)
- **10 offres** (avec variété de prix, durées, destinations)
- **5 logs WhatsApp** (différents statuts)

Toutes les données sont prêtes pour tester l'application ! 🎉

