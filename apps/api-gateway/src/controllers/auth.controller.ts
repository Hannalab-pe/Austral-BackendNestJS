import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthProxyService } from '../services/auth-proxy.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Post('login')
  async login(@Body() loginData: any) {
    return this.authProxyService.login(loginData);
  }

  @Post('register')
  async register(@Body() userData: any) {
    return this.authProxyService.register(userData);
  }

  @Get('health')
  async health() {
    return {
      service: 'auth',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
