import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Configuration Swagger - Documentation API interactive
 * Principe SOLID : Single Responsibility - Configure uniquement Swagger
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Travel Agency API')
    .setDescription(`
      # 🌍 API Plateforme Agence de Voyage
      
      ## Description
      API REST complète pour la gestion d'une plateforme d'agence de voyage avec automatisation WhatsApp.
      
      ## Fonctionnalités
      - 🔐 Authentification JWT sécurisée
      - 🌍 Gestion complète des offres de voyage (CRUD)
      - 🔍 Recherche avancée avec filtres multiples
      - 💬 Automatisation WhatsApp pour demandes clients
      - 📊 Dashboard administrateur avec statistiques
      - 📤 Upload et gestion d'images
      - 📂 Gestion des catégories
      
      ## Architecture
      - **Backend:** NestJS + TypeScript
      - **Base de données:** Supabase (PostgreSQL)
      - **Authentification:** JWT (Access + Refresh tokens)
      - **Documentation:** Swagger/OpenAPI 3.0
      
      ## Principes SOLID
      Cette API respecte strictement les principes SOLID pour garantir:
      - Maintenabilité
      - Extensibilité
      - Testabilité
      - Réutilisabilité
      
      ## Sécurité
      - Validation stricte des données (class-validator)
      - Hachage bcrypt des mots de passe
      - Protection CSRF
      - Rate limiting
      - CORS configuré
      
      ## Support
      - **Email:** abdouazizdiop583@gmail.com
      - **GitHub:** https://github.com/AbdouazizDEV
    `)
    .setVersion('1.0.0')
    .setContact(
      'Abdou Aziz DIOP',
      'https://github.com/AbdouazizDEV',
      'abdouazizdiop583@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Auth', 'Endpoints d\'authentification (Login, Logout, Refresh)')
    .addTag('Offers', 'Gestion des offres de voyage (Public)')
    .addTag('Offers Admin', 'Gestion des offres (Administration)')
    .addTag('Search', 'Recherche et filtres avancés')
    .addTag('WhatsApp', 'Automatisation WhatsApp')
    .addTag('Categories', 'Gestion des catégories')
    .addTag('Dashboard', 'Statistiques et analytics')
    .addTag('Upload', 'Upload et gestion de fichiers')
    .addTag('Settings', 'Configuration et paramètres')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT (obtenu via /auth/login)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Serveur de développement')
    .addServer('https://agencedevoyageapi.netlify.app', 'Serveur Netlify')
    .addServer('https://agence-de-voyage-api.onrender.com', 'Serveur Render')
    .addServer('https://api.travel-agency.com', 'Serveur de production')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        theme: 'monokai',
      },
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Travel Agency API Docs',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .scheme-container { background: #fafafa; padding: 20px; margin-bottom: 20px; }
    `,
    customfavIcon: '/favicon.ico',
  });

  console.log('📚 Swagger documentation disponible sur: http://localhost:3000/api/docs');
}

