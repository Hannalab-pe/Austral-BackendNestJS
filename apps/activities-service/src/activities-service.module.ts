import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ActivitiesServiceController } from './activities-service.controller';
import { ActividadesController } from './controllers/actividades.controller';
import { ActividadesService } from './services/actividades.service';
import { AuditoriaService } from './services/auditoria.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Actividad } from './entities/actividad.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'austral-jwt-secret-2024'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'railway'),
        entities: [Actividad],
        synchronize: true, // Temporalmente true para crear tablas
      }),
    }),
    TypeOrmModule.forFeature([Actividad]),
  ],
  controllers: [ActivitiesServiceController, ActividadesController],
  providers: [ActividadesService, AuditoriaService, JwtStrategy],
  exports: [ActividadesService],
})
export class ActivitiesServiceModule { }
