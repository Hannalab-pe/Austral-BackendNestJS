import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LeadsServiceModule } from './leads-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LeadsServiceModule);

  // Configurar CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

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
    .setDescription(
      'API REST para la gestión completa de leads de seguros, ' +
      'incluyendo estados, fuentes, cotizaciones y detalles de seguros específicos (auto, salud, SCTR). ' +
      'Permite crear, consultar y actualizar leads, así como calcular cotizaciones personalizadas.'
    )
    .setVersion('1.0')
    .setContact(
      'Equipo de Desarrollo',
      'https://austral.pe',
      'soporte@austral.pe'
    )
    .addTag('Leads', 'Gestión de leads - creación, consulta y actualización')
    .addTag('Estados de Lead', 'Administración de estados del proceso de leads')
    .addTag('Fuentes de Lead', 'Gestión de fuentes de origen de leads')
    .addTag('Cotizaciones', 'Cálculo de cotizaciones para seguros de auto, salud y SCTR')
    .addTag('Detalle Seguro Auto', 'Información detallada de seguros vehiculares')
    .addTag('Detalle Seguro Salud', 'Información detallada de seguros de salud')
    .addTag('Detalle Seguro SCTR', 'Información detallada de seguros SCTR')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Leads Service running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
