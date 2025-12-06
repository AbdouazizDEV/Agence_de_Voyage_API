# 🔍 Recherche et Filtres Avancés - Documentation

## Endpoints Disponibles

### 1. GET `/api/v1/offers` - Liste avec filtres (Query String)

Récupère les offres avec filtres via query parameters.

**Exemple :**
```bash
GET /api/v1/offers?category=Séjours&minPrice=100000&maxPrice=500000&sortBy=price&sortOrder=asc&page=1&limit=12
```

**Paramètres disponibles :**
- `page` (number) : Numéro de page (défaut: 1)
- `limit` (number) : Nombre de résultats (défaut: 12, max: 100)
- `search` (string) : **Recherche textuelle générale** - Cherche dans titre, description, destination. Supporte les débuts de mots et lettres (ex: "Par" trouvera "Paris", "Paradis", etc.)
- `category` (string) : Nom de la catégorie
- `destination` (string) : Recherche par destination
- `minPrice` (number) : Prix minimum
- `maxPrice` (number) : Prix maximum
- `minDuration` (number) : Durée minimum en jours
- `maxDuration` (number) : Durée maximum en jours
- `minRating` (number) : Note minimum (0-5)
- `difficulty` (string) : `easy`, `moderate`, `hard`
- `tags` (string) : Tags séparés par virgule (ex: `"plage,romantique"`)
- `departureDate` (ISO 8601) : Date de départ minimum
- `returnDate` (ISO 8601) : Date de retour maximum
- `travelers` (number) : Nombre de voyageurs
- `isPromotion` (boolean) : Uniquement les promotions
- `sortBy` (string) : `price`, `duration`, `rating`, `createdAt`, `bookings`, `views`
- `sortOrder` (string) : `asc`, `desc`

### 2. POST `/api/v1/offers/search` - Recherche avancée (Body)

Recherche avancée avec critères multiples dans le body de la requête.

**Exemple :**
```bash
POST /api/v1/offers/search
Content-Type: application/json

{
  "destination": "Paris",
  "category": "Séjours",
  "minPrice": 100000,
  "maxPrice": 500000,
  "minDuration": 3,
  "maxDuration": 7,
  "minRating": 4.0,
  "difficulty": "easy",
  "tags": ["romantique", "culture"],
  "travelers": 2,
  "isPromotion": true,
  "sortBy": "price",
  "sortOrder": "asc",
  "page": 1,
  "limit": 12
}
```

**Body (JSON) :**
```json
{
  "search": "string (recherche textuelle générale)",
  "destination": "string",
  "category": "string",
  "minPrice": 0,
  "maxPrice": 0,
  "minDuration": 0,
  "maxDuration": 0,
  "minRating": 0,
  "difficulty": "easy | moderate | hard",
  "tags": ["string"],
  "departureDate": "2025-06-15T00:00:00Z",
  "returnDate": "2025-06-22T00:00:00Z",
  "travelers": 0,
  "isPromotion": false,
  "sortBy": "price | duration | rating | createdAt | bookings | views",
  "sortOrder": "asc | desc",
  "page": 1,
  "limit": 12
}
```

### 3. GET `/api/v1/offers/suggestions` - Suggestions

Récupère des suggestions d'offres (mélange de promotions, populaires, récentes).

**Exemple :**
```bash
GET /api/v1/offers/suggestions?limit=6
```

**Paramètres :**
- `limit` (number) : Nombre de suggestions (défaut: 6)

### 4. GET `/api/v1/offers/promotions` - Promotions

Récupère uniquement les offres en promotion active.

### 5. GET `/api/v1/offers/popular` - Populaires

Récupère les offres les plus réservées.

## Exemples d'Utilisation

### Recherche textuelle avec début de mot
```bash
# Recherche "Par" trouvera "Paris", "Paradis", "Parc", etc.
curl -X GET "http://localhost:3000/api/v1/offers?search=Par&page=1&limit=12"

# Recherche "Zan" trouvera "Zanzibar", etc.
curl -X GET "http://localhost:3000/api/v1/offers?search=Zan"
```

### Recherche simple par destination
```bash
curl -X GET "http://localhost:3000/api/v1/offers?destination=Paris&page=1&limit=12"
```

