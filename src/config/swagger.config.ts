import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Configuration Swagger - Documentation API interactive
 * Principe SOLID : Single Responsibility - Configure uniquement Swagger
 */
export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Déterminer l'URL du serveur actuel
  const getServerUrl = (): string => {
    // En production, essayer de détecter l'URL depuis les variables d'environnement
    const renderUrl = process.env.RENDER_EXTERNAL_URL;
    const vercelUrl = process.env.VERCEL_URL;
    const customUrl = process.env.API_URL;

    if (customUrl) {
      return customUrl;
    }

    if (renderUrl) {
      return renderUrl;
    }

    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }

    // En développement, utiliser localhost
    return 'http://localhost:3000';
  };

  const currentServerUrl = getServerUrl();
  const isProduction = nodeEnv === 'production';

  const documentBuilder = new DocumentBuilder()
    .setTitle('Travel Agency API')
    .setDescription(
      `
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
    `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Abdou Aziz DIOP',
      'https://github.com/AbdouazizDEV',
      'abdouazizdiop583@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Auth', "Endpoints d'authentification (Login, Logout, Refresh)")
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
    );

  // Ajouter le serveur actuel en premier (sera sélectionné par défaut)
  documentBuilder.addServer(
    currentServerUrl,
    isProduction
      ? 'Serveur de production (actuel)'
      : 'Serveur de développement (actuel)',
  );

  // Ajouter les autres serveurs comme alternatives
  if (isProduction) {
    // En production, ajouter localhost comme alternative pour les tests locaux
    documentBuilder.addServer(
      'http://localhost:3000',
      'Serveur local (pour tests)',
    );
  } else {
    // En développement, ajouter les serveurs de production comme alternatives
    documentBuilder.addServer(
      'https://agence-de-voyage-api-1.onrender.com',
      'Serveur Render',
    );
    documentBuilder.addServer(
      'https://agencedevoyageapi.netlify.app',
      'Serveur Netlify',
    );
  }

  const config = documentBuilder.build();

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
      // Sélectionner automatiquement le premier serveur (le serveur actuel)
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
    customSiteTitle: 'Travel Agency API Docs',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .scheme-container { background: #fafafa; padding: 20px; margin-bottom: 20px; }
    `,
    customfavIcon: '/favicon.ico',
  });

  console.log(
    `📚 Swagger documentation disponible sur: ${currentServerUrl}/api/docs`,
  );
}
