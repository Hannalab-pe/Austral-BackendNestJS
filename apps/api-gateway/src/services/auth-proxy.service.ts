import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthProxyService {
  private readonly authServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.authServiceUrl = this.configService.get(
      'AUTH_SERVICE_URL',
      'http://localhost:3001',
    );
  }

  async login(loginData: any) {
    // Aquí iría la lógica para hacer la petición al auth-service
    // Por ahora retornamos un mock
    return {
      message: 'Login proxy to auth-service',
      url: `${this.authServiceUrl}/auth/login`,
      data: loginData,
    };
  }

  async register(userData: any) {
    return {
      message: 'Register proxy to auth-service',
      url: `${this.authServiceUrl}/auth/register`,
      data: userData,
    };
  }
}
