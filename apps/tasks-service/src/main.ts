import { NestFactory } from '@nestjs/core';
import { TasksServiceModule } from './tasks-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TasksServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
