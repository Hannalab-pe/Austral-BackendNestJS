import { NestFactory } from '@nestjs/core';
import { ActivitiesServiceModule } from './activities-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ActivitiesServiceModule);
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
