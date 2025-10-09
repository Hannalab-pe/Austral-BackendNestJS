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
import { ProductosService } from '../services/productos.service';
import { CreateProductoDto, UpdateProductoDto } from '../dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.productosService.findAll(page, limit);
  }

  @Get('activos')
  async findActiveProducts() {
    return await this.productosService.findActiveProducts();
  }

  @Get('categoria/:categoriaId')
  async findByCategoria(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ) {
    return await this.productosService.findByCategoria(categoriaId);
  }

  @Get('compania/:companiaId')
  async findByCompania(@Param('companiaId', ParseIntPipe) companiaId: number) {
    return await this.productosService.findByCompania(companiaId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.findOne(id);
  }

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto) {
    return await this.productosService.create(createProductoDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return await this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productosService.remove(id);
  }
}
