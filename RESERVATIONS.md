# 📋 Documentation - Système de Réservations

## Vue d'ensemble

Le système de réservations permet aux clients de :
- Créer des réservations pour des offres
- Effectuer des paiements (simulés)
- Consulter leur historique de réservations
- Annuler des réservations (avec remboursement automatique)
- Recevoir des notifications automatiques

## 🗄️ Modèles de données

### Reservation
- `id`: UUID
- `client_id`: UUID (référence au client)
- `offer_id`: UUID (référence à l'offre)
- `number_of_guests`: Nombre de voyageurs
- `total_amount`: Montant total (avec réduction si promotion)
- `currency`: Devise (par défaut: FCFA)
- `status`: `pending` | `confirmed` | `cancelled` | `completed`
- `reservation_date`: Date de création
- `departure_date`: Date de départ (optionnelle, peut être personnalisée)
- `return_date`: Date de retour (optionnelle, peut être personnalisée)
- `special_requests`: Demandes spéciales
- `cancellation_reason`: Raison d'annulation (si annulée)

### Payment
- `id`: UUID
- `reservation_id`: UUID (référence à la réservation)
- `amount`: Montant payé
- `currency`: Devise
- `payment_method`: `card` | `mobile_money` | `bank_transfer` | `cash`
- `status`: `pending` | `completed` | `failed` | `refunded`
- `transaction_id`: ID de transaction (généré automatiquement)
- `payment_date`: Date du paiement
- `refund_amount`: Montant remboursé (si annulation)
- `refund_date`: Date du remboursement
- `refund_reason`: Raison du remboursement

### Notification
- `id`: UUID
- `client_id`: UUID (référence au client)
- `reservation_id`: UUID (référence à la réservation, optionnel)
- `type`: Type de notification
  - `reservation_created`: Réservation créée
  - `payment_completed`: Paiement effectué
  - `reservation_cancelled`: Réservation annulée
  - `reservation_reminder`: Rappel de réservation (7, 3, 1 jour avant)
  - `payment_reminder`: Rappel de paiement
- `title`: Titre de la notification
- `message`: Message de la notification
- `is_read`: Statut de lecture
- `read_at`: Date de lecture

## 🔐 Authentification

Tous les endpoints nécessitent une authentification client via JWT.
Utilisez le token obtenu lors de la connexion client (`POST /api/v1/auth/client/login`).

## 📡 Endpoints

### Réservations

#### 1. Créer une réservation
```http
POST /api/v1/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "offerId": "uuid-de-l-offre",
  "numberOfGuests": 2,
  "specialRequests": "Chambre avec vue sur mer",
  "departureDate": "2025-06-15T00:00:00Z",  // Optionnel
  "returnDate": "2025-06-22T00:00:00Z"      // Optionnel
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "client_id": "uuid",
    "offer_id": "uuid",
    "number_of_guests": 2,
    "total_amount": 520000,
    "currency": "FCFA",
    "status": "pending",
    "reservation_date": "2025-12-06T10:00:00Z",
    ...
  },
  "message": "Réservation créée avec succès"
}
```

**Validations:**
- L'offre doit exister et être active
- Le nombre de voyageurs ne doit pas dépasser la capacité maximale
- Les places disponibles doivent être suffisantes

**Comportement:**
- Calcul automatique du montant total (avec réduction si promotion)
- Décrémentation des places disponibles
- Création d'une notification

#### 2. Liste des réservations
```http
GET /api/v1/reservations?page=1&limit=12&status=confirmed
Authorization: Bearer {token}
```

**Paramètres de requête:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 12)
- `status`: Filtrer par statut (`pending`, `confirmed`, `cancelled`, `completed`)

**Réponse:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

#### 3. Détails d'une réservation
```http
GET /api/v1/reservations/{id}
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "client_id": "uuid",
    "offer_id": "uuid",
    "number_of_guests": 2,
    "total_amount": 520000,
    "currency": "FCFA",
    "status": "confirmed",
    ...
  }
}
```

#### 4. Annuler une réservation
```http
POST /api/v1/reservations/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Changement de plan"  // Optionnel
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "cancelled",
    "cancelled_at": "2025-12-06T10:00:00Z",
    ...
  },
  "message": "Réservation annulée avec succès. Remboursement en cours."
}
```

**Comportement:**
- Changement du statut à `cancelled`
- Remboursement automatique de tous les paiements complétés
- Restauration des places disponibles
- Création d'une notification

**Validations:**
- La réservation doit appartenir au client
- La réservation ne doit pas être déjà annulée
- La réservation ne doit pas être complétée

### Paiements

#### 5. Effectuer un paiement
```http
POST /api/v1/reservations/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservationId": "uuid-de-la-reservation",
  "paymentMethod": "card",
  "transactionId": "TXN123456"  // Optionnel (généré automatiquement si non fourni)
}
```

