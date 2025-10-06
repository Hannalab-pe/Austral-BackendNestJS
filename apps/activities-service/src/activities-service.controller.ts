import { Controller, Get } from '@nestjs/common';
import { ActivitiesServiceService } from './activities-service.service';

@Controller()
export class ActivitiesServiceController {
  constructor(private readonly activitiesServiceService: ActivitiesServiceService) {}

  @Get()
  getHello(): string {
    return this.activitiesServiceService.getHello();
  }
}
