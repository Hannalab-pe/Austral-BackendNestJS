import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TasksServiceModule } from './tasks-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TasksServiceModule);

  // Configuración global de validación
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Tasks Service API')
    .setDescription('API para gestión de tareas del CRM ERP Seguros Austral')
    .setVersion('1.0')
    .addTag('tareas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3006);
  console.log('🚀 Tasks Service ejecutándose en puerto 3006');
  console.log('📚 Swagger UI disponible en: http://localhost:3006/api');
}
bootstrap();
