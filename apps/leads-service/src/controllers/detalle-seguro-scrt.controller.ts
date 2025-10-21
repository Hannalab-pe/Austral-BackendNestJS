import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DetalleSeguroScrtService } from '../services/detalle-seguro-scrt.service';
import { CreateDetalleSeguroScrtDto } from '../dto/detalle-seguro-scrt.dto';

@ApiTags('Detalle Seguro SCTR')
@Controller('detalle-seguro-scrt')
export class DetalleSeguroScrtController {
  constructor(private readonly detalleSeguroScrtService: DetalleSeguroScrtService) {}

  @Post()
  @ApiOperation({ summary: 'Crear detalle de seguro SCTR para un lead' })
  @ApiResponse({
    status: 201,
    description: 'Detalle creado exitosamente',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        lead_id: '123e4567-e89b-12d3-a456-426614174001',
        razon_social: 'Empresa XYZ S.A.',
        ruc: '20123456789',
        numero_trabajadores: 50,
        monto_planilla: 50000.0,
        actividad_negocio: 'Comercio al por mayor',
        tipo_seguro: 'SCTR',
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
  async create(@Body() createDto: CreateDetalleSeguroScrtDto) {
    return this.detalleSeguroScrtService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de seguro SCTR' })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles obtenida exitosamente',
  })
  async findAll() {
    return this.detalleSeguroScrtService.findAll();
  }

  @Get(':leadId')
  @ApiOperation({ summary: 'Obtener detalle de seguro SCTR por ID de lead' })
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
    return this.detalleSeguroScrtService.findByLeadId(leadId);
  }
}