import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsServiceController } from './leads-service.controller';
import { LeadsServiceService } from './leads-service.service';
import { Lead, EstadoLead, FuenteLead } from './entities';
import { getDatabaseConfig } from 'y/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    TypeOrmModule.forFeature([Lead, EstadoLead, FuenteLead]),
  ],
  controllers: [LeadsServiceController],
  providers: [LeadsServiceService],
  exports: [LeadsServiceService],
})
export class LeadsServiceModule {}
