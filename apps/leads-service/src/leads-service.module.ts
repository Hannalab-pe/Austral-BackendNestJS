import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsServiceController } from './leads-service.controller';
import { LeadsServiceService } from './leads-service.service';
import { Lead, EstadoLead, FuenteLead } from './entities';
import { DetalleSeguroAuto } from './entities/detalle-seguro-auto.entity';
import { DetalleSeguroSalud } from './entities/detalle-seguro-salud.entity';
import { DetalleSeguroSctr } from './entities/detalle-seguro-sctr.entity';
import { LeadsController } from './controllers/leads.controller';
import { EstadosLeadController } from './controllers/estados-lead.controller';
import { FuentesLeadController } from './controllers/fuentes-lead.controller';
import { DetalleSeguroAutoController } from './controllers/detalle-seguro-auto.controller';
import { DetalleSeguroSaludController } from './controllers/detalle-seguro-salud.controller';
import { DetalleSeguroSctrController } from './controllers/detalle-seguro-sctr.controller';
import { CotizacionesController } from './controllers/cotizaciones.controller';
import { LeadsService } from './services/leads.service';
import { EstadosLeadService } from './services/estados-lead.service';
import { FuentesLeadService } from './services/fuentes-lead.service';
import { DetalleSeguroAutoService } from './services/detalle-seguro-auto.service';
import { DetalleSeguroSaludService } from './services/detalle-seguro-salud.service';
import { DetalleSeguroSctrService } from './services/detalle-seguro-sctr.service';
import { CotizacionesService } from './services/cotizaciones.service';

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
        entities: [
          Lead,
          EstadoLead,
          FuenteLead,
          DetalleSeguroAuto,
          DetalleSeguroSalud,
          DetalleSeguroSctr,
        ],
        synchronize: false, // Cambiado a false para evitar problemas con índices duplicados
        logging: ['error', 'warn'], // Solo mostrar errores y warnings
      }),
    }),
    TypeOrmModule.forFeature([
      Lead,
      EstadoLead,
      FuenteLead,
      DetalleSeguroAuto,
      DetalleSeguroSalud,
      DetalleSeguroSctr,
    ]),
  ],
  controllers: [
    LeadsServiceController,
    LeadsController,
    EstadosLeadController,
    FuentesLeadController,
    DetalleSeguroAutoController,
    DetalleSeguroSaludController,
    DetalleSeguroSctrController,
    CotizacionesController,
  ],
  providers: [
    LeadsServiceService,
    LeadsService,
    EstadosLeadService,
    FuentesLeadService,
    DetalleSeguroAutoService,
    DetalleSeguroSaludService,
    DetalleSeguroSctrService,
    CotizacionesService,
  ],
  exports: [
    LeadsServiceService,
    LeadsService,
    EstadosLeadService,
    FuentesLeadService,
    DetalleSeguroAutoService,
    DetalleSeguroSaludService,
    DetalleSeguroSctrService,
    CotizacionesService,
  ],
})
export class LeadsServiceModule {}
