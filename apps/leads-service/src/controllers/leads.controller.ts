import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from '../services/leads.service';
import { CreateLeadDto } from '../dto/leads.dto';

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
}
