import { NestFactory } from '@nestjs/core';
import { ClientsServiceModule } from './clients-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ClientsServiceModule);
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
