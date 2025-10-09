import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ProxyController } from './controllers/proxy.controller';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';
import { ProxyService } from './services/proxy.service';
import { AuthProxyService } from './services/auth-proxy.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu-secreto-jwt-aqui',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    ApiGatewayController,
    ProxyController,
    AuthController,
    HealthController,
  ],
  providers: [ApiGatewayService, ProxyService, AuthProxyService],
})
export class ApiGatewayModule {}
