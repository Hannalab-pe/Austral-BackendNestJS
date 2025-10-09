import { Controller, Get, Param } from '@nestjs/common';
import { ProxyService } from '../services/proxy.service';

@Controller('health')
export class HealthController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async checkGatewayHealth() {
    return {
      service: 'api-gateway',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('services')
  async checkAllServicesHealth() {
    const services = await this.proxyService.checkAllServicesHealth();

    const overallStatus = services.every(
      (service) => service.status === 'healthy',
    )
      ? 'healthy'
      : 'degraded';

    return {
      gateway: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      services,
      overall: {
        status: overallStatus,
        healthyServices: services.filter((s) => s.status === 'healthy').length,
        totalServices: services.length,
      },
    };
  }

  @Get('service/:serviceName')
  async checkServiceHealth(@Param('serviceName') serviceName: string) {
    return await this.proxyService.checkServiceHealth(serviceName);
  }
}