### Recherche avec filtres multiples (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/offers?category=Séjours&minPrice=100000&maxPrice=500000&minRating=4.0&difficulty=easy&sortBy=price&sortOrder=asc"
```

### Recherche avancée (POST)
```bash
curl -X POST "http://localhost:3000/api/v1/offers/search" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Zanzibar",
    "category": "Séjours",
    "minPrice": 500000,
    "maxPrice": 1000000,
    "minDuration": 5,
    "maxDuration": 10,
    "minRating": 4.5,
    "tags": ["plage", "romantique"],
    "travelers": 2,
    "isPromotion": true,
    "sortBy": "rating",
    "sortOrder": "desc",
    "page": 1,
    "limit": 12
  }'
```

### Recherche par dates
```bash
curl -X POST "http://localhost:3000/api/v1/offers/search" \
  -H "Content-Type: application/json" \
  -d '{
    "departureDate": "2025-06-15T00:00:00Z",
    "returnDate": "2025-06-30T00:00:00Z",
    "travelers": 2
  }'
```

## Logique de Filtrage

### Recherche Textuelle Générale
- `search` : Recherche dans **titre**, **description**, et **destination**
- **Insensible à la casse** : "paris" = "Paris" = "PARIS"
- **Recherche partielle** : "Par" trouvera "Paris", "Paradis", "Parc", etc.
- **Recherche dans le texte** : Cherche n'importe où dans le texte (début, milieu, fin)
- **Exemples** :
  - `search=Par` → Trouve "Paris", "Paradis", "Parc", "Séjour à Paris"
  - `search=zan` → Trouve "Zanzibar", "Zanzibar Paradise"
  - `search=rom` → Trouve "romantique", "Romantique", "romantisme"

### Filtres de Prix
- `minPrice` : Prix minimum (>=)
- `maxPrice` : Prix maximum (<=)
- Les deux peuvent être combinés pour une fourchette

### Filtres de Durée
- `minDuration` : Durée minimum en jours (>=)
- `maxDuration` : Durée maximum en jours (<=)

### Filtres de Dates
- `departureDate` : Date de départ minimum (>=)
- `returnDate` : Date de retour maximum (<=)
- Les offres doivent avoir des dates de départ/retour définies

### Filtre de Voyageurs
- `travelers` : Vérifie que l'offre a suffisamment de places disponibles
- Compare avec `available_seats` ou `max_capacity`

### Filtre de Tags
- `tags` : Array de tags
- Les offres doivent avoir **tous** les tags spécifiés (opérateur `hasEvery`)

### Filtre de Difficulté
- `difficulty` : `easy`, `moderate`, ou `hard`
- Correspondance exacte

### Filtre de Note
- `minRating` : Note minimum (0-5)
- Les offres doivent avoir une note >= `minRating`

## Tri des Résultats

### Options de tri (`sortBy`)
- `price` : Par prix
- `duration` : Par durée
- `rating` : Par note
- `createdAt` : Par date de création (défaut)
- `bookings` : Par nombre de réservations
- `views` : Par nombre de vues

### Ordre de tri (`sortOrder`)
- `asc` : Croissant
- `desc` : Décroissant (défaut)

## Pagination

Toutes les recherches retournent des résultats paginés :

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Réponse Standard

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Séjour à Paris",
      "destination": "Paris, France",
      "category": "Séjours",
      "price": 150000,
      "currency": "FCFA",
      "duration": 5,
      "description": "...",
      "images": [...],
      "rating": 4.5,
      "reviews_count": 23,
      "bookings_count": 156,
      "views_count": 1245,
      "is_promotion": true,
      "promotion_discount": 15,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Notes Importantes

1. **Tous les filtres sont optionnels** : Vous pouvez combiner plusieurs filtres
2. **Recherche insensible à la casse** : Pour `destination` et recherche textuelle
3. **Dates** : Format ISO 8601 (ex: `2025-06-15T00:00:00Z`)
4. **Tags** : Dans GET, séparés par virgule. Dans POST, array JSON
5. **Pagination** : Par défaut, page 1 avec 12 résultats
6. **Tri** : Par défaut, tri par date de création décroissante

## Performance

- Les requêtes utilisent les index de la base de données
- La pagination limite le nombre de résultats retournés
- Les filtres sont appliqués au niveau de la base de données pour optimiser les performances

