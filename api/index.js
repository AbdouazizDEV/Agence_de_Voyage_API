// Handler Vercel pour NestJS
// Ce fichier permet d'exécuter NestJS comme une fonction serverless sur Vercel

let app;
let expressApp;

async function loadApp() {
  if (!app) {
    try {
      // Désactiver les logs verbeux en production
      process.env.NODE_ENV = process.env.NODE_ENV || 'production';
      
      // Importer l'application compilée
      const { NestFactory } = require('@nestjs/core');
      const { AppModule } = require('../dist/app.module');
      
      // Créer l'application NestJS
      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
      });
      
      // Initialiser l'application (CORS, préfixes, etc.)
      const { ConfigService } = require('@nestjs/config');
      const configService = app.get(ConfigService);
      
      // CORS
      app.enableCors({
        origin: configService.get('CORS_ORIGIN', '*'),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      });
      
      // Préfixe global
      app.setGlobalPrefix('api');
      
      // Versioning
      const { VersioningType } = require('@nestjs/common');
      app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
      });
      
      // Validation
      const { ValidationPipe } = require('@nestjs/common');
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          disableErrorMessages: configService.get('NODE_ENV') === 'production',
        }),
      );
      
      // Filtres et interceptors
      const { HttpExceptionFilter } = require('../dist/common/filters/http-exception.filter');
      const { TransformInterceptor } = require('../dist/common/interceptors/transform.interceptor');
      const { LoggingInterceptor } = require('../dist/common/interceptors/logging.interceptor');
      const { TimeoutInterceptor } = require('../dist/common/interceptors/timeout.interceptor');
      
      app.useGlobalFilters(new HttpExceptionFilter());
      app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor(),
        new TimeoutInterceptor(configService),
      );
      
      // Swagger
      const { setupSwagger } = require('../dist/config/swagger.config');
      setupSwagger(app);
      
      // Initialiser l'application
      await app.init();
      
      // Récupérer l'instance Express
      expressApp = app.getHttpAdapter().getInstance();
      
      console.log('✅ Application NestJS chargée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'application:', error);
      throw error;
    }
  }
  
  return expressApp;
}

module.exports = async (req, res) => {
  try {
    const handler = await loadApp();
    return handler(req, res);
  } catch (error) {
    console.error('❌ Erreur dans le handler:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors du chargement de l\'application',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        timestamp: new Date().toISOString(),
        path: req.url,
      }));
    }
  }
};

