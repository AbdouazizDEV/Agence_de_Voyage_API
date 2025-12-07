# 🎯 PROMPT CURSOR COMPLET - INITIALISATION FRONTEND REACT

## 📋 CONTEXTE DU PROJET

Vous devez créer un frontend React moderne pour une **plateforme d'agence de voyage** qui se connecte à une API NestJS existante.

### Architecture Backend (Référence)
- **Framework:** NestJS + TypeScript
- **Base de données:** PostgreSQL (Prisma)
- **Authentification:** JWT (Access + Refresh tokens)
- **API Version:** v1 (préfixe `/api/v1`)
- **Documentation:** Swagger disponible sur `/api/docs`
- **CORS:** Configuré pour `http://localhost:5173`

### Structure Backend (Modules)
- **Auth:** Authentification Admin et Client séparée
- **Offers:** Gestion des offres de voyage (public + admin)
- **Categories:** Catégories de voyages (public + admin)
- **Reservations:** Réservations clients avec paiements
- **Dashboard:** Statistiques admin
- **Settings:** Paramètres application
- **Upload:** Upload d'images (FormData)
- **WhatsApp:** Automatisation WhatsApp

### Format de Réponse API Standardisé
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}
```

### Codes d'Erreur API
- `INTERNAL_SERVER_ERROR`, `VALIDATION_ERROR`, `NOT_FOUND`
- `UNAUTHORIZED`, `FORBIDDEN`, `INVALID_CREDENTIALS`, `TOKEN_EXPIRED`, `TOKEN_INVALID`
- `RESOURCE_NOT_FOUND`, `RESOURCE_ALREADY_EXISTS`, `RESOURCE_CONFLICT`
- `INVALID_INPUT`, `MISSING_REQUIRED_FIELD`
- `FILE_TOO_LARGE`, `INVALID_FILE_TYPE`, `UPLOAD_FAILED`

---

## 🎯 OBJECTIF

Créer un frontend React moderne, professionnel et maintenable qui :
1. ✅ Se connecte à l'API NestJS existante
2. ✅ Respecte strictement les **principes SOLID**
3. ✅ Utilise **TypeScript** avec configuration stricte
4. ✅ Implémente une architecture modulaire et scalable
5. ✅ Gère l'authentification Admin et Client séparément
6. ✅ Fournit une UX moderne et responsive
7. ✅ Gère les erreurs de manière centralisée
8. ✅ Supporte la pagination, filtres, recherche
9. ✅ Gère les uploads d'images (FormData)
10. ✅ Implémente les notifications en temps réel

---

## 🛠️ STACK TECHNIQUE REQUISE

### Core
- **React 18+** (avec hooks modernes)
- **TypeScript 5+** (mode strict)
- **Vite** (build tool et dev server)
- **React Router v6** (routing)

### State Management
- **Zustand** ou **Redux Toolkit** (gestion d'état globale)
- **React Query (TanStack Query)** (gestion des requêtes API et cache)

### UI & Styling
- **Tailwind CSS** (utility-first CSS)
- **shadcn/ui** ou **Radix UI** (composants accessibles)
- **React Hook Form** (gestion de formulaires)
- **Zod** (validation de schémas)

### HTTP Client
- **Axios** (avec interceptors pour JWT)

### Utilitaires
- **date-fns** (manipulation de dates)
- **react-hot-toast** ou **sonner** (notifications toast)
- **react-icons** (icônes)
- **clsx** ou **cn** (gestion de classes conditionnelles)

### Dev Tools
- **ESLint** (linting)
- **Prettier** (formatage)
- **TypeScript strict mode**

---

## 📁 STRUCTURE DE PROJET (SOLID)

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                    # Configuration app (main.tsx, App.tsx)
│   ├── common/                 # Éléments partagés (DRY)
│   │   ├── constants/         # Constantes (API_URL, ROUTES, etc.)
│   │   ├── types/             # Types TypeScript partagés
│   │   ├── utils/             # Utilitaires (formatters, validators)
│   │   ├── hooks/             # Hooks React réutilisables
│   │   └── components/        # Composants UI réutilisables
│   │       ├── ui/            # Composants de base (Button, Input, Card, etc.)
│   │       ├── layout/        # Layout components (Header, Footer, Sidebar)
│   │       └── feedback/     # Loading, Error, Empty states
│   ├── features/              # Features métier (Feature-Sliced Design)
│   │   ├── auth/              # Module Authentification
│   │   │   ├── api/           # Appels API (authApi.ts)
│   │   │   ├── components/   # Composants spécifiques (LoginForm, RegisterForm)
│   │   │   ├── hooks/         # Hooks métier (useAuth, useLogin)
│   │   │   ├── store/         # State management (authStore.ts)
│   │   │   ├── types/         # Types spécifiques (AuthUser, TokenPayload)
│   │   │   └── utils/         # Utilitaires (tokenStorage)
│   │   ├── offers/            # Module Offres
│   │   │   ├── api/
│   │   │   ├── components/    # OfferCard, OfferList, OfferFilters, OfferDetails
│   │   │   ├── hooks/         # useOffers, useOffer, useSearchOffers
│   │   │   ├── store/
│   │   │   └── types/
│   │   ├── reservations/      # Module Réservations (Client)
│   │   ├── admin/             # Module Administration
│   │   │   ├── offers/        # Gestion offres admin
│   │   │   ├── clients/       # Gestion clients admin
│   │   │   ├── categories/    # Gestion catégories admin
│   │   │   ├── dashboard/    # Dashboard admin
│   │   │   └── settings/     # Paramètres admin
│   │   └── shared/           # Features partagées
│   │       ├── notifications/ # Système de notifications
│   │       └── upload/        # Upload d'images
│   ├── config/                # Configuration (Open/Closed)
│   │   ├── api.config.ts      # Configuration Axios
│   │   ├── routes.config.ts   # Configuration routes
│   │   └── env.config.ts      # Variables d'environnement
│   ├── core/                  # Core de l'application
│   │   ├── interceptors/     # Axios interceptors (auth, errors)
│   │   ├── guards/            # Route guards (ProtectedRoute, AdminRoute)
│   │   └── providers/         # Context providers (QueryClient, etc.)
│   └── assets/                # Images, fonts, etc.
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🔧 CONFIGURATION INITIALE

### 1. Initialiser le projet

```bash
# Créer le projet avec Vite + React + TypeScript
npm create vite@latest frontend -- --template react-ts

