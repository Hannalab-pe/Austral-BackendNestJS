import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TiposSegurosController,
  CompaniasSeguroController,
  ProductosSeguroController,
  PolizaController,
} from './controllers';
import {
  TiposSegurosService,
  CompaniasSeguroService,
  ProductosSeguroService,
  PolizaService,
} from './services';
import { TipoSeguro, CompaniaSeguro, ProductoSeguro, Poliza } from './entities';

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
        entities: [TipoSeguro, CompaniaSeguro, ProductoSeguro, Poliza],
        synchronize: false, // Desactivado - usar migraciones o scripts SQL
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([TipoSeguro, CompaniaSeguro, ProductoSeguro, Poliza]),
  ],
  controllers: [
    TiposSegurosController,
    CompaniasSeguroController,
    ProductosSeguroController,
    PolizaController,
  ],
  providers: [
    TiposSegurosService,
    CompaniasSeguroService,
    ProductosSeguroService,
    PolizaService,
  ],
  exports: [
    TiposSegurosService,
    CompaniasSeguroService,
    ProductosSeguroService,
    PolizaService,
  ],
})
export class ProductsServiceModule {}
