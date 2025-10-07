import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiGatewayService {
  private readonly serviceUrls: Record<string, string>;

  constructor(private configService: ConfigService) {
    this.serviceUrls = {
      auth: this.configService.get('AUTH_SERVICE_URL', 'http://localhost:3001'),
      leads: this.configService.get(
        'LEADS_SERVICE_URL',
        'http://localhost:3002',
      ),
      clients: this.configService.get(
        'CLIENTS_SERVICE_URL',
        'http://localhost:3003',
      ),
      products: this.configService.get(
        'PRODUCTS_SERVICE_URL',
        'http://localhost:3004',
      ),
      activities: this.configService.get(
        'ACTIVITIES_SERVICE_URL',
        'http://localhost:3005',
      ),
      tasks: this.configService.get(
        'TASKS_SERVICE_URL',
        'http://localhost:3006',
      ),
      notifications: this.configService.get(
        'NOTIFICATIONS_SERVICE_URL',
        'http://localhost:3007',
      ),
    };
  }

  getInfo() {
    return {
      name: 'Austral CRM ERP Seguros - API Gateway',
      version: '1.0.0',
      description: 'API Gateway para microservicios de seguros',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV', 'development'),
    };
  }

  healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: Object.keys(this.serviceUrls),
      uptime: process.uptime(),
    };
  }

  getAvailableServices() {
    return {
      services: Object.entries(this.serviceUrls).map(([name, url]) => ({
        name,
        url,
        status: 'configured', // En una implementación real, verificaríamos el estado
      })),
    };
  }

  async proxyToService(
    serviceName: string,
    method: string,
    path: string,
    data?: any,
  ) {
    const serviceUrl = this.serviceUrls[serviceName];

    if (!serviceUrl) {
      throw new Error(`Servicio ${serviceName} no configurado`);
    }

    // En una implementación real, aquí haríamos la petición HTTP al microservicio
    // Por ahora, retornamos un mock con la información de proxy
    return {
      message: `Proxy to ${serviceName} service`,
      method,
      url: `${serviceUrl}${path}`,
      data,
      timestamp: new Date().toISOString(),
      note: 'This is a mock response. In production, this would forward the request to the actual microservice.',
    };
  }

  getHello(): string {
    return 'API Gateway - Austral CRM ERP Seguros';
  }
}
