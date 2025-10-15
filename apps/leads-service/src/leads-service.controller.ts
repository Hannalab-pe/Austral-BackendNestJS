import { Controller, Get } from '@nestjs/common';
import { LeadsServiceService } from './leads-service.service';

@Controller()
export class LeadsServiceController {
  constructor(private readonly leadsService: LeadsServiceService) {}

  @Get()
  getHello(): string {
    return this.leadsService.getHello();
  }
}
