import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { DetalleSeguroAutoService } from '../services/detalle-seguro-auto.service';
import { CreateDetalleSeguroAutoDto, UpdateDetalleSeguroAutoDto, DetalleSeguroAutoResponseDto } from '../dto/detalle-seguro-auto.dto';

@ApiTags('Detalle Seguro Auto')
@Controller('detalle-seguro-auto')
export class DetalleSeguroAutoController {
  constructor(private readonly detalleService: DetalleSeguroAutoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear detalle de seguro auto para un lead' })
  @ApiBody({
    type: CreateDetalleSeguroAutoDto,
    description: 'Datos del detalle de seguro auto a crear',
    examples: {
      'ejemplo-basico': {
        summary: 'Ejemplo de creación básica',
        value: {
          id_lead: '123e4567-e89b-12d3-a456-426614174000',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          placa: 'ABC-123',
          uso_vehiculo: 'Particular'
        }
      },
      'ejemplo-completo': {
        summary: 'Ejemplo con todos los campos',
        value: {
          id_lead: '456e7890-e89b-12d3-a456-426614174001',
          marca: 'Mercedes-Benz',
          modelo: 'Sprinter',
          anio: 2019,
          placa: 'XYZ-789',
          valor_vehiculo: 45000,
          tipo_cobertura: 'Todo riesgo',
          zona_riesgo: 'Media',
          antiguedad_licencia: 5,
          tiene_gps: true,
          tiene_alarma: true,
          numero_siniestros_previos: 0,
          esta_financiado: false,
          uso_vehiculo: 'Comercial'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle creado exitosamente',
    schema: {
      example: {
        id_detalle_auto: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        id_lead: '123e4567-e89b-12d3-a456-426614174000',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2020,
        placa: 'ABC-123',
        valor_vehiculo: 25000,
        tipo_cobertura: 'Todo riesgo',
        zona_riesgo: 'Media',
        antiguedad_licencia: null,
        tiene_gps: true,
        tiene_alarma: true,
        numero_siniestros_previos: 0,
        esta_financiado: false,
        uso_vehiculo: 'Particular',
        esta_activo: true,
        fecha_creacion: '2025-10-15T10:00:00.000Z',
        lead: {
          id_lead: '123e4567-e89b-12d3-a456-426614174000',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '+54 11 1234-5678'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Lead no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Lead con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un detalle para este lead',
    schema: {
      example: {
        statusCode: 409,
        message: 'Ya existe un detalle de seguro auto para este lead',
        error: 'Conflict'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'ano_auto must not be greater than 2026'
        ],
        error: 'Bad Request'
      }
    }
  })
  async create(@Body() createDto: CreateDetalleSeguroAutoDto): Promise<DetalleSeguroAutoResponseDto> {
    try {
      return await this.detalleService.create(createDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al crear el detalle de seguro auto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de seguro auto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de detalles obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/DetalleSeguroAutoResponseDto'
      },
      example: [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          lead_id: '123e4567-e89b-12d3-a456-426614174000',
          marca_auto: 'Toyota',
          ano_auto: 2020,
          modelo_auto: 'Corolla',
          placa_auto: 'ABC-123',
          tipo_uso: 'particular',
          fecha_creacion: '2025-10-15T10:00:00.000Z',
          fecha_actualizacion: '2025-10-15T10:00:00.000Z',
          lead: {
            id_lead: '123e4567-e89b-12d3-a456-426614174000',
            nombre: 'Juan',
            apellido: 'Pérez',
            telefono: '+54 11 1234-5678'
          }
        },
        {
          id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
          lead_id: '456e7890-e89b-12d3-a456-426614174001',
          marca_auto: 'Honda',
          ano_auto: 2019,
          modelo_auto: 'Civic',
          placa_auto: 'XYZ-789',
          tipo_uso: 'Delivery de comida',
          fecha_creacion: '2025-10-14T15:30:00.000Z',
          fecha_actualizacion: '2025-10-14T15:30:00.000Z',
          lead: {
            id_lead: '456e7890-e89b-12d3-a456-426614174001',
            nombre: 'María',
            apellido: 'González',
            telefono: '+54 11 9876-5432'
          }
        }
      ]
    }
  })
  async findAll(): Promise<DetalleSeguroAutoResponseDto[]> {
    try {
      return await this.detalleService.findAll();
    } catch (error) {
      throw new HttpException(
        'Error al obtener los detalles de seguro auto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de seguro auto por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del detalle (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Detalle encontrado',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        lead_id: '123e4567-e89b-12d3-a456-426614174000',
        marca_auto: 'Toyota',
        ano_auto: 2020,
        modelo_auto: 'Corolla',
        placa_auto: 'ABC-123',
        tipo_uso: 'particular',
        fecha_creacion: '2025-10-15T10:00:00.000Z',
        fecha_actualizacion: '2025-10-15T10:00:00.000Z',
        lead: {
          id_lead: '123e4567-e89b-12d3-a456-426614174000',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '+54 11 1234-5678'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Detalle de seguro auto con ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 no encontrado',
        error: 'Not Found'
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<DetalleSeguroAutoResponseDto> {
    try {
      return await this.detalleService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el detalle de seguro auto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Obtener detalle de seguro auto por ID de lead' })
  @ApiParam({ name: 'leadId', type: 'string', description: 'ID del lead (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Detalle encontrado',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        lead_id: '123e4567-e89b-12d3-a456-426614174000',
        marca_auto: 'Toyota',
        ano_auto: 2020,
        modelo_auto: 'Corolla',
        placa_auto: 'ABC-123',
        tipo_uso: 'particular',
        fecha_creacion: '2025-10-15T10:00:00.000Z',
        fecha_actualizacion: '2025-10-15T10:00:00.000Z',
        lead: {
          id_lead: '123e4567-e89b-12d3-a456-426614174000',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '+54 11 1234-5678'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle no encontrado para este lead',
    schema: {
      example: {
        statusCode: 404,
        message: 'Detalle no encontrado para este lead',
        error: 'Not Found'
      }
    }
  })
  async findByLeadId(@Param('leadId') leadId: string): Promise<DetalleSeguroAutoResponseDto> {
    try {
      const detalle = await this.detalleService.findByLeadId(leadId);
      if (!detalle) {
        throw new HttpException('Detalle no encontrado para este lead', HttpStatus.NOT_FOUND);
      }
      return detalle;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el detalle de seguro auto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar detalle de seguro auto' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del detalle (UUID)' })
  @ApiBody({
    type: UpdateDetalleSeguroAutoDto,
    description: 'Datos a actualizar del detalle de seguro auto',
    examples: {
      'actualizar-parcial': {
        summary: 'Actualización parcial de datos',
        value: {
          marca: 'Honda',
          modelo: 'Civic'
        }
      },
      'actualizar-completo': {
        summary: 'Actualización completa',
        value: {
          marca: 'Ford',
          modelo: 'Focus',
          anio: 2021,
          valor_vehiculo: 30000,
          tipo_cobertura: 'Terceros completo',
          uso_vehiculo: 'Comercial'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle actualizado exitosamente',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        lead_id: '123e4567-e89b-12d3-a456-426614174000',
        marca_auto: 'Honda',
        ano_auto: 2020,
        modelo_auto: 'Civic',
        placa_auto: 'ABC-123',
        tipo_uso: 'Transporte de pasajeros',
        fecha_creacion: '2025-10-15T10:00:00.000Z',
        fecha_actualizacion: '2025-10-15T11:30:00.000Z',
        lead: {
          id_lead: '123e4567-e89b-12d3-a456-426614174000',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '+54 11 1234-5678'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Detalle de seguro auto con ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'ano_auto must not be greater than 2026'
        ],
        error: 'Bad Request'
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDetalleSeguroAutoDto,
  ): Promise<DetalleSeguroAutoResponseDto> {
    try {
      return await this.detalleService.update(id, updateDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar el detalle de seguro auto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar detalle de seguro auto' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID del detalle (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Detalle eliminado exitosamente',
    schema: {
      example: {
        message: 'Detalle de seguro auto eliminado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Detalle no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Detalle de seguro auto con ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 no encontrado',
        error: 'Not Found'
      }
    }
  })
  async remove(@Param('id') id: string) {
    try {
      await this.detalleService.remove(id);
      return { message: 'Detalle de seguro auto eliminado exitosamente' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al eliminar el detalle de seguro auto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}