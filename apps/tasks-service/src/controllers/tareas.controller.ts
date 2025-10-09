import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TareasService } from '../services/tareas.service';
import { CreateTareaDto, UpdateTareaDto } from '../dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.tareasService.findAll(page, limit);
  }

  @Get('vencidas')
  async findOverdueTasks() {
    return await this.tareasService.findOverdueTasks();
  }

  @Get('hoy')
  async findTasksDueToday() {
    return await this.tareasService.findTasksDueToday();
  }

  @Get('usuario/:usuarioId/asignadas')
  async findByUsuarioAsignado(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return await this.tareasService.findByUsuarioAsignado(usuarioId);
  }

  @Get('usuario/:usuarioId/creadas')
  async findByUsuarioCreador(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return await this.tareasService.findByUsuarioCreador(usuarioId);
  }

  @Get('cliente/:clienteId')
  async findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return await this.tareasService.findByCliente(clienteId);
  }

  @Get('estado/:estado')
  async findByEstado(@Param('estado') estado: string) {
    return await this.tareasService.findByEstado(estado);
  }

  @Get('prioridad/:prioridad')
  async findByPrioridad(@Param('prioridad') prioridad: string) {
    return await this.tareasService.findByPrioridad(prioridad);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tareasService.findOne(id);
  }

  @Post()
  async create(@Body() createTareaDto: CreateTareaDto) {
    return await this.tareasService.create(createTareaDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTareaDto: UpdateTareaDto,
  ) {
    return await this.tareasService.update(id, updateTareaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.tareasService.remove(id);
  }
}
