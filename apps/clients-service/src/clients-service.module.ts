import { Module } from '@nestjs/common';
import { ClientsServiceController } from './clients-service.controller';
import { ClientsServiceService } from './clients-service.service';

@Module({
  imports: [],
  controllers: [ClientsServiceController],
  providers: [ClientsServiceService],
})
export class ClientsServiceModule {}
