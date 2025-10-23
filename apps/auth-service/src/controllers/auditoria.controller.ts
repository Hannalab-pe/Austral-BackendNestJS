import {
    Controller,
    Get,
    Query,
    Param,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { AuditoriaService, AuditoriaFiltros } from '../services/auditoria.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auditoria } from '../entities/auditoria.entity';

@ApiTags('auditoria')
@Controller('auditoria')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditoriaController {
    constructor(private readonly auditoriaService: AuditoriaService) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los registros de auditoría',
        description: 'Lista todos los registros de auditoría con filtros opcionales',
    })
    @ApiQuery({ name: 'tabla', required: false, type: String, description: 'Filtrar por tabla' })
    @ApiQuery({ name: 'accion', required: false, type: String, description: 'Filtrar por acción' })
    @ApiQuery({ name: 'fecha_desde', required: false, type: String, description: 'Fecha desde (YYYY-MM-DD)' })
    @ApiQuery({ name: 'fecha_hasta', required: false, type: String, description: 'Fecha hasta (YYYY-MM-DD)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de registros de auditoría obtenida exitosamente',
        type: [Auditoria],
    })
    async findAll(
        @Query('tabla') tabla?: string,
        @Query('accion') accion?: string,
        @Query('fecha_desde') fechaDesde?: string,
        @Query('fecha_hasta') fechaHasta?: string,
    ): Promise<Auditoria[]> {
        const filtros: AuditoriaFiltros = {};

        if (tabla) {
            filtros.tabla = tabla;
        }

        if (accion) {
            filtros.accion = accion;
        }

        if (fechaDesde) {
            filtros.fechaDesde = new Date(fechaDesde);
        }

        if (fechaHasta) {
            filtros.fechaHasta = new Date(fechaHasta);
        }

        return this.auditoriaService.findAll(filtros);
    }

    @Get('usuario/:idUsuario')
    @ApiOperation({
        summary: 'Obtener registros de auditoría por usuario',
        description: 'Lista todos los registros de auditoría de un usuario específico con filtros opcionales',
    })
    @ApiQuery({ name: 'tabla', required: false, type: String, description: 'Filtrar por tabla' })
    @ApiQuery({ name: 'accion', required: false, type: String, description: 'Filtrar por acción' })
    @ApiQuery({ name: 'fecha_desde', required: false, type: String, description: 'Fecha desde (YYYY-MM-DD)' })
    @ApiQuery({ name: 'fecha_hasta', required: false, type: String, description: 'Fecha hasta (YYYY-MM-DD)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de registros de auditoría del usuario obtenida exitosamente',
        type: [Auditoria],
    })
    async findByIdUsuario(
        @Param('idUsuario') idUsuario: string,
        @Query('tabla') tabla?: string,
        @Query('accion') accion?: string,
        @Query('fecha_desde') fechaDesde?: string,
        @Query('fecha_hasta') fechaHasta?: string,
    ): Promise<Auditoria[]> {
        const filtros: AuditoriaFiltros = {};

        if (tabla) {
            filtros.tabla = tabla;
        }

        if (accion) {
            filtros.accion = accion;
        }

        if (fechaDesde) {
            filtros.fechaDesde = new Date(fechaDesde);
        }

        if (fechaHasta) {
            filtros.fechaHasta = new Date(fechaHasta);
        }

        return this.auditoriaService.findByIdUsuario(idUsuario, filtros);
    }

    @Get('stats')
    @ApiOperation({
        summary: 'Obtener estadísticas de auditoría',
        description: 'Retorna estadísticas generales de los registros de auditoría',
    })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas obtenidas exitosamente',
    })
    async getStats() {
        return this.auditoriaService.getStats();
    }
}