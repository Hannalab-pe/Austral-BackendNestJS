import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from '../entities/auditoria.entity';

export interface AuditoriaFiltros {
    tabla?: string;
    accion?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
}

@Injectable()
export class AuditoriaService {
    constructor(
        @InjectRepository(Auditoria)
        private auditoriaRepository: Repository<Auditoria>,
    ) { }

    /**
     * Obtener todos los registros de auditoría con filtros opcionales
     */
    async findAll(filtros?: AuditoriaFiltros): Promise<Auditoria[]> {
        const queryBuilder = this.auditoriaRepository
            .createQueryBuilder('auditoria')
            .leftJoinAndSelect('auditoria.usuario', 'usuario')
            .orderBy('auditoria.fechaAccion', 'DESC');

        if (filtros?.tabla) {
            queryBuilder.andWhere('auditoria.tabla = :tabla', { tabla: filtros.tabla });
        }

        if (filtros?.accion) {
            queryBuilder.andWhere('auditoria.accion = :accion', { accion: filtros.accion });
        }

        if (filtros?.fechaDesde) {
            queryBuilder.andWhere('auditoria.fechaAccion >= :fechaDesde', {
                fechaDesde: filtros.fechaDesde,
            });
        }

        if (filtros?.fechaHasta) {
            queryBuilder.andWhere('auditoria.fechaAccion <= :fechaHasta', {
                fechaHasta: filtros.fechaHasta,
            });
        }

        return await queryBuilder.getMany();
    }

    /**
     * Obtener registros de auditoría por ID de usuario
     */
    async findByIdUsuario(idUsuario: string, filtros?: Omit<AuditoriaFiltros, 'idUsuario'>): Promise<Auditoria[]> {
        const queryBuilder = this.auditoriaRepository
            .createQueryBuilder('auditoria')
            .leftJoinAndSelect('auditoria.usuario', 'usuario')
            .where('auditoria.idUsuario = :idUsuario', { idUsuario })
            .orderBy('auditoria.fechaAccion', 'DESC');

        if (filtros?.tabla) {
            queryBuilder.andWhere('auditoria.tabla = :tabla', { tabla: filtros.tabla });
        }

        if (filtros?.accion) {
            queryBuilder.andWhere('auditoria.accion = :accion', { accion: filtros.accion });
        }

        if (filtros?.fechaDesde) {
            queryBuilder.andWhere('auditoria.fechaAccion >= :fechaDesde', {
                fechaDesde: filtros.fechaDesde,
            });
        }

        if (filtros?.fechaHasta) {
            queryBuilder.andWhere('auditoria.fechaAccion <= :fechaHasta', {
                fechaHasta: filtros.fechaHasta,
            });
        }

        return await queryBuilder.getMany();
    }

    /**
     * Crear un nuevo registro de auditoría
     */
    async create(auditoriaData: {
        tabla: string;
        idRegistro: string;
        accion: string;
        idUsuario?: string;
        ipAddress?: string;
    }): Promise<Auditoria> {
        try {
            console.log('🔍 Creando registro de auditoría:', auditoriaData);

            const auditoria = this.auditoriaRepository.create({
                tabla: auditoriaData.tabla,
                idRegistro: auditoriaData.idRegistro,
                accion: auditoriaData.accion,
                idUsuario: auditoriaData.idUsuario,
                ipAddress: auditoriaData.ipAddress,
            });

            console.log('📝 Registro de auditoría creado en memoria:', auditoria);

            const savedAuditoria = await this.auditoriaRepository.save(auditoria);

            console.log('💾 Registro de auditoría guardado en BD:', savedAuditoria);

            return savedAuditoria;
        } catch (error) {
            console.error('❌ Error al crear registro de auditoría:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de auditoría
     */
    async getStats(): Promise<{
        totalRegistros: number;
        registrosHoy: number;
        accionesMasComunes: { accion: string; count: number }[];
        tablasMasAuditadas: { tabla: string; count: number }[];
    }> {
        const [totalRegistros, registrosHoy] = await Promise.all([
            this.auditoriaRepository.count(),
            this.auditoriaRepository
                .createQueryBuilder('auditoria')
                .where('DATE(auditoria.fechaAccion) = CURRENT_DATE')
                .getCount(),
        ]);

        const accionesMasComunes = await this.auditoriaRepository
            .createQueryBuilder('auditoria')
            .select('auditoria.accion', 'accion')
            .addSelect('COUNT(*)', 'count')
            .groupBy('auditoria.accion')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        const tablasMasAuditadas = await this.auditoriaRepository
            .createQueryBuilder('auditoria')
            .select('auditoria.tabla', 'tabla')
            .addSelect('COUNT(*)', 'count')
            .groupBy('auditoria.tabla')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        return {
            totalRegistros,
            registrosHoy,
            accionesMasComunes,
            tablasMasAuditadas,
        };
    }
}