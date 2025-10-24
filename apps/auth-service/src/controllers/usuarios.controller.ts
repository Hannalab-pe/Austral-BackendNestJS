import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Param,
    Body,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
    Request,
    BadRequestException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { UsuariosService, UsuarioFiltros } from '../services/usuarios.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear nuevo usuario',
        description: 'Crea un nuevo usuario con los datos básicos y rol especificado',
    })
    @ApiBody({ type: CreateUsuarioDto })
    @ApiResponse({
        status: 201,
        description: 'Usuario creado exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    @ApiResponse({
        status: 409,
        description: 'Email o nombre de usuario ya existe',
    })
    async create(
        @Body() createUsuarioDto: CreateUsuarioDto,
    ): Promise<Usuario> {
        // Crear el usuario
        return this.usuariosService.create(createUsuarioDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener usuarios',
        description: 'Lista usuarios con filtros opcionales',
    })
    @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
    @ApiQuery({ name: 'id_rol', required: false, type: String })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente según jerarquía',
    })
    async findAll(
        @Request() req: any,
        @Query('esta_activo') esta_activo?: string,
        @Query('id_rol') id_rol?: string,
        @Query('search') search?: string,
    ): Promise<Usuario[]> {
        const filtros: UsuarioFiltros = {};

        if (esta_activo !== undefined) {
            filtros.estaActivo = esta_activo === 'true';
        }

        if (id_rol) {
            filtros.idRol = id_rol;
        }

        if (search) {
            filtros.search = search;
        }

        // Obtener usuarios filtrados
        return this.usuariosService.findAll(filtros);
    }

    @Get('paginated')
    @ApiOperation({
        summary: 'Obtener usuarios paginados',
        description: 'Lista usuarios con paginación y filtros',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'esta_activo', required: false, type: Boolean })
    @ApiQuery({ name: 'id_rol', required: false, type: String })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de usuarios obtenida exitosamente',
    })
    async findAllPaginated(
        @Request() req: any,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('esta_activo') esta_activo?: string,
        @Query('id_rol') id_rol?: string,
        @Query('search') search?: string,
    ) {
        const filtros: UsuarioFiltros = {};

        if (esta_activo !== undefined) {
            filtros.estaActivo = esta_activo === 'true';
        }

        if (id_rol) {
            filtros.idRol = id_rol;
        }

        if (search) {
            filtros.search = search;
        }

        // Obtener usuarios filtrados por jerarquía
        const allUsers = await this.usuariosService.findAll(filtros);

        // Aplicar paginación manualmente
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = allUsers.slice(startIndex, endIndex);

        return {
            data: paginatedUsers,
            total: allUsers.length,
            page,
            limit,
            totalPages: Math.ceil(allUsers.length / limit),
        };
    }

    @Get('stats')
    @ApiOperation({
        summary: 'Obtener estadísticas de usuarios',
        description: 'Retorna estadísticas generales de los usuarios',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas obtenidas exitosamente',
    })
    async getStats() {
        return this.usuariosService.getStats();
    }

    @Get('rol/:id_rol')
    @ApiOperation({
        summary: 'Obtener usuarios por rol',
        description: 'Lista todos los usuarios que tienen un rol específico',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios por rol obtenida exitosamente',
    })
    async findByRole(@Param('id_rol') id_rol: string): Promise<Usuario[]> {
        return this.usuariosService.findByRole(id_rol);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un usuario por ID',
        description: 'Retorna la información de un usuario específico',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario encontrado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario no encontrado',
    })
    async findOne(@Param('id') id: string): Promise<Usuario> {
        return this.usuariosService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar usuario',
        description: 'Actualiza la información de un usuario (excepto contraseña)',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario actualizado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario no encontrado',
    })
    @ApiResponse({
        status: 409,
        description: 'Email o nombre de usuario ya en uso',
    })
    async update(
        @Param('id') id: string,
        @Body() updateData: Partial<Usuario>,
        @Request() req: any,
    ): Promise<Usuario> {
        return this.usuariosService.update(id, updateData);
    }

    @Patch(':id/activate')
    @ApiOperation({
        summary: 'Activar usuario',
        description: 'Activa un usuario desactivado y resetea bloqueos',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario activado exitosamente',
    })
    async activate(@Param('id') id: string): Promise<Usuario> {
        return this.usuariosService.activate(id);
    }

    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Desactivar usuario',
        description: 'Desactiva un usuario (soft delete)',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario desactivado exitosamente',
    })
    async deactivate(@Param('id') id: string): Promise<{ message: string }> {
        await this.usuariosService.deactivate(id);
        return { message: 'Usuario desactivado exitosamente' };
    }

    @Patch(':id/block')
    @ApiOperation({
        summary: 'Bloquear usuario',
        description: 'Bloquea el acceso de un usuario al sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario bloqueado exitosamente',
    })
    async block(@Param('id') id: string): Promise<Usuario> {
        return this.usuariosService.block(id);
    }

    @Patch(':id/unblock')
    @ApiOperation({
        summary: 'Desbloquear usuario',
        description: 'Desbloquea el acceso de un usuario y resetea intentos fallidos',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario desbloqueado exitosamente',
    })
    async unblock(@Param('id') id: string): Promise<Usuario> {
        return this.usuariosService.unblock(id);
    }
}
