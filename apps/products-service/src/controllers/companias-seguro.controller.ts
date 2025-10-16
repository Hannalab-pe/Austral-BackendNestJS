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
} from '@nestjs/swagger';
import { CompaniasSeguroService } from '../services';
import { CreateCompaniaSeguroDto, UpdateCompaniaSeguroDto } from '../dto';

@ApiTags('companias-seguro')
@Controller('companias-seguro')
export class CompaniasSeguroController {
  constructor(
    private readonly companiasSeguroService: CompaniasSeguroService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las compañías de seguros',
    description: 'Obtiene una lista de todas las compañías de seguros activas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de compañías de seguros obtenida exitosamente',
  })
  async findAll() {
    return await this.companiasSeguroService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una compañía de seguros específica',
    description: 'Obtiene los detalles de una compañía de seguros por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la compañía de seguros (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Compañía de seguros obtenida exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía de seguros no encontrada',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companiasSeguroService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva compañía de seguros',
    description: 'Crea una nueva compañía de seguros en el sistema',
  })
  @ApiBody({ type: CreateCompaniaSeguroDto })
  @ApiResponse({
    status: 201,
    description: 'Compañía de seguros creada exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El RUC ya está en uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createCompaniaSeguroDto: CreateCompaniaSeguroDto) {
    return await this.companiasSeguroService.create(createCompaniaSeguroDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una compañía de seguros',
    description: 'Actualiza los datos de una compañía de seguros existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la compañía de seguros (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCompaniaSeguroDto })
  @ApiResponse({
    status: 200,
    description: 'Compañía de seguros actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía de seguros no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El RUC ya está en uso',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompaniaSeguroDto: UpdateCompaniaSeguroDto,
  ) {
    return await this.companiasSeguroService.update(
      id,
      updateCompaniaSeguroDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una compañía de seguros',
    description: 'Elimina (desactiva) una compañía de seguros del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la compañía de seguros (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Compañía de seguros eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía de seguros no encontrada',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.companiasSeguroService.remove(id);
    return { message: 'Compañía de seguros eliminada exitosamente' };
  }
}