cd frontend

# Installer les dépendances de base
npm install
```

### 2. Installer toutes les dépendances

```bash
# Core
npm install react-router-dom

# State Management & Data Fetching
npm install @tanstack/react-query zustand

# HTTP Client
npm install axios

# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react  # Alternative à react-icons

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Notifications
npm install sonner  # ou react-hot-toast

# Utilitaires
npm install date-fns

# Dev Dependencies
npm install -D @types/node
npm install -D eslint-config-prettier prettier
```

### 3. Configuration TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@common/*": ["src/common/*"],
      "@features/*": ["src/features/*"],
      "@config/*": ["src/config/*"],
      "@core/*": ["src/core/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Configuration Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, './src/common'),
      '@features': path.resolve(__dirname, './src/features'),
      '@config': path.resolve(__dirname, './src/config'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### 5. Configuration Tailwind CSS

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
```

---

## 🏗️ ARCHITECTURE SOLID - IMPLÉMENTATION

### Principe 1: Single Responsibility (SRP)

Chaque module/feature a une responsabilité unique :

```typescript
// ❌ MAUVAIS: Un composant qui fait tout
function OfferCard({ offer }) {
  // Affiche l'offre
  // Gère l'état
  // Fait l'appel API
  // Gère les erreurs
}

// ✅ BON: Séparation des responsabilités
// features/offers/components/OfferCard.tsx - Affiche uniquement
// features/offers/hooks/useOffers.ts - Gère les appels API
// features/offers/store/offersStore.ts - Gère l'état global
```

