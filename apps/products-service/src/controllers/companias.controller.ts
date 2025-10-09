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
import { CompaniasService } from '../services/companias.service';
import { CreateCompaniaDto, UpdateCompaniaDto } from '../dto';

@Controller('companias')
export class CompaniasController {
  constructor(private readonly companiasService: CompaniasService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.companiasService.findAll(page, limit);
  }

  @Get('activas')
  async findActiveCompanies() {
    return await this.companiasService.findActiveCompanies();
  }

  @Get('buscar/:nombre')
  async findByName(@Param('nombre') nombre: string) {
    return await this.companiasService.findByName(nombre);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.companiasService.findOne(id);
  }

  @Post()
  async create(@Body() createCompaniaDto: CreateCompaniaDto) {
    return await this.companiasService.create(createCompaniaDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompaniaDto: UpdateCompaniaDto,
  ) {
    return await this.companiasService.update(id, updateCompaniaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.companiasService.remove(id);
  }
}
