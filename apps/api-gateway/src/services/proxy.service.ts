import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getServiceUrl(serviceName: string): string {
    const serviceUrls = {
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

    return serviceUrls[serviceName];
  }

  async forwardRequest(
    serviceName: string,
    method: string,
    path: string,
    data?: any,
    headers?: any,
    params?: any,
  ): Promise<any> {
    const serviceUrl = this.getServiceUrl(serviceName);
    const url = `${serviceUrl}${path}`;

    try {
      let response;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(url, { headers, params }),
          );
          break;
        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(url, data, { headers, params }),
          );
          break;
        case 'PUT':
          response = await firstValueFrom(
            this.httpService.put(url, data, { headers, params }),
          );
          break;
        case 'PATCH':
          response = await firstValueFrom(
            this.httpService.patch(url, data, { headers, params }),
          );
          break;
        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(url, { headers, params }),
          );
          break;
        default:
          throw new Error(`Método HTTP ${method} no soportado`);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        // El servicio respondió con un error
        throw new Error(
          `Error del servicio ${serviceName}: ${error.response.data?.message || error.message}`,
        );
      } else if (error.request) {
        // No se pudo contactar con el servicio
        throw new Error(`No se pudo contactar con el servicio ${serviceName}`);
      } else {
        // Error en la configuración de la petición
        throw new Error(`Error en la petición: ${error.message}`);
      }
    }
  }

  async checkServiceHealth(
    serviceName: string,
  ): Promise<{ service: string; status: string; timestamp: string }> {
    try {
      const serviceUrl = this.getServiceUrl(serviceName);
      const response = await firstValueFrom(
        this.httpService.get(`${serviceUrl}/health`, { timeout: 5000 }),
      );

      return {
        service: serviceName,
        status: 'healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: serviceName,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkAllServicesHealth(): Promise<any[]> {
    const services = [
      'auth',
      'leads',
      'clients',
      'products',
      'activities',
      'tasks',
      'notifications',
    ];

    const healthChecks = await Promise.all(
      services.map((service) => this.checkServiceHealth(service)),
    );

    return healthChecks;
  }
}