### Principe 2: Open/Closed (OCP)

Extensible sans modification :

```typescript
// config/api.config.ts - Configuration centralisée
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
};

// core/interceptors/auth.interceptor.ts - Extensible
export const authInterceptor = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
```

### Principe 3: Liskov Substitution (LSP)

Interfaces communes pour les composants :

```typescript
// common/types/component.types.ts
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// common/components/ui/Button.tsx
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}
```

### Principe 4: Interface Segregation (ISP)

Interfaces spécifiques et minimales :

```typescript
// ❌ MAUVAIS: Interface trop large
interface User {
  id: string;
  email: string;
  role: string;
  // ... 50 autres propriétés
}

// ✅ BON: Interfaces séparées
interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'client';
}

interface AdminProfile extends AuthUser {
  first_name: string;
  last_name: string;
}

interface ClientProfile extends AuthUser {
  first_name: string;
  last_name: string;
  phone?: string;
}
```

### Principe 5: Dependency Inversion (DIP)

Dépendre d'abstractions, pas d'implémentations :

```typescript
// features/auth/api/authApi.interface.ts
export interface IAuthApi {
  login(credentials: LoginDto): Promise<AuthResponse>;
  register(data: RegisterDto): Promise<AuthResponse>;
  refreshToken(token: string): Promise<AuthResponse>;
  logout(): Promise<void>;
}

// features/auth/api/authApi.ts - Implémentation
export class AuthApi implements IAuthApi {
  // Implémentation avec Axios
}

// features/auth/hooks/useAuth.ts - Utilise l'interface
export const useAuth = (api: IAuthApi = authApi) => {
  // Utilise l'interface, pas l'implémentation directe
};
```

---

## 📦 MODULES À CRÉER

### 1. Module Authentification (`features/auth/`)

**Structure:**
```
auth/
├── api/
│   ├── authApi.interface.ts
│   ├── authApi.ts              # Appels API (login, register, refresh, logout)
│   └── authApi.types.ts        # Types pour les requêtes/réponses
├── components/
│   ├── LoginForm.tsx           # Formulaire de connexion
│   ├── RegisterForm.tsx        # Formulaire d'inscription
│   ├── AdminLoginForm.tsx      # Connexion admin
│   └── ClientRegisterForm.tsx  # Inscription client
├── hooks/
│   ├── useAuth.ts              # Hook principal d'authentification
│   ├── useLogin.ts             # Hook pour login
│   ├── useRegister.ts          # Hook pour register
│   └── useRefreshToken.ts      # Hook pour refresh token
├── store/
│   └── authStore.ts            # Zustand store (user, tokens, isAuthenticated)
├── types/
│   ├── AuthUser.ts
│   ├── TokenPayload.ts
│   └── AuthResponse.ts
└── utils/
    ├── tokenStorage.ts         # Gestion localStorage (access/refresh tokens)
    └── authHelpers.ts         # Helpers (isTokenExpired, etc.)
```

**Fonctionnalités:**
- Login Admin (`POST /api/v1/auth/admin/login`)
- Register Admin (`POST /api/v1/auth/admin/register`)
- Login Client (`POST /api/v1/auth/client/login`)
- Register Client (`POST /api/v1/auth/client/register`)
- Refresh Token (`POST /api/v1/auth/refresh` ou `/api/v1/auth/client/refresh`)
- Logout (`POST /api/v1/auth/logout`)
- Get Profile (`GET /api/v1/auth/admin/profile` ou `/api/v1/auth/client/profile`)

### 2. Module Offres (`features/offers/`)

