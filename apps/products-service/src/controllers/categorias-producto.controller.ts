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
import { CategoriasProductoService } from '../services/categorias-producto.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto';

@Controller('categorias-producto')
export class CategoriasProductoController {
  constructor(private readonly categoriasService: CategoriasProductoService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.categoriasService.findAll(page, limit);
  }

  @Get('activas')
  async findActiveCategories() {
    return await this.categoriasService.findActiveCategories();
  }

  @Get('buscar/:nombre')
  async findByName(@Param('nombre') nombre: string) {
    return await this.categoriasService.findByName(nombre);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriasService.findOne(id);
  }

  @Post()
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return await this.categoriasService.create(createCategoriaDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return await this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriasService.remove(id);
  }
}
