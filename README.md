# 🌍 Travel Agency API - Backend NestJS

API REST complète pour plateforme d'agence de voyage avec automatisation WhatsApp.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase (gratuit)

### Installation

1. Cloner le repository

```bash
git clone https://github.com/AbdouazizDEV/travel-agency-backend.git
cd travel-agency-backend
```

2. Installer les dépendances

```bash
npm install
```

3. Configuration environnement

```bash
cp .env.example .env
# Éditer .env avec vos valeurs Supabase
```

4. Créer les tables Supabase

- Aller sur https://supabase.com
- Créer un nouveau projet
- Copier l'URL et la clé anon dans .env
- Exécuter les migrations SQL (dans `/src/database/migrations/`)

5. Lancer l'application

```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

6. Accéder à Swagger

```
http://localhost:3000/api/docs
```

## 📁 Structure du Projet

```
src/
├── common/              # Éléments partagés (DRY)
│   ├── constants/      # Constantes applicatives
│   ├── decorators/     # Decorators réutilisables
│   ├── dto/           # DTOs communs
│   ├── filters/       # Filtres d'erreurs
│   ├── guards/         # Guards d'authentification
│   ├── interceptors/  # Interceptors
│   ├── interfaces/    # Interfaces TypeScript
│   ├── pipes/         # Pipes de validation
│   └── utils/         # Utilitaires
├── config/            # Configuration (Open/Closed)
├── modules/           # Modules métier (Single Responsibility)
│   ├── auth/         # Authentification
│   ├── offers/       # Offres de voyage
│   ├── whatsapp/     # Automatisation WhatsApp
│   ├── categories/   # Catégories
│   ├── dashboard/    # Dashboard admin
│   ├── upload/       # Upload fichiers
│   └── settings/     # Paramètres
└── database/         # Base de données
    ├── migrations/   # Migrations SQL
    └── seeds/       # Données de test
```

## 🏗️ Architecture SOLID

Cette API respecte strictement les principes SOLID :

- **S**ingle Responsibility : Chaque classe/module a une seule responsabilité
- **O**pen/Closed : Ouvert à l'extension, fermé à la modification
- **L**iskov Substitution : Les sous-classes peuvent remplacer leurs classes de base
- **I**nterface Segregation : Interfaces spécifiques plutôt que générales
- **D**ependency Inversion : Dépendre d'abstractions, pas de concrétions

## 🔐 Authentification

L'API utilise JWT avec access token et refresh token :

1. **Login** : `POST /api/v1/auth/login`
2. **Refresh** : `POST /api/v1/auth/refresh`

Les tokens doivent être inclus dans le header :
```
Authorization: Bearer <access_token>
```

## 📚 Documentation API

La documentation Swagger est disponible sur :
```
http://localhost:3000/api/docs
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## 🛠️ Technologies

- **Framework** : NestJS
- **Langage** : TypeScript
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : JWT
- **Documentation** : Swagger/OpenAPI
- **Validation** : class-validator, class-transformer

## 📝 Variables d'Environnement

Voir `.env.example` pour la liste complète des variables.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 👤 Auteur

**Abdou Aziz DIOP**

- Email: abdouazizdiop583@gmail.com
- GitHub: [@AbdouazizDEV](https://github.com/AbdouazizDEV)

---

Made with ❤️ using NestJS
