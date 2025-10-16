import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TiposSegurosService } from '../services';
import { CreateTipoSeguroDto, UpdateTipoSeguroDto } from '../dto';

@ApiTags('tipos-seguros')
@Controller('tipos-seguros')
export class TiposSegurosController {
  constructor(private readonly tiposSegurosService: TiposSegurosService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de seguros',
    description: 'Obtiene una lista de todos los tipos de seguros activos',
  })
  @ApiQuery({
    name: 'categoria',
    required: false,
    description: 'Filtrar por categoría',
    example: 'Automotriz',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de seguros obtenida exitosamente',
  })
  async findAll(@Query('categoria') categoria?: string) {
    if (categoria) {
      return await this.tiposSegurosService.findByCategory(categoria);
    }
    return await this.tiposSegurosService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de seguro específico',
    description: 'Obtiene los detalles de un tipo de seguro por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de seguro obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de seguro no encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tiposSegurosService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de seguro',
    description: 'Crea un nuevo tipo de seguro en el sistema',
  })
  @ApiBody({ type: CreateTipoSeguroDto })
  @ApiResponse({
    status: 201,
    description: 'Tipo de seguro creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El nombre del tipo de seguro ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createTipoSeguroDto: CreateTipoSeguroDto) {
    return await this.tiposSegurosService.create(createTipoSeguroDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de seguro',
    description: 'Actualiza los datos de un tipo de seguro existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateTipoSeguroDto })
  @ApiResponse({
    status: 200,
    description: 'Tipo de seguro actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de seguro no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El nombre del tipo de seguro ya existe',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoSeguroDto: UpdateTipoSeguroDto,
  ) {
    return await this.tiposSegurosService.update(id, updateTipoSeguroDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de seguro',
    description: 'Elimina (desactiva) un tipo de seguro del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de seguro eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de seguro no encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tiposSegurosService.remove(id);
    return { message: 'Tipo de seguro eliminado exitosamente' };
  }
}
