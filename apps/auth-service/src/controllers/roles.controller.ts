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
import { RolesService } from '../services/roles.service';
import { CreateRolDto, UpdateRolDto } from '../dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los roles',
    description: 'Obtiene una lista de todos los roles activos del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
  })
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un rol específico',
    description: 'Obtiene los detalles de un rol por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del rol (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo rol',
    description: 'Crea un nuevo rol en el sistema',
  })
  @ApiBody({ type: CreateRolDto })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El nombre del rol ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createRolDto: CreateRolDto) {
    return await this.rolesService.create(createRolDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un rol',
    description: 'Actualiza los datos de un rol existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del rol (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateRolDto })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El nombre del rol ya existe',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    return await this.rolesService.update(id, updateRolDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un rol',
    description: 'Elimina (desactiva) un rol del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del rol (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.rolesService.remove(id);
    return { message: 'Rol eliminado exitosamente' };
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Crear roles por defecto',
    description: 'Crea los roles básicos del sistema si no existen',
  })
  @ApiResponse({
    status: 201,
    description: 'Roles por defecto creados exitosamente',
  })
  async createDefaultRoles() {
    await this.rolesService.createDefaultRoles();
    return { message: 'Roles por defecto creados exitosamente' };
  }
}