**Méthodes de paiement:**
- `card`: Carte bancaire
- `mobile_money`: Mobile Money
- `bank_transfer`: Virement bancaire
- `cash`: Espèces

**Réponse:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "uuid",
      "reservation_id": "uuid",
      "amount": 520000,
      "currency": "FCFA",
      "payment_method": "card",
      "status": "completed",
      "transaction_id": "TXN-1234567890-abc123",
      "payment_date": "2025-12-06T10:00:00Z"
    },
    "reservation": {
      "id": "uuid",
      "status": "confirmed",
      ...
    }
  },
  "message": "Paiement effectué avec succès"
}
```

**Comportement:**
- Le paiement est simulé (toujours réussi)
- Génération automatique d'un ID de transaction
- Mise à jour du statut de la réservation à `confirmed`
- Création d'une notification

**Validations:**
- La réservation doit appartenir au client
- La réservation ne doit pas être annulée
- Aucun paiement complété ne doit exister déjà

#### 6. Historique des paiements
```http
GET /api/v1/reservations/{id}/payments
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "reservation_id": "uuid",
      "amount": 520000,
      "currency": "FCFA",
      "payment_method": "card",
      "status": "completed",
      "transaction_id": "TXN-1234567890-abc123",
      "payment_date": "2025-12-06T10:00:00Z"
    }
  ]
}
```

### Notifications

#### 7. Liste des notifications
```http
GET /api/v1/reservations/notifications/list?page=1&limit=20&isRead=false&type=reservation_reminder
Authorization: Bearer {token}
```

**Paramètres de requête:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 20)
- `isRead`: Filtrer par statut de lecture (`true` | `false`)
- `type`: Filtrer par type de notification

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "client_id": "uuid",
      "reservation_id": "uuid",
      "type": "reservation_reminder",
      "title": "Rappel de réservation",
      "message": "Votre voyage commence dans 7 jours...",
      "is_read": false,
      "created_at": "2025-12-06T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

#### 8. Nombre de notifications non lues
```http
GET /api/v1/reservations/notifications/unread-count
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

#### 9. Marquer une notification comme lue
```http
POST /api/v1/reservations/notifications/{id}/read
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

#### 10. Marquer toutes les notifications comme lues
```http
POST /api/v1/reservations/notifications/read-all
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "message": "5 notification(s) marquée(s) comme lue(s)"
}
```

## 🔔 Notifications automatiques

Le système envoie automatiquement des notifications dans les cas suivants :

### 1. Rappels de réservation
- **7 jours avant le départ**: "Votre voyage commence dans 7 jours..."
- **3 jours avant le départ**: "Votre voyage commence dans 3 jours..."
- **1 jour avant le départ**: "Départ demain !"

Ces notifications sont envoyées quotidiennement à 9h00 (via cron job).

### 2. Rappels de paiement
- Si une réservation est en statut `pending` depuis plus de 24h sans paiement complété, un rappel est envoyé.

Ces notifications sont vérifiées toutes les heures.

## 💡 Exemples d'utilisation

### Scénario complet : Créer une réservation et payer

```bash
# 1. Se connecter en tant que client
curl -X POST http://localhost:3000/api/v1/auth/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client1@example.com",
    "password": "Client123!"
  }'

# 2. Créer une réservation
curl -X POST http://localhost:3000/api/v1/reservations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-de-l-offre",
    "numberOfGuests": 2,
    "specialRequests": "Chambre avec vue sur mer"
  }'

# 3. Effectuer le paiement
curl -X POST http://localhost:3000/api/v1/reservations/payments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "uuid-de-la-reservation",
    "paymentMethod": "card"
  }'

# 4. Consulter les notifications
curl -X GET http://localhost:3000/api/v1/reservations/notifications/list \
  -H "Authorization: Bearer {token}"
```

## ⚠️ Notes importantes

1. **Paiements simulés**: Les paiements sont toujours réussis dans cette version. Pour une production, intégrez un vrai système de paiement (Stripe, PayPal, etc.).

2. **Remboursements**: Lors de l'annulation, tous les paiements complétés sont automatiquement remboursés. Le remboursement est simulé.

3. **Places disponibles**: Les places sont automatiquement décrémentées lors de la création d'une réservation et restaurées lors de l'annulation.

4. **Notifications**: Les notifications sont créées automatiquement pour :
   - Création de réservation
   - Paiement effectué
   - Annulation de réservation
   - Rappels automatiques (7, 3, 1 jour avant le départ)
   - Rappels de paiement

5. **Sécurité**: Chaque client ne peut accéder qu'à ses propres réservations, paiements et notifications.

