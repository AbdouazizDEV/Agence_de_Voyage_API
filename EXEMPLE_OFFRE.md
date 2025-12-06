# 📋 Exemple Complet de Données pour une Offre

## Exemple avec cURL (FormData)

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/admin/offers' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer VOTRE_TOKEN_JWT' \
  -H 'Content-Type: multipart/form-data' \
  -F 'title=Séjour Découverte à Zanzibar' \
  -F 'destination=Zanzibar, Tanzanie' \
  -F 'category=Séjours' \
  -F 'price=650000' \
  -F 'currency=FCFA' \
  -F 'duration=7' \
  -F 'description=Découvrez les plages paradisiaques de Zanzibar avec ce séjour tout compris de 7 jours. Profitez de l\'eau turquoise, des plages de sable blanc et de la culture swahilie authentique. Hébergement dans un resort de luxe en bord de mer avec vue panoramique.' \
  -F 'itinerary=[{"day":1,"title":"Arrivée et installation","description":"Transfert aéroport, check-in à l\'hôtel, dîner de bienvenue"},{"day":2,"title":"Journée plage","description":"Détente sur la plage, activités nautiques (kayak, paddle)"},{"day":3,"title":"Excursion Stone Town","description":"Visite de la vieille ville de Zanzibar, classée au patrimoine mondial de l\'UNESCO"},{"day":4,"title":"Snorkeling","description":"Découverte des fonds marins et des récifs coralliens"},{"day":5,"title":"Journée libre","description":"Activités au choix : spa, plage, ou excursions optionnelles"},{"day":6,"title":"Safari bleu","description":"Excursion en bateau, observation des dauphins, déjeuner sur une île déserte"},{"day":7,"title":"Départ","description":"Petit-déjeuner, temps libre, transfert aéroport"}]' \
  -F 'included=["Vol aller-retour Dakar-Zanzibar","Hébergement 7 nuits en resort 4*","Petit-déjeuner buffet quotidien","Dîner tous les soirs","Transferts aéroport-hôtel","Guide local francophone","Assurance voyage de base"]' \
  -F 'excluded=["Déjeuners","Boissons (sauf eau et thé)","Activités optionnelles (plongée, spa)","Pourboires","Assurance annulation","Frais de visa"]' \
  -F 'is_active=true' \
  -F 'is_promotion=true' \
  -F 'promotion_discount=15' \
  -F 'promotion_ends_at=2025-12-31T23:59:59Z' \
  -F 'available_seats=15' \
  -F 'max_capacity=30' \
  -F 'departure_date=2025-06-15T08:00:00Z' \
  -F 'return_date=2025-06-22T18:00:00Z' \
  -F 'tags=["plage","romantique","aventure","luxe","famille"]' \
  -F 'difficulty=easy' \
  -F 'images=@image1.jpg' \
  -F 'images=@image2.jpg' \
  -F 'images=@image3.jpg'
```

## Exemple avec JSON (pour référence)

```json
{
  "title": "Séjour Découverte à Zanzibar",
  "destination": "Zanzibar, Tanzanie",
  "category": "Séjours",
  "price": 650000,
  "currency": "FCFA",
  "duration": 7,
  "description": "Découvrez les plages paradisiaques de Zanzibar avec ce séjour tout compris de 7 jours. Profitez de l'eau turquoise, des plages de sable blanc et de la culture swahilie authentique. Hébergement dans un resort de luxe en bord de mer avec vue panoramique.",
  "itinerary": [
    {
      "day": 1,
      "title": "Arrivée et installation",
      "description": "Transfert aéroport, check-in à l'hôtel, dîner de bienvenue"
    },
    {
      "day": 2,
      "title": "Journée plage",
      "description": "Détente sur la plage, activités nautiques (kayak, paddle)"
    },
    {
      "day": 3,
      "title": "Excursion Stone Town",
      "description": "Visite de la vieille ville de Zanzibar, classée au patrimoine mondial de l'UNESCO"
    },
    {
      "day": 4,
      "title": "Snorkeling",
      "description": "Découverte des fonds marins et des récifs coralliens"
    },
    {
      "day": 5,
      "title": "Journée libre",
      "description": "Activités au choix : spa, plage, ou excursions optionnelles"
    },
    {
      "day": 6,
      "title": "Safari bleu",
      "description": "Excursion en bateau, observation des dauphins, déjeuner sur une île déserte"
    },
    {
      "day": 7,
      "title": "Départ",
      "description": "Petit-déjeuner, temps libre, transfert aéroport"
    }
  ],
  "included": [
    "Vol aller-retour Dakar-Zanzibar",
    "Hébergement 7 nuits en resort 4*",
    "Petit-déjeuner buffet quotidien",
    "Dîner tous les soirs",
    "Transferts aéroport-hôtel",
    "Guide local francophone",
    "Assurance voyage de base"
  ],
  "excluded": [
    "Déjeuners",
    "Boissons (sauf eau et thé)",
    "Activités optionnelles (plongée, spa)",
    "Pourboires",
    "Assurance annulation",
    "Frais de visa"
  ],
  "is_active": true,
  "is_promotion": true,
  "promotion_discount": 15,
  "promotion_ends_at": "2025-12-31T23:59:59Z",
  "available_seats": 15,
  "max_capacity": 30,
  "departure_date": "2025-06-15T08:00:00Z",
  "return_date": "2025-06-22T18:00:00Z",
  "tags": [
    "plage",
    "romantique",
    "aventure",
    "luxe",
    "famille"
  ],
  "difficulty": "easy"
}
```

## Exemple pour Mise à Jour (PATCH)

```bash
curl -X 'PATCH' \
  'http://localhost:3000/api/v1/admin/offers/ID_DE_L_OFFRE' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer VOTRE_TOKEN_JWT' \
  -H 'Content-Type: multipart/form-data' \
  -F 'title=Séjour Découverte à Zanzibar - Édition Spéciale' \
  -F 'price=600000' \
  -F 'promotion_discount=20' \
  -F 'images_action=add' \
  -F 'images=@nouvelle_image.jpg'
