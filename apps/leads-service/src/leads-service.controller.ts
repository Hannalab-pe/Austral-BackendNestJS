import { Controller, Get } from '@nestjs/common';
import { LeadsServiceService } from './leads-service.service';

@Controller()
export class LeadsServiceController {
  constructor(private readonly leadsServiceService: LeadsServiceService) {}

  @Get()
  getHello(): string {
    return this.leadsServiceService.getHello();
  }
}
