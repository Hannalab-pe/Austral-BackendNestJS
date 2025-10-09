import { NestFactory } from '@nestjs/core';
import { LeadsServiceModule } from './leads-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LeadsServiceModule);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
