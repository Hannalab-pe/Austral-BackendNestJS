import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  getInfo() {
    return this.apiGatewayService.getInfo();
  }

  @Get('health')
  healthCheck() {
    return this.apiGatewayService.healthCheck();
  }

  @Get('services')
  getServices() {
    return this.apiGatewayService.getAvailableServices();
  }

  // Proxy endpoints para auth-service
  @Post('auth/login')
  async authLogin(@Body() loginData: any) {
    return this.apiGatewayService.proxyToService(
      'auth',
      'POST',
      '/auth/login',
      loginData,
    );
  }

  @Post('auth/register')
  async authRegister(@Body() userData: any) {
    return this.apiGatewayService.proxyToService(
      'auth',
      'POST',
      '/auth/register',
      userData,
    );
  }

  // Proxy endpoints para leads-service
  @Get('leads')
  async getLeads() {
    return this.apiGatewayService.proxyToService('leads', 'GET', '/leads');
  }

  @Post('leads')
  async createLead(@Body() leadData: any) {
    return this.apiGatewayService.proxyToService(
      'leads',
      'POST',
      '/leads',
      leadData,
    );
  }

  // Proxy endpoints para clients-service
  @Get('clients')
  async getClients() {
    return this.apiGatewayService.proxyToService('clients', 'GET', '/clients');
  }

  @Post('clients')
  async createClient(@Body() clientData: any) {
    return this.apiGatewayService.proxyToService(
      'clients',
      'POST',
      '/clients',
      clientData,
    );
  }
}
