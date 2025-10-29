import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ClientesController, ContactosClienteController, DocumentsController } from './controllers';
import { ClientesService, ContactosClienteService, DocumentsService } from './services';
import { Cliente, ClienteContacto, ClienteDocumento, Beneficiario } from './entities';
import { JwtStrategy } from './strategies/jwt.strategy';

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
        entities: [Cliente, ClienteContacto, ClienteDocumento, Beneficiario],
        synchronize: false, // NO modificar la BD existente
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Cliente, ClienteContacto, ClienteDocumento, Beneficiario]),
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
    MulterModule.register({
      dest: './uploads', // Directorio temporal para archivos subidos
    }),
  ],
  controllers: [ClientesController, ContactosClienteController, DocumentsController],
  providers: [ClientesService, ContactosClienteService, DocumentsService, JwtStrategy],
  exports: [ClientesService, ContactosClienteService, DocumentsService],
})
export class ClientsServiceModule { }
