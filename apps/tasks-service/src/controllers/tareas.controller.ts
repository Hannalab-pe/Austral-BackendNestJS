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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TareasService } from '../services/tareas.service';
import { CreateTareaDto, UpdateTareaDto } from '../dto';

@ApiTags('tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las tareas',
    description: 'Obtiene una lista paginada de todas las tareas',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.tareasService.findAll(page, limit);
  }

  @Get('vencidas')
  @ApiOperation({
    summary: 'Obtener tareas vencidas',
    description:
      'Obtiene todas las tareas que han pasado su fecha de vencimiento',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas vencidas obtenida exitosamente',
  })
  async findOverdueTasks() {
    return await this.tareasService.findOverdueTasks();
  }

  @Get('hoy')
  @ApiOperation({
    summary: 'Obtener tareas de hoy',
    description: 'Obtiene todas las tareas que vencen hoy',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas de hoy obtenida exitosamente',
  })
  async findTasksDueToday() {
    return await this.tareasService.findTasksDueToday();
  }

  @Get('usuario/:usuarioId/asignadas')
  @ApiOperation({
    summary: 'Obtener tareas asignadas a un usuario',
    description: 'Obtiene todas las tareas asignadas a un usuario específico',
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID del usuario (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas asignadas obtenida exitosamente',
  })
  async findByUsuarioAsignado(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ) {
    return await this.tareasService.findByUsuarioAsignado(usuarioId);
  }

  @Get('usuario/:usuarioId/creadas')
  @ApiOperation({
    summary: 'Obtener tareas creadas por un usuario',
    description: 'Obtiene todas las tareas creadas por un usuario específico',
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID del usuario (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas creadas obtenida exitosamente',
  })
  async findByUsuarioCreador(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ) {
    return await this.tareasService.findByUsuarioCreador(usuarioId);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({
    summary: 'Obtener tareas de un cliente',
    description:
      'Obtiene todas las tareas relacionadas con un cliente específico',
  })
  @ApiParam({
    name: 'clienteId',
    description: 'ID del cliente (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas del cliente obtenida exitosamente',
  })
  async findByCliente(@Param('clienteId', ParseUUIDPipe) clienteId: string) {
    return await this.tareasService.findByCliente(clienteId);
  }

  @Get('estado/:estado')
  @ApiOperation({
    summary: 'Obtener tareas por estado',
    description: 'Obtiene todas las tareas filtradas por estado',
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado de la tarea',
    example: 'pendiente',
    enum: ['pendiente', 'en_progreso', 'completada', 'cancelada'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas por estado obtenida exitosamente',
  })
  async findByEstado(@Param('estado') estado: string) {
    return await this.tareasService.findByEstado(estado);
  }

  @Get('prioridad/:prioridad')
  @ApiOperation({
    summary: 'Obtener tareas por prioridad',
    description: 'Obtiene todas las tareas filtradas por prioridad',
  })
  @ApiParam({
    name: 'prioridad',
    description: 'Prioridad de la tarea',
    example: 'alta',
    enum: ['baja', 'media', 'alta', 'urgente'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas por prioridad obtenida exitosamente',
  })
  async findByPrioridad(@Param('prioridad') prioridad: string) {
    return await this.tareasService.findByPrioridad(prioridad);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una tarea específica',
    description: 'Obtiene los detalles de una tarea por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Tarea obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tareasService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva tarea',
    description: 'Crea una nueva tarea en el sistema',
  })
  @ApiBody({ type: CreateTareaDto })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createTareaDto: CreateTareaDto) {
    return await this.tareasService.create(createTareaDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea',
    description: 'Actualiza los datos de una tarea existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateTareaDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTareaDto: UpdateTareaDto,
  ) {
    return await this.tareasService.update(id, updateTareaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tarea',
    description: 'Elimina permanentemente una tarea del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Tarea eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tareasService.remove(id);
  }
}
