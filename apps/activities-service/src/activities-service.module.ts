import { Module } from '@nestjs/common';
import { ActivitiesServiceController } from './activities-service.controller';
import { ActivitiesServiceService } from './activities-service.service';

@Module({
  imports: [],
  controllers: [ActivitiesServiceController],
  providers: [ActivitiesServiceService],
})
export class ActivitiesServiceModule {}
