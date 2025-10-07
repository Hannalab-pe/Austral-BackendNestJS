import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FuentesLeadService } from '../services/fuentes-lead.service';
import { CreateFuenteLeadDto } from '../dto';

@Controller('leads/fuentes')
export class FuentesLeadController {
  constructor(private readonly fuentesLeadService: FuentesLeadService) {}

  @Post()
  async create(@Body() createFuenteDto: CreateFuenteLeadDto) {
    return this.fuentesLeadService.create(createFuenteDto);
  }

  @Get()
  async findAll() {
    return this.fuentesLeadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fuentesLeadService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateFuenteLeadDto>,
  ) {
    return this.fuentesLeadService.update(id, updateData);
  }
}
