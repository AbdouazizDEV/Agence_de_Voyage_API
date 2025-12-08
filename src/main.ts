import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

/**
 * Point d'entrée de l'application
 * Configuration globale : CORS, pipes, filters, interceptors, Swagger
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);

  // CORS - Cross-Origin Resource Sharing
  // Configuration flexible pour autoriser Swagger et le frontend
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  
  // Origines par défaut (Netlify, Vercel, Render, localhost)
  const defaultOrigins = [
    'https://agencedevoyagefront.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
  ];

  // Déterminer les origines autorisées
  const allowedOrigins: string | boolean | string[] = (() => {
    // En production, si CORS_ORIGIN est défini, l'utiliser
    if (corsOrigin) {
      // Si plusieurs origines séparées par des virgules
      if (corsOrigin.includes(',')) {
        const customOrigins = corsOrigin.split(',').map((origin) => origin.trim());
        // Combiner avec les origines par défaut et dédupliquer
        const allOrigins = [...defaultOrigins, ...customOrigins];
        return [...new Set(allOrigins)]; // Supprimer les doublons
      }
      // Une seule origine personnalisée, combiner avec les défauts
      return [...defaultOrigins, corsOrigin.trim()];
    }

    // En développement, autoriser localhost et toutes les origines
    if (nodeEnv === 'development') {
      return true; // Autoriser toutes les origines en dev
    }

    // En production sans CORS_ORIGIN, utiliser les origines par défaut
    // Inclut automatiquement Netlify, Vercel, Render, et localhost
    return defaultOrigins;
  })();

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Préfixe global API
  app.setGlobalPrefix('api');

  // Versioning de l'API
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime propriétés non définies dans DTO
      forbidNonWhitelisted: true, // Erreur si propriétés non autorisées
      transform: true, // Transforme les types automatiquement
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: configService.get('NODE_ENV') === 'production',
    }),
  );

  // Filtres globaux pour gestion des erreurs
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptors globaux
  app.useGlobalInterceptors(
    new LoggingInterceptor(), // Logs de toutes les requêtes
    new TransformInterceptor(), // Transformation format réponse standard
    new TimeoutInterceptor(configService), // Timeout 30s par défaut
  );

  // Configuration Swagger
  setupSwagger(app);

  // Render fournit le port via process.env.PORT
  const port = process.env.PORT || configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0'); // Écouter sur toutes les interfaces pour Render

  console.log(`
  ╔════════════════════════════════════════════════════════════════╗
  ║                                                                ║
  ║   🚀 Application démarrée avec succès !                        ║
  ║                                                                ║
  ║   🌐 URL: http://localhost:${port}                             ║
  ║   📚 Swagger: http://localhost:${port}/api/docs                ║
  ║   🔐 Version API: v1                                           ║
  ║   🛡️  Environment: ${configService.get('NODE_ENV', 'development')}║
  ║                                                                 ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
}

void bootstrap();
