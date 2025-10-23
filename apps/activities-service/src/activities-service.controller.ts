import { Controller, Get } from '@nestjs/common';

@Controller()
export class ActivitiesServiceController {
  @Get()
  getHello(): string {
    return 'Activities Service is running! Use /api for Swagger documentation.';
  }
}
