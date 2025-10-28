import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PolizaService } from '../services/poliza.service';
import { CreatePolizaDto, UpdatePolizaDto, PolizaResponseDto } from '../dto/poliza.dto';

@ApiTags('polizas')
@Controller('polizas')
export class PolizaController {
  constructor(private readonly polizaService: PolizaService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva póliza',
    description: 'Crear una nueva póliza de seguro para un cliente',
  })
  @ApiResponse({
    status: 201,
    description: 'Póliza creada exitosamente',
    type: PolizaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o número de póliza duplicado',
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía o producto no encontrado',
  })
  async create(
    @Body() createPolizaDto: CreatePolizaDto,
    @Request() req?,
  ): Promise<PolizaResponseDto> {
    // Si hay autenticación JWT, usa el ID del usuario autenticado
    // Si no, el frontend debe enviar el ID en el DTO o usar un ID por defecto
    const idUsuarioCreador = req?.user?.userId || req?.user?.id || 'sistema';
    return this.polizaService.create(createPolizaDto, idUsuarioCreador);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las pólizas activas',
    description: 'Listar todas las pólizas activas en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pólizas obtenida exitosamente',
    type: [PolizaResponseDto],
  })
  async findAll(): Promise<PolizaResponseDto[]> {
    return this.polizaService.findAll();
  }

  @Get('cliente/:idCliente')
  @ApiOperation({
    summary: 'Obtener pólizas por cliente',
    description: 'Listar todas las pólizas activas de un cliente específico',
  })
  @ApiParam({
    name: 'idCliente',
    description: 'ID del cliente (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pólizas del cliente obtenida exitosamente',
    type: [PolizaResponseDto],
  })
  async findByCliente(@Param('idCliente') idCliente: string): Promise<PolizaResponseDto[]> {
    return this.polizaService.findByCliente(idCliente);
  }

  @Get('mis-polizas')
  @ApiOperation({
    summary: 'Obtener mis pólizas creadas',
    description: 'Listar todas las pólizas creadas por el usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pólizas del usuario obtenida exitosamente',
    type: [PolizaResponseDto],
  })
  async findByUsuarioCreador(@Request() req): Promise<PolizaResponseDto[]> {
    const idUsuarioCreador = req?.user?.userId || req?.user?.id;
    return this.polizaService.findByUsuarioCreador(idUsuarioCreador);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener póliza por ID',
    description: 'Obtener los detalles de una póliza específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la póliza (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Póliza encontrada',
    type: PolizaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Póliza no encontrada',
  })
  async findOne(@Param('id') id: string): Promise<PolizaResponseDto> {
    return this.polizaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar póliza',
    description: 'Actualizar la información de una póliza existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la póliza (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Póliza actualizada exitosamente',
    type: PolizaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Póliza no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePolizaDto: UpdatePolizaDto,
  ): Promise<PolizaResponseDto> {
    return this.polizaService.update(id, updatePolizaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar póliza (soft delete)',
    description: 'Desactivar una póliza (no se elimina físicamente)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la póliza (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Póliza eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Póliza no encontrada',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.polizaService.remove(id);
    return { message: 'Póliza eliminada exitosamente' };
  }
}
