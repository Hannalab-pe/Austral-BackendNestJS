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
import { ActividadesService } from '../services/actividades.service';
import { CreateActividadDto, UpdateActividadDto } from '../dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.actividadesService.findAll(page, limit);
  }

  @Get('pendientes')
  async findPendingActivities() {
    return await this.actividadesService.findPendingActivities();
  }

  @Get('vencidas')
  async findOverdueActivities() {
    return await this.actividadesService.findOverdueActivities();
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return await this.actividadesService.findByUsuario(usuarioId);
  }

  @Get('cliente/:clienteId')
  async findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return await this.actividadesService.findByCliente(clienteId);
  }

  @Get('lead/:leadId')
  async findByLead(@Param('leadId', ParseIntPipe) leadId: number) {
    return await this.actividadesService.findByLead(leadId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.actividadesService.findOne(id);
  }

  @Post()
  async create(@Body() createActividadDto: CreateActividadDto) {
    return await this.actividadesService.create(createActividadDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActividadDto: UpdateActividadDto,
  ) {
    return await this.actividadesService.update(id, updateActividadDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.actividadesService.remove(id);
  }
}
