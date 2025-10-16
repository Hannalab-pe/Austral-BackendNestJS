import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TiposSegurosController,
  CompaniasSeguroController,
  ProductosSeguroController,
} from './controllers';
import {
  TiposSegurosService,
  CompaniasSeguroService,
  ProductosSeguroService,
} from './services';
import { TipoSeguro, CompaniaSeguro, ProductoSeguro } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'austral_seguros'),
        entities: [TipoSeguro, CompaniaSeguro, ProductoSeguro],
        synchronize: false, // NO modificar la BD existente
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TipoSeguro, CompaniaSeguro, ProductoSeguro]),
  ],
  controllers: [
    TiposSegurosController,
    CompaniasSeguroController,
    ProductosSeguroController,
  ],
  providers: [
    TiposSegurosService,
    CompaniasSeguroService,
    ProductosSeguroService,
  ],
  exports: [
    TiposSegurosService,
    CompaniasSeguroService,
    ProductosSeguroService,
  ],
})
export class ProductsServiceModule {}
