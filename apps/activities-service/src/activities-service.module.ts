import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesController } from './controllers';
import { ActividadesService } from './services';
import { Actividad } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [ActividadesService],
})
export class ActivitiesServiceModule {}
