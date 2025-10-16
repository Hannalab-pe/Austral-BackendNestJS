import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductsServiceModule } from './products-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsServiceModule);

  // Configuración CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', // Frontend Next.js
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Products Service API')
    .setDescription('API de gestión de productos de seguros')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3004;
  await app.listen(port);

  console.log(`📦 Products Service ejecutándose en puerto ${port}`);
  console.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api`);
}
bootstrap();
