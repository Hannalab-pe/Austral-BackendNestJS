import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ActividadesService } from '../services/actividades.service';
import { CreateActividadDto, UpdateActividadDto } from '../dto';
import { Actividad } from '../entities/actividad.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('actividades')
@Controller('actividades')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las actividades' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página' })
  @ApiResponse({ status: 200, description: 'Lista paginada de actividades' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.actividadesService.findAll(parseInt(page), parseInt(limit));
  }

  @Get('proximas')
  @ApiOperation({ summary: 'Obtener actividades próximas' })
  @ApiResponse({ status: 200, description: 'Lista de actividades próximas', type: [Actividad] })
  async findUpcomingActivities() {
    return await this.actividadesService.findUpcomingActivities();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener actividades por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del usuario', type: [Actividad] })
  async findByUsuario(@Param('usuarioId', ParseUUIDPipe) usuarioId: string) {
    return await this.actividadesService.findByUsuario(usuarioId);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Obtener actividades por cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del cliente', type: [Actividad] })
  async findByCliente(@Param('clienteId', ParseUUIDPipe) clienteId: string) {
    return await this.actividadesService.findByCliente(clienteId);
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Obtener actividades por lead' })
  @ApiParam({ name: 'leadId', description: 'ID del lead' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del lead', type: [Actividad] })
  async findByLead(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return await this.actividadesService.findByLead(leadId);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener actividades por tipo' })
  @ApiParam({ name: 'tipo', description: 'Tipo de actividad' })
  @ApiResponse({ status: 200, description: 'Lista de actividades por tipo', type: [Actividad] })
  async findByTipo(@Param('tipo') tipo: string) {
    return await this.actividadesService.findByTipo(tipo);
  }

  @Get('fecha-rango')
  @ApiOperation({ summary: 'Obtener actividades por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (ISO string)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (ISO string)' })
  @ApiResponse({ status: 200, description: 'Lista de actividades en el rango de fechas', type: [Actividad] })
  async findByFechaRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return await this.actividadesService.findByFechaRange(inicio, fin);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada', type: Actividad })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.actividadesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({ status: 201, description: 'Actividad creada exitosamente', type: Actividad })
  async create(@Body() createActividadDto: CreateActividadDto, @Request() req) {
    return await this.actividadesService.create(createActividadDto, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una actividad' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada', type: Actividad })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActividadDto: UpdateActividadDto,
    @Request() req,
  ) {
    return await this.actividadesService.update(id, updateActividadDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una actividad' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad eliminada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.actividadesService.remove(id);
  }
}
