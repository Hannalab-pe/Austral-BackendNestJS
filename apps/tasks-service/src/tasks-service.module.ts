import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksServiceController } from './tasks-service.controller';
import { TasksServiceService } from './tasks-service.service';
import { TareasController } from './controllers';
import { TareasService } from './services';
import { Tarea } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'austral_seguros'),
        entities: [Tarea], // Solo las entidades de este servicio
        synchronize: false, // NO modificar la BD existente
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Tarea]),
  ],
  controllers: [TasksServiceController, TareasController],
  providers: [TasksServiceService, TareasService],
  exports: [TasksServiceService, TareasService],
})
export class TasksServiceModule {}
