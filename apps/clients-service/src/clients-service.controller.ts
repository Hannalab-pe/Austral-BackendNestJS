import { Controller, Get } from '@nestjs/common';
import { ClientsServiceService } from './clients-service.service';

@Controller()
export class ClientsServiceController {
  constructor(private readonly clientsServiceService: ClientsServiceService) {}

  @Get()
  getHello(): string {
    return this.clientsServiceService.getHello();
  }
}
