import { NestFactory } from '@nestjs/core';
import { ProductsServiceModule } from './products-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsServiceModule);
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
