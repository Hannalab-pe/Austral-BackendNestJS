import { Module } from '@nestjs/common';
import { LeadsServiceController } from './leads-service.controller';
import { LeadsServiceService } from './leads-service.service';

@Module({
  imports: [],
  controllers: [LeadsServiceController],
  providers: [LeadsServiceService],
})
export class LeadsServiceModule {}