```

## Détails des Champs

### Champs Obligatoires
- **title** (string) : Titre de l'offre
- **destination** (string) : Destination (ex: "Zanzibar, Tanzanie")
- **category** (string) : Nom de la catégorie (ex: "Vols", "Hôtels", "Séjours", "Packages", "Croisières", "Circuits")
- **price** (number) : Prix en FCFA
- **duration** (number) : Durée en jours
- **description** (string) : Description détaillée

### Champs Optionnels

#### Images
- **images** (array de fichiers) : Fichiers images à uploader (max 10)
  - Format : fichiers binaires (jpg, png, webp, etc.)
  - Pour la mise à jour : utiliser `images_action=add` ou `images_action=replace`

#### Itinéraire
- **itinerary** (JSON string) : Itinéraire détaillé
  ```json
  [
    {
      "day": 1,
      "title": "Titre du jour",
      "description": "Description optionnelle"
    }
  ]
  ```

#### Services
- **included** (JSON string array) : Services inclus
  ```json
  ["Service 1", "Service 2", "Service 3"]
  ```

- **excluded** (JSON string array) : Services exclus
  ```json
  ["Service 1", "Service 2"]
  ```

#### Promotion
- **is_promotion** (boolean) : `true` si en promotion
- **promotion_discount** (number) : Pourcentage de réduction (0-100)
- **promotion_ends_at** (ISO 8601) : Date de fin de promotion (ex: "2025-12-31T23:59:59Z")

#### Dates
- **departure_date** (ISO 8601) : Date de départ (ex: "2025-06-15T08:00:00Z")
- **return_date** (ISO 8601) : Date de retour (ex: "2025-06-22T18:00:00Z")

#### Capacité
- **available_seats** (number) : Nombre de places disponibles
- **max_capacity** (number) : Capacité maximale

#### Autres
- **currency** (string) : Devise (défaut: "FCFA")
- **is_active** (boolean) : Offre active (défaut: `true`)
- **tags** (JSON string array) : Tags associés
  ```json
  ["tag1", "tag2", "tag3"]
  ```
- **difficulty** (string) : Niveau de difficulté (`easy`, `moderate`, `hard`)

## Exemples de Catégories Disponibles

Les catégories doivent correspondre exactement aux noms dans la base de données :
- `Vols`
- `Hôtels`
- `Séjours`
- `Packages`
- `Croisières`
- `Circuits`

## Format des Dates (ISO 8601)

Toutes les dates doivent être au format ISO 8601 :
- Format : `YYYY-MM-DDTHH:mm:ssZ`
- Exemple : `2025-06-15T08:00:00Z`
- Exemple avec timezone : `2025-06-15T08:00:00+00:00`

## Notes Importantes

1. **FormData** : Tous les champs doivent être envoyés en FormData (multipart/form-data)
2. **JSON Strings** : Les champs `itinerary`, `included`, `excluded`, et `tags` doivent être des strings JSON valides
3. **Images** : Les images sont uploadées vers Supabase Storage automatiquement
4. **Types** : Les nombres et booléens peuvent être envoyés comme strings (seront convertis automatiquement)
5. **Validation** : La catégorie doit exister et être active dans la base de données

## Exemple Minimal (Création)

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/admin/offers' \
  -H 'Authorization: Bearer TOKEN' \
  -F 'title=Vol Dakar-Paris' \
  -F 'destination=Paris, France' \
  -F 'category=Vols' \
  -F 'price=450000' \
  -F 'duration=1' \
  -F 'description=Vol direct Dakar-Paris avec Air France'
```

## Exemple avec Postman

1. Méthode : `POST` ou `PATCH`
2. URL : `http://localhost:3000/api/v1/admin/offers` (ou `/:id` pour PATCH)
3. Headers :
   - `Authorization: Bearer VOTRE_TOKEN`
4. Body : `form-data`
5. Ajouter chaque champ comme une clé-valeur
6. Pour les fichiers images : sélectionner "File" au lieu de "Text"
7. Pour les JSON strings : coller le JSON directement dans la valeur

