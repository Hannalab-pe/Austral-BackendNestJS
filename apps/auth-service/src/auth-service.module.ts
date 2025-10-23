import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { RolesController } from './controllers/roles.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { PermisosController } from './controllers/permisos.controller';
import { AuditoriaController } from './controllers/auditoria.controller';
import { RolesService } from './services/roles.service';
import { UsuariosService } from './services/usuarios.service';
import { PermisosService } from './services/permisos.service';
import { AuditoriaService } from './services/auditoria.service';
import { Usuario, Rol, Vista, Permiso, RolVista, RolPermisoVista, Auditoria } from './entities';
import { JwtStrategy } from './strategies';

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
        entities: [Usuario, Rol, Vista, Permiso, RolVista, RolPermisoVista, Auditoria],
        synchronize: false, // NO modificar la BD existente
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Usuario, Rol, Vista, Permiso, RolVista, RolPermisoVista, Auditoria]),
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
  controllers: [AuthServiceController, RolesController, UsuariosController, PermisosController, AuditoriaController],
  providers: [AuthServiceService, RolesService, UsuariosService, PermisosService, AuditoriaService, JwtStrategy],
  exports: [AuthServiceService, RolesService, UsuariosService, PermisosService, AuditoriaService, JwtModule],
})
export class AuthServiceModule { }
