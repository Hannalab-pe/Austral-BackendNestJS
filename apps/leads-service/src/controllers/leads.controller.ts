import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { LeadsService } from '../services/leads.service';
import { CreateLeadDto, UpdateLeadDto } from '../dto/leads.dto';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lead' })
  @ApiResponse({
    status: 201,
    description: 'Lead creado exitosamente',
    schema: {
      example: {
        id_lead: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+54 11 1234-5678',
        fecha_nacimiento: '1990-01-15',
        tipo_seguro_interes: 'Vida',
        presupuesto_aproximado: 5000,
        notas: 'Interesado en seguro de vida',
        puntaje_calificacion: 75,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-10-13T10:00:00.000Z',
        fecha_ultimo_contacto: null,
        proxima_fecha_seguimiento: '2025-10-20T10:00:00.000Z',
        id_estado: '123e4567-e89b-12d3-a456-426614174001',
        id_fuente: '123e4567-e89b-12d3-a456-426614174002',
        asignado_a_usuario: null,
        esta_activo: true,
        fecha_creacion: '2025-10-13T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o estado/fuente no válidos',
  })
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los leads' })
  @ApiResponse({
    status: 200,
    description: 'Lista de leads obtenida exitosamente',
    schema: {
      example: [
        {
          id_lead: '123e4567-e89b-12d3-a456-426614174000',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          telefono: '+54 11 1234-5678',
          fecha_nacimiento: '1990-01-15',
          tipo_seguro_interes: 'Vida',
          presupuesto_aproximado: 5000,
          notas: 'Interesado en seguro de vida',
          puntaje_calificacion: 75,
          prioridad: 'ALTA',
          fecha_primer_contacto: '2025-10-13T10:00:00.000Z',
          fecha_ultimo_contacto: null,
          proxima_fecha_seguimiento: '2025-10-20T10:00:00.000Z',
          id_estado: '123e4567-e89b-12d3-a456-426614174001',
          id_fuente: '123e4567-e89b-12d3-a456-426614174002',
          asignado_a_usuario: null,
          esta_activo: true,
          fecha_creacion: '2025-10-13T10:00:00.000Z',
          estado: {
            id_estado: '123e4567-e89b-12d3-a456-426614174001',
            nombre: 'Nuevo',
            descripcion: 'Lead recién ingresado',
            color_hex: '#3B82F6',
            orden_proceso: 1,
            es_estado_final: false,
            esta_activo: true,
          },
          fuente: {
            id_fuente: '123e4567-e89b-12d3-a456-426614174002',
            nombre: 'Sitio Web',
            descripcion: 'Formulario de contacto del sitio web',
            tipo: 'Digital',
            esta_activo: true,
          },
        },
      ],
    },
  })
  async findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lead por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del lead',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Lead encontrado exitosamente',
    schema: {
      example: {
        id_lead: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+54 11 1234-5678',
        fecha_nacimiento: '1990-01-15',
        tipo_seguro_interes: 'Vida',
        presupuesto_aproximado: 5000,
        notas: 'Interesado en seguro de vida',
        puntaje_calificacion: 75,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-10-13T10:00:00.000Z',
        fecha_ultimo_contacto: null,
        proxima_fecha_seguimiento: '2025-10-20T10:00:00.000Z',
        id_estado: '123e4567-e89b-12d3-a456-426614174001',
        id_fuente: '123e4567-e89b-12d3-a456-426614174002',
        asignado_a_usuario: null,
        esta_activo: true,
        fecha_creacion: '2025-10-13T10:00:00.000Z',
        estado: {
          id_estado: '123e4567-e89b-12d3-a456-426614174001',
          nombre: 'Nuevo',
          descripcion: 'Lead recién ingresado',
          color_hex: '#3B82F6',
          orden_proceso: 1,
          es_estado_final: false,
          esta_activo: true,
        },
        fuente: {
          id_fuente: '123e4567-e89b-12d3-a456-426614174002',
          nombre: 'Sitio Web',
          descripcion: 'Formulario de contacto del sitio web',
          tipo: 'Digital',
          esta_activo: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lead no encontrado',
  })
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un lead existente',
    description: 'Permite actualizar parcialmente la información de un lead. Solo se actualizarán los campos proporcionados.'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del lead a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateLeadDto })
  @ApiResponse({
    status: 200,
    description: 'Lead actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async update(@Param('id') id: string, @Body() updateData: UpdateLeadDto) {
    // Convertir las fechas del DTO a objetos Date si es necesario
    const updatePayload: any = { ...updateData };

    if (updateData.fecha_nacimiento) {
      updatePayload.fecha_nacimiento = new Date(updateData.fecha_nacimiento);
    }

    if (updateData.proxima_fecha_seguimiento) {
      updatePayload.proxima_fecha_seguimiento = new Date(updateData.proxima_fecha_seguimiento);
    }

    if (updateData.fecha_ultimo_contacto) {
      updatePayload.fecha_ultimo_contacto = new Date(updateData.fecha_ultimo_contacto);
    }

    return this.leadsService.update(id, updatePayload);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Actualizar el estado de un lead',
    description: 'Cambia el estado del lead en el proceso de ventas (ej: Nuevo → Contactado → Calificado → Convertido)'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del lead',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_estado: {
          type: 'string',
          format: 'uuid',
          description: 'UUID del nuevo estado',
          example: '123e4567-e89b-12d3-a456-426614174001'
        }
      },
      required: ['id_estado']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del lead actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Estado inválido',
  })
  async updateStatus(@Param('id') id: string, @Body() body: { id_estado: string }) {
    return this.leadsService.updateStatus(id, body.id_estado);
  }
}
