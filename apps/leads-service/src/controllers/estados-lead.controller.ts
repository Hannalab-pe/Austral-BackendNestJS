import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EstadosLeadService } from '../services/estados-lead.service';
import { CreateEstadoLeadDto } from '../dto';

@Controller('leads/estados')
export class EstadosLeadController {
  constructor(private readonly estadosLeadService: EstadosLeadService) {}

  @Post()
  async create(@Body() createEstadoDto: CreateEstadoLeadDto) {
    return this.estadosLeadService.create(createEstadoDto);
  }

  @Get()
  async findAll() {
    return this.estadosLeadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosLeadService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateEstadoLeadDto>,
  ) {
    return this.estadosLeadService.update(id, updateData);
  }
}
