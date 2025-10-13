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
import { EstadosLeadService } from '../services/estados-lead.service';
import { CreateEstadoLeadDto, UpdateEstadoLeadDto } from '../dto/leads.dto';

@ApiTags('Estados de Lead')
@Controller('estados-lead')
export class EstadosLeadController {
  constructor(private readonly estadosLeadService: EstadosLeadService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado de lead' })
  @ApiResponse({ status: 201, description: 'Estado creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createEstadoDto: CreateEstadoLeadDto) {
    return this.estadosLeadService.create(createEstadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados de lead' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados obtenida exitosamente',
  })
  async findAll() {
    return this.estadosLeadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado de lead por ID' })
  @ApiParam({ name: 'id', description: 'ID del estado (UUID)' })
  @ApiResponse({ status: 200, description: 'Estado obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosLeadService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un estado de lead' })
  @ApiParam({ name: 'id', description: 'ID del estado (UUID)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateEstadoLeadDto,
  ) {
    return this.estadosLeadService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado de lead (desactivar)' })
  @ApiParam({ name: 'id', description: 'ID del estado (UUID)' })
  @ApiResponse({ status: 200, description: 'Estado eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosLeadService.remove(id);
  }
}