**Structure:**
```
offers/
├── api/
│   ├── offersApi.ts
│   └── offersApi.types.ts
├── components/
│   ├── OfferCard.tsx           # Carte d'offre
│   ├── OfferList.tsx           # Liste d'offres avec pagination
│   ├── OfferFilters.tsx        # Filtres avancés
│   ├── OfferDetails.tsx        # Détails d'une offre
│   ├── OfferSearch.tsx         # Barre de recherche
│   └── OfferSuggestions.tsx    # Suggestions d'offres
├── hooks/
│   ├── useOffers.ts            # Liste avec pagination
│   ├── useOffer.ts             # Détails d'une offre
│   ├── useSearchOffers.ts      # Recherche avec filtres
│   ├── usePromotions.ts        # Offres en promotion
│   └── usePopularOffers.ts     # Offres populaires
├── store/
│   └── offersStore.ts          # Filtres, état de recherche
└── types/
    └── Offer.ts                # Type Offer complet
```

**Fonctionnalités:**
- Liste des offres avec pagination (`GET /api/v1/offers`)
- Détails d'une offre (`GET /api/v1/offers/:id`)
- Recherche avancée (`GET /api/v1/offers?search=...&category=...&minPrice=...`)
- Offres en promotion (`GET /api/v1/offers/promotions`)
- Offres populaires (`GET /api/v1/offers/popular`)
- Suggestions (`GET /api/v1/offers/suggestions`)

### 3. Module Réservations (`features/reservations/`)

**Structure:**
```
reservations/
├── api/
│   ├── reservationsApi.ts
│   └── paymentsApi.ts
├── components/
│   ├── ReservationCard.tsx
│   ├── ReservationList.tsx
│   ├── ReservationForm.tsx     # Formulaire de réservation
│   ├── PaymentForm.tsx         # Formulaire de paiement
│   └── ReservationDetails.tsx
├── hooks/
│   ├── useReservations.ts
│   ├── useReservation.ts
│   ├── useCreateReservation.ts
│   ├── useCancelReservation.ts
│   └── usePayments.ts
└── types/
    ├── Reservation.ts
    └── Payment.ts
```

**Fonctionnalités:**
- Créer réservation (`POST /api/v1/reservations`)
- Liste réservations (`GET /api/v1/reservations`)
- Détails réservation (`GET /api/v1/reservations/:id`)
- Annuler réservation (`POST /api/v1/reservations/:id/cancel`)
- Effectuer paiement (`POST /api/v1/reservations/payments`)
- Historique paiements (`GET /api/v1/reservations/:id/payments`)

### 4. Module Administration (`features/admin/`)

**Structure:**
```
admin/
├── offers/
│   ├── api/
│   ├── components/
│   │   ├── AdminOfferList.tsx
│   │   ├── AdminOfferForm.tsx  # Créer/Modifier offre (FormData)
│   │   └── AdminOfferFilters.tsx
│   └── hooks/
├── clients/
│   ├── api/
│   ├── components/
│   └── hooks/
├── categories/
│   ├── api/
│   ├── components/
│   └── hooks/
├── dashboard/
│   ├── api/
│   ├── components/
│   │   ├── StatsCards.tsx
│   │   ├── ViewsChart.tsx
│   │   └── WhatsAppRequests.tsx
│   └── hooks/
└── settings/
    ├── api/
    ├── components/
    └── hooks/
```

**Fonctionnalités:**
- CRUD Offres (avec upload images FormData)
- CRUD Clients
- CRUD Catégories
- Dashboard avec statistiques
- Gestion des paramètres

### 5. Module Notifications (`features/shared/notifications/`)

**Structure:**
```
notifications/
├── api/
│   └── notificationsApi.ts
├── components/
│   ├── NotificationBell.tsx    # Badge avec nombre non lus
│   ├── NotificationList.tsx    # Liste des notifications
│   └── NotificationItem.tsx
├── hooks/
│   ├── useNotifications.ts
│   ├── useUnreadCount.ts
│   └── useMarkAsRead.ts
└── types/
    └── Notification.ts
```

**Fonctionnalités:**
- Liste notifications (`GET /api/v1/reservations/notifications/list`)
- Nombre non lus (`GET /api/v1/reservations/notifications/unread-count`)
- Marquer comme lu (`POST /api/v1/reservations/notifications/:id/read`)
- Marquer tout comme lu (`POST /api/v1/reservations/notifications/read-all`)

---

