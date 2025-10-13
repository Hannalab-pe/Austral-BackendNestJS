import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LeadsServiceModule } from './leads-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LeadsServiceModule);

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Leads Service API')
    .setDescription('API para gestión de leads, estados y fuentes')
    .setVersion('1.0')
    .addTag('Leads')
    .addTag('Estados de Lead')
    .addTag('Fuentes de Lead')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Leads Service running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
