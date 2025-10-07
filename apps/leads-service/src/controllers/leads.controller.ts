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
import { LeadsService } from '../services/leads.service';
import { CreateLeadDto, UpdateLeadDto } from '../dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('estado') estado?: string,
    @Query('asignado') asignado?: string,
    @Query('prioridad') prioridad?: string,
    @Query('fuente') fuente?: string,
  ) {
    const filters = { estado, asignado, prioridad, fuente };
    return this.leadsService.findAll(parseInt(page), parseInt(limit), filters);
  }

  @Get('stats')
  async getStats() {
    return this.leadsService.getStats();
  }

  @Get('followup-today')
  async getFollowupToday() {
    return this.leadsService.getFollowupToday();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.leadsService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Patch(':id/assign/:userId')
  async assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.leadsService.assign(id, userId);
  }

  @Patch(':id/status/:estadoId')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estadoId', ParseUUIDPipe) estadoId: string,
  ) {
    return this.leadsService.updateStatus(id, estadoId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.remove(id);
  }
}
