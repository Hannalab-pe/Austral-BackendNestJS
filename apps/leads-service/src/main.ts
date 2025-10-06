import { NestFactory } from '@nestjs/core';
import { LeadsServiceModule } from './leads-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LeadsServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
