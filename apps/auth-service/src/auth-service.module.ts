import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { Usuario, Asociado } from './entities';
import { Rol, Permiso, RolPermiso, getDatabaseConfig } from 'y/common';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    TypeOrmModule.forFeature([Usuario, Rol, Permiso, RolPermiso, Asociado]),
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
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, JwtStrategy],
  exports: [AuthServiceService, JwtModule],
})
export class AuthServiceModule {}
