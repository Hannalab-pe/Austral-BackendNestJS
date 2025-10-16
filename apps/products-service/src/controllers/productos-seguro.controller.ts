import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductosSeguroService } from '../services';
import { CreateProductoSeguroDto, UpdateProductoSeguroDto } from '../dto';

@ApiTags('productos-seguro')
@Controller('productos-seguro')
export class ProductosSeguroController {
  constructor(
    private readonly productosSeguroService: ProductosSeguroService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos de seguros',
    description: 'Obtiene una lista de todos los productos de seguros activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos de seguros obtenida exitosamente',
  })
  async findAll() {
    return await this.productosSeguroService.findAll();
  }

  @Get('compania/:idCompania')
  @ApiOperation({
    summary: 'Obtener productos de seguros por compañía',
    description: 'Obtiene todos los productos de seguros de una compañía específica',
  })
  @ApiParam({
    name: 'idCompania',
    description: 'ID de la compañía de seguros (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos de seguros de la compañía obtenida exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía no encontrada',
  })
  async findByCompania(@Param('idCompania', ParseUUIDPipe) idCompania: string) {
    return await this.productosSeguroService.findByCompania(idCompania);
  }

  @Get('tipo/:idTipoSeguro')
  @ApiOperation({
    summary: 'Obtener productos de seguros por tipo',
    description: 'Obtiene todos los productos de seguros de un tipo específico',
  })
  @ApiParam({
    name: 'idTipoSeguro',
    description: 'ID del tipo de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos de seguros del tipo obtenida exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de seguro no encontrado',
  })
  async findByTipo(@Param('idTipoSeguro', ParseUUIDPipe) idTipoSeguro: string) {
    return await this.productosSeguroService.findByTipoSeguro(idTipoSeguro);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto de seguro específico',
    description: 'Obtiene los detalles de un producto de seguro por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto de seguro obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto de seguro no encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productosSeguroService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo producto de seguro',
    description: 'Crea un nuevo producto de seguro en el sistema',
  })
  @ApiBody({ type: CreateProductoSeguroDto })
  @ApiResponse({
    status: 201,
    description: 'Producto de seguro creado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía o tipo de seguro no encontrados',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createProductoSeguroDto: CreateProductoSeguroDto) {
    return await this.productosSeguroService.create(createProductoSeguroDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un producto de seguro',
    description: 'Actualiza los datos de un producto de seguro existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateProductoSeguroDto })
  @ApiResponse({
    status: 200,
    description: 'Producto de seguro actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto, compañía o tipo de seguro no encontrados',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductoSeguroDto: UpdateProductoSeguroDto,
  ) {
    return await this.productosSeguroService.update(
      id,
      updateProductoSeguroDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un producto de seguro',
    description: 'Elimina (desactiva) un producto de seguro del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto de seguro eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto de seguro no encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productosSeguroService.remove(id);
    return { message: 'Producto de seguro eliminado exitosamente' };
  }

  @Patch(':id/activar')
  @ApiOperation({
    summary: 'Activar un producto de seguro',
    description: 'Activa un producto de seguro previamente desactivado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto de seguro activado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto de seguro no encontrado',
  })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productosSeguroService.activate(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({
    summary: 'Desactivar un producto de seguro',
    description: 'Desactiva un producto de seguro del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto de seguro desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto de seguro no encontrado',
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productosSeguroService.deactivate(id);
  }
}
