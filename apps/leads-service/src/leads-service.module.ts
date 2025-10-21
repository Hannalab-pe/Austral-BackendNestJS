import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsServiceController } from './leads-service.controller';
import { LeadsServiceService } from './leads-service.service';
import { Lead, EstadoLead, FuenteLead } from './entities';
import { DetalleSeguroAuto } from './entities/detalle-seguro-auto.entity';
import { DetalleSeguroSalud } from './entities/detalle-seguro-salud.entity';
import { DetalleSeguroScrt } from './entities/detalle-seguro-scrt.entity';
import { LeadsController } from './controllers/leads.controller';
import { EstadosLeadController } from './controllers/estados-lead.controller';
import { FuentesLeadController } from './controllers/fuentes-lead.controller';
import { DetalleSeguroAutoController } from './controllers/detalle-seguro-auto.controller';
import { DetalleSeguroSaludController } from './controllers/detalle-seguro-salud.controller';
import { DetalleSeguroScrtController } from './controllers/detalle-seguro-scrt.controller';
import { LeadsService } from './services/leads.service';
import { EstadosLeadService } from './services/estados-lead.service';
import { FuentesLeadService } from './services/fuentes-lead.service';
import { DetalleSeguroAutoService } from './services/detalle-seguro-auto.service';
import { DetalleSeguroSaludService } from './services/detalle-seguro-salud.service';
import { DetalleSeguroScrtService } from './services/detalle-seguro-scrt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'railway'),
        entities: [Lead, EstadoLead, FuenteLead, DetalleSeguroAuto, DetalleSeguroSalud, DetalleSeguroScrt],
        synchronize: true, // Temporalmente true para crear tablas
      }),
    }),
    TypeOrmModule.forFeature([Lead, EstadoLead, FuenteLead, DetalleSeguroAuto, DetalleSeguroSalud, DetalleSeguroScrt]),
  ],
  controllers: [
    LeadsServiceController,
    LeadsController,
    EstadosLeadController,
    FuentesLeadController,
    DetalleSeguroAutoController,
    DetalleSeguroSaludController,
    DetalleSeguroScrtController,
  ],
  providers: [
    LeadsServiceService,
    LeadsService,
    EstadosLeadService,
    FuentesLeadService,
    DetalleSeguroAutoService,
    DetalleSeguroSaludService,
    DetalleSeguroScrtService,
  ],
  exports: [
    LeadsServiceService,
    LeadsService,
    EstadosLeadService,
    FuentesLeadService,
    DetalleSeguroAutoService,
    DetalleSeguroSaludService,
    DetalleSeguroScrtService,
  ],
})
export class LeadsServiceModule {}
