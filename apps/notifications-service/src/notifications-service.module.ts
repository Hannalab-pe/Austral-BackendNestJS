import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesController } from './controllers';
import { NotificacionesService } from './services';
import { Notificacion } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificationsServiceModule {}
