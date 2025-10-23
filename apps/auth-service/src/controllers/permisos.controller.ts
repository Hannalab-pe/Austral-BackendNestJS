import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    HttpCode,
    HttpStatus,
    Param,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';
import { PermisosService } from '../services/permisos.service';
import { Vista } from '../entities';
import {
    VerificarPermisoRequest,
    VerificarVistaRequest,
    VerificarRutaRequest,
    VerificarPermisoResponse,
    VistasResponse,
    PermisosResponse,
    RolesResponse,
    EstadisticasPermisos,
    VistaResponse,
} from '../dto';

@ApiTags('permisos')
@Controller('permisos')
export class PermisosController {
    constructor(private readonly permisosService: PermisosService) { }

    @Post('verificar-permiso')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verificar permiso específico',
        description: 'Verifica si un usuario tiene un permiso específico en una vista determinada',
    })
    @ApiBody({ type: VerificarPermisoRequest })
    @ApiResponse({
        status: 200,
        description: 'Verificación completada',
        type: VerificarPermisoResponse,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    async verificarPermiso(@Body() request: VerificarPermisoRequest): Promise<VerificarPermisoResponse> {
        return await this.permisosService.verificarPermiso(request);
    }

    @Post('verificar-vista')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verificar acceso a vista',
        description: 'Verifica si un usuario tiene acceso a una vista (al menos un permiso)',
    })
    @ApiBody({ type: VerificarVistaRequest })
    @ApiResponse({
        status: 200,
        description: 'Verificación completada',
        type: VerificarPermisoResponse,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    async verificarVista(@Body() request: VerificarVistaRequest): Promise<VerificarPermisoResponse> {
        return await this.permisosService.verificarVista(request);
    }

    @Post('verificar-ruta')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verificar acceso a ruta',
        description: 'Verifica si un usuario tiene acceso a una ruta específica, soportando wildcards',
    })
    @ApiBody({ type: VerificarRutaRequest })
    @ApiResponse({
        status: 200,
        description: 'Verificación completada',
        type: VerificarPermisoResponse,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos',
    })
    async verificarRuta(@Body() request: VerificarRutaRequest): Promise<VerificarPermisoResponse> {
        return await this.permisosService.verificarRuta(request);
    }

    @Get('vistas')
    @ApiOperation({
        summary: 'Obtener todas las vistas',
        description: 'Obtiene una lista de todas las vistas activas del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de vistas obtenida exitosamente',
        type: VistasResponse,
    })
    async getVistas(): Promise<VistasResponse> {
        return await this.permisosService.getVistas();
    }

    @Get('permisos')
    @ApiOperation({
        summary: 'Obtener todos los permisos',
        description: 'Obtiene una lista de todos los permisos activos del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de permisos obtenida exitosamente',
        type: PermisosResponse,
    })
    async getPermisos(): Promise<PermisosResponse> {
        return await this.permisosService.getPermisos();
    }

    @Get('roles')
    @ApiOperation({
        summary: 'Obtener todos los roles',
        description: 'Obtiene una lista de todos los roles activos del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de roles obtenida exitosamente',
        type: RolesResponse,
    })
    async getRoles(): Promise<RolesResponse> {
        return await this.permisosService.getRoles();
    }

    @Get('estadisticas')
    @ApiOperation({
        summary: 'Obtener estadísticas del sistema de permisos',
        description: 'Obtiene estadísticas generales del sistema de permisos',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas obtenidas exitosamente',
        type: EstadisticasPermisos,
    })
    async getEstadisticas(): Promise<EstadisticasPermisos> {
        return await this.permisosService.getEstadisticas();
    }

    @Post('roles/:idRol/vistas/:idVista/assign')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Asignar vista a rol',
        description: 'Asigna una vista específica a un rol para que los usuarios con ese rol puedan acceder a ella',
    })
    @ApiParam({
        name: 'idRol',
        description: 'ID del rol',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiParam({
        name: 'idVista',
        description: 'ID de la vista',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Vista asignada exitosamente al rol',
    })
    @ApiResponse({
        status: 404,
        description: 'Rol o vista no encontrada',
    })
    async assignVistaToRol(
        @Param('idRol', ParseUUIDPipe) idRol: string,
        @Param('idVista', ParseUUIDPipe) idVista: string,
    ): Promise<{ message: string }> {
        await this.permisosService.assignVistaToRol(idRol, idVista);
        return { message: 'Vista asignada exitosamente al rol' };
    }

    @Delete('roles/:idRol/vistas/:idVista/unassign')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Desasignar vista de rol',
        description: 'Remueve el acceso a una vista específica de un rol',
    })
    @ApiParam({
        name: 'idRol',
        description: 'ID del rol',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiParam({
        name: 'idVista',
        description: 'ID de la vista',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Vista desasignada exitosamente del rol',
    })
    async unassignVistaFromRol(
        @Param('idRol', ParseUUIDPipe) idRol: string,
        @Param('idVista', ParseUUIDPipe) idVista: string,
    ): Promise<{ message: string }> {
        await this.permisosService.unassignVistaFromRol(idRol, idVista);
        return { message: 'Vista desasignada exitosamente del rol' };
    }

    @Get('roles/:idRol/vistas')
    @ApiOperation({
        summary: 'Obtener vistas asignadas a un rol',
        description: 'Obtiene la lista de vistas que están asignadas a un rol específico',
    })
    @ApiParam({
        name: 'idRol',
        description: 'ID del rol',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Vistas obtenidas exitosamente',
        type: [VistaResponse],
    })
    @ApiResponse({
        status: 404,
        description: 'Rol no encontrado',
    })
    async getVistasByRol(@Param('idRol', ParseUUIDPipe) idRol: string): Promise<Vista[]> {
        return await this.permisosService.getVistasByRol(idRol);
    }
}