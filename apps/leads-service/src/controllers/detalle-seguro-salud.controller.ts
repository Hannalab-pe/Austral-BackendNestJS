import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DetalleSeguroSaludService } from '../services/detalle-seguro-salud.service';
import { CreateDetalleSeguroSaludDto } from '../dto/detalle-seguro-salud.dto';

@ApiTags('Detalle Seguro Salud')
@Controller('detalle-seguro-salud')
export class DetalleSeguroSaludController {
  constructor(
    private readonly detalleSeguroSaludService: DetalleSeguroSaludService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear detalle de seguro salud para un lead' })
  @ApiResponse({
    status: 201,
    description: 'Detalle creado exitosamente',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        lead_id: '123e4567-e89b-12d3-a456-426614174001',
        edad: 35,
        sexo: 'Masculino',
        grupo_familiar: 'Pareja e hijos (2)',
        estado_clinico: 'Buen estado general',
        zona_trabajo_vivienda: 'Buenos Aires, Argentina',
        preferencia_plan: 'Plan Premium',
        reembolso: 1500.5,
        coberturas: 'Consultas médicas, hospitalización',
        fecha_creacion: '2025-10-21T10:00:00.000Z',
        fecha_actualizacion: '2025-10-21T10:00:00.000Z',
        lead: {
          id_lead: '123e4567-e89b-12d3-a456-426614174001',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '+54 11 1234-5678',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos, lead no válido o ya existe detalle',
  })
  async create(@Body() createDto: CreateDetalleSeguroSaludDto) {
    return this.detalleSeguroSaludService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de seguro salud' })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles obtenida exitosamente',
  })
  async findAll() {
    return this.detalleSeguroSaludService.findAll();
  }

  @Get(':leadId')
  @ApiOperation({ summary: 'Obtener detalle de seguro salud por ID de lead' })
  @ApiParam({ name: 'leadId', description: 'ID del lead' })
  @ApiResponse({
    status: 200,
    description: 'Detalle encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle no encontrado',
  })
  async findByLeadId(@Param('leadId') leadId: string) {
    const detalle = await this.detalleSeguroSaludService.findByLeadId(leadId);
    if (!detalle) {
      throw new NotFoundException(
        'Detalle de seguro salud no encontrado para este lead',
      );
    }
    return detalle;
  }
}