## 🔐 GESTION AUTHENTIFICATION

### 1. Configuration Axios avec Interceptors

```typescript
// core/interceptors/auth.interceptor.ts
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@features/auth/utils/tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Ajoute le token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Gère refresh token automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Appel API pour refresh
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);

        // Retry la requête originale
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh échoué - déconnexion
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 2. Route Guards

```typescript
// core/guards/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/store/authStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// core/guards/AdminRoute.tsx
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

---

## 🎨 COMPOSANTS UI DE BASE

Créer des composants réutilisables dans `common/components/ui/` :

- **Button** - Bouton avec variants (primary, secondary, outline, ghost)
- **Input** - Input text avec validation
- **Card** - Carte conteneur
- **Modal** - Modal/Dialog
- **Select** - Select dropdown
- **Checkbox** - Checkbox
- **Radio** - Radio button
- **Badge** - Badge/Tag
- **Spinner** - Loading spinner
- **Toast** - Notifications toast
- **Pagination** - Pagination component
- **ImageUpload** - Upload d'images avec preview

---

## 📝 EXEMPLE D'IMPLÉMENTATION COMPLÈTE

### Hook useOffers (avec React Query)

```typescript
// features/offers/hooks/useOffers.ts
import { useQuery } from '@tanstack/react-query';
import { offersApi } from '../api/offersApi';
import { Offer, SearchFilters } from '../types/Offer';

export const useOffers = (filters?: SearchFilters, page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['offers', filters, page, limit],
    queryFn: () => offersApi.getAll(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Composant OfferCard

```typescript
// features/offers/components/OfferCard.tsx
import { Offer } from '../types/Offer';
import { Card } from '@common/components/ui/Card';
import { Badge } from '@common/components/ui/Badge';
import { format } from 'date-fns';

interface OfferCardProps {
  offer: Offer;
  onClick?: () => void;
}

export const OfferCard = ({ offer, onClick }: OfferCardProps) => {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition-shadow">
      <img src={offer.images[0]} alt={offer.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{offer.title}</h3>
          {offer.is_promotion && (
            <Badge variant="destructive">-{offer.promotion_discount}%</Badge>
          )}
        </div>
        <p className="text-gray-600 mb-2">{offer.destination}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{offer.price.toLocaleString()} {offer.currency}</span>
          <span className="text-sm text-gray-500">{offer.duration} jours</span>
        </div>
      </div>
    </Card>
  );
};
```

---

## 🚀 COMMANDES DE DÉMARRAGE

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Lint
npm run lint

# Format
npm run format
```

---

## ✅ CHECKLIST DE VALIDATION

- [ ] TypeScript strict mode activé
- [ ] Tous les modules respectent SOLID
- [ ] Authentification Admin et Client séparée
- [ ] Gestion des tokens (access + refresh) avec refresh automatique
- [ ] Route guards implémentés
- [ ] Gestion d'erreurs centralisée
- [ ] Pagination fonctionnelle
- [ ] Recherche et filtres avancés
- [ ] Upload d'images (FormData)
- [ ] Notifications en temps réel
- [ ] Responsive design (mobile-first)
- [ ] Accessibilité (a11y) de base
- [ ] Tests unitaires (optionnel mais recommandé)

---

## 📚 RESSOURCES

- **API Documentation:** `http://localhost:3000/api/docs` (Swagger)
- **Backend Repository:** `git@github.com:AbdouazizDEV/Agence_de_Voyage_API.git`
- **React Query Docs:** https://tanstack.com/query/latest
- **Zustand Docs:** https://zustand-demo.pmnd.rs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Router:** https://reactrouter.com/

---

**🎯 COMMENCEZ PAR:**
1. Initialiser le projet avec Vite
2. Installer toutes les dépendances
3. Configurer TypeScript, Vite, Tailwind
4. Créer la structure de dossiers
5. Implémenter le module Auth en premier
6. Créer les composants UI de base
7. Implémenter les autres modules progressivement

**BONNE CHANCE ! 🚀**

