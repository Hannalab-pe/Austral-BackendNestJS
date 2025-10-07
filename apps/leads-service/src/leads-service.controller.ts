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
import { LeadsServiceService } from './leads-service.service';
import {
  CreateLeadDto,
  UpdateLeadDto,
  CreateEstadoLeadDto,
  CreateFuenteLeadDto,
} from './dto';

@Controller('leads')
export class LeadsServiceController {
  constructor(private readonly leadsService: LeadsServiceService) {}

  // Endpoints de Leads
  @Post()
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(createLeadDto);
  }

  @Get()
  async getAllLeads(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('estado') estado?: string,
    @Query('asignado') asignado?: string,
    @Query('prioridad') prioridad?: string,
    @Query('fuente') fuente?: string,
  ) {
    const filters = { estado, asignado, prioridad, fuente };
    return this.leadsService.getAllLeads(
      parseInt(page),
      parseInt(limit),
      filters,
    );
  }

  @Get('stats')
  async getLeadStats() {
    return this.leadsService.getLeadStats();
  }

  @Get('followup-today')
  async getLeadsWithFollowupToday() {
    return this.leadsService.getLeadsWithFollowupToday();
  }

  @Get('user/:userId')
  async getLeadsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.leadsService.getLeadsByUser(userId);
  }

  @Get(':id')
  async getLeadById(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Patch(':id')
  async updateLead(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.updateLead(id, updateLeadDto);
  }

  @Patch(':id/assign/:userId')
  async assignLead(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.leadsService.assignLead(id, userId);
  }

  @Patch(':id/status/:estadoId')
  async updateLeadStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estadoId', ParseUUIDPipe) estadoId: string,
  ) {
    return this.leadsService.updateLeadStatus(id, estadoId);
  }

  @Delete(':id')
  async deleteLead(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.deleteLead(id);
  }

  // Endpoints de Estados de Lead
  @Post('estados')
  async createEstadoLead(@Body() createEstadoDto: CreateEstadoLeadDto) {
    return this.leadsService.createEstadoLead(createEstadoDto);
  }

  @Get('estados/all')
  async getAllEstadosLead() {
    return this.leadsService.getAllEstadosLead();
  }

  @Patch('estados/:id')
  async updateEstadoLead(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateEstadoLeadDto>,
  ) {
    return this.leadsService.updateEstadoLead(id, updateData);
  }

  // Endpoints de Fuentes de Lead
  @Post('fuentes')
  async createFuenteLead(@Body() createFuenteDto: CreateFuenteLeadDto) {
    return this.leadsService.createFuenteLead(createFuenteDto);
  }

  @Get('fuentes/all')
  async getAllFuentesLead() {
    return this.leadsService.getAllFuentesLead();
  }

  @Patch('fuentes/:id')
  async updateFuenteLead(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateFuenteLeadDto>,
  ) {
    return this.leadsService.updateFuenteLead(id, updateData);
  }
}
