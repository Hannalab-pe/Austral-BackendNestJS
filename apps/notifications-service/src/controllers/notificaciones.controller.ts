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
import { NotificacionesService } from '../services/notificaciones.service';
import { CreateNotificacionDto, UpdateNotificacionDto } from '../dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.notificacionesService.findAll(page, limit);
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return await this.notificacionesService.findByUsuario(usuarioId);
  }

  @Get('usuario/:usuarioId/no-leidas')
  async findUnreadByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return await this.notificacionesService.findUnreadByUsuario(usuarioId);
  }

  @Get('usuario/:usuarioId/contador-no-leidas')
  async getUnreadCountByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    const count =
      await this.notificacionesService.getUnreadCountByUsuario(usuarioId);
    return { count };
  }

  @Get('tipo/:tipo')
  async findByTipo(@Param('tipo') tipo: string) {
    return await this.notificacionesService.findByTipo(tipo);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.notificacionesService.findOne(id);
  }

  @Post()
  async create(@Body() createNotificacionDto: CreateNotificacionDto) {
    return await this.notificacionesService.create(createNotificacionDto);
  }

  @Post('masiva')
  async createBulkNotifications(
    @Body() body: { usuarioIds: number[]; data: CreateNotificacionDto },
  ) {
    return await this.notificacionesService.createBulkNotifications(
      body.usuarioIds,
      body.data,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificacionDto: UpdateNotificacionDto,
  ) {
    return await this.notificacionesService.update(id, updateNotificacionDto);
  }

  @Patch(':id/marcar-leida')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return await this.notificacionesService.markAsRead(id);
  }

  @Patch('usuario/:usuarioId/marcar-todas-leidas')
  async markAllAsReadByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    await this.notificacionesService.markAllAsReadByUsuario(usuarioId);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.notificacionesService.remove(id);
  }

  @Delete('limpiar-antiguas/:dias')
  async deleteOldNotifications(@Param('dias', ParseIntPipe) dias: number = 30) {
    await this.notificacionesService.deleteOldNotifications(dias);
    return {
      message: `Notificaciones antiguas eliminadas (más de ${dias} días)`,
    };
  }
}
