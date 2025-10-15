import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FuentesLeadService } from '../services/fuentes-lead.service';
import { CreateFuenteLeadDto, UpdateFuenteLeadDto } from '../dto/leads.dto';

@ApiTags('Fuentes de Lead')
@Controller('fuentes-lead')
export class FuentesLeadController {
  constructor(private readonly fuentesLeadService: FuentesLeadService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva fuente de lead' })
  @ApiResponse({ status: 201, description: 'Fuente creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createFuenteDto: CreateFuenteLeadDto) {
    return this.fuentesLeadService.create(createFuenteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las fuentes de lead' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fuentes obtenida exitosamente',
  })
  async findAll() {
    return this.fuentesLeadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una fuente de lead por ID' })
  @ApiParam({ name: 'id', description: 'ID de la fuente (UUID)' })
  @ApiResponse({ status: 200, description: 'Fuente obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Fuente no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fuentesLeadService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una fuente de lead' })
  @ApiParam({ name: 'id', description: 'ID de la fuente (UUID)' })
  @ApiResponse({ status: 200, description: 'Fuente actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Fuente no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateFuenteLeadDto,
  ) {
    return this.fuentesLeadService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una fuente de lead (desactivar)' })
  @ApiParam({ name: 'id', description: 'ID de la fuente (UUID)' })
  @ApiResponse({ status: 200, description: 'Fuente eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Fuente no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fuentesLeadService.remove(id);
  }
}
