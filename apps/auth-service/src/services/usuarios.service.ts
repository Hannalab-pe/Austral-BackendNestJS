import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

export interface UsuarioFiltros {
    esta_activo?: boolean;
    id_rol?: string;
    search?: string; // Búsqueda por nombre, apellido, email o nombre_usuario
}

export interface UsuarioPaginado {
    data: Usuario[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    /**
     * Obtener todos los usuarios con filtros opcionales
     */
    async findAll(filtros?: UsuarioFiltros): Promise<Usuario[]> {
        const where: any = {};

        if (filtros?.esta_activo !== undefined) {
            where.esta_activo = filtros.esta_activo;
        }

        if (filtros?.id_rol) {
            where.id_rol = filtros.id_rol;
        }

        const usuarios = await this.usuarioRepository.find({
            where,
            order: { fecha_creacion: 'DESC' },
            select: [
                'id_usuario',
                'nombre_usuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documento_identidad',
                'id_asociado',
                'supervisor_id',
                'esta_activo',
                'ultimo_acceso',
                'cuenta_bloqueada',
                'id_rol',
                'fecha_creacion',
            ], // Excluir contraseña e intentos_fallidos
        });

        // Filtro de búsqueda en memoria (para múltiples campos)
        if (filtros?.search) {
            const searchLower = filtros.search.toLowerCase();
            return usuarios.filter(
                (u) =>
                    u.nombre.toLowerCase().includes(searchLower) ||
                    u.apellido.toLowerCase().includes(searchLower) ||
                    u.email.toLowerCase().includes(searchLower) ||
                    u.nombre_usuario.toLowerCase().includes(searchLower),
            );
        }

        return usuarios;
    }

    /**
     * Obtener usuarios con paginación
     */
    async findAllPaginated(
        page: number = 1,
        limit: number = 10,
        filtros?: UsuarioFiltros,
    ): Promise<UsuarioPaginado> {
        const where: any = {};

        if (filtros?.esta_activo !== undefined) {
            where.esta_activo = filtros.esta_activo;
        }

        if (filtros?.id_rol) {
            where.id_rol = filtros.id_rol;
        }

        // Búsqueda por texto (simplificada para usar con TypeORM)
        if (filtros?.search) {
            // Para búsqueda más compleja, mejor usar findAll
            where.nombre = Like(`%${filtros.search}%`);
        }

        const [usuarios, total] = await this.usuarioRepository.findAndCount({
            where,
            order: { fecha_creacion: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: [
                'id_usuario',
                'nombre_usuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documento_identidad',
                'id_asociado',
                'supervisor_id',
                'esta_activo',
                'ultimo_acceso',
                'cuenta_bloqueada',
                'id_rol',
                'fecha_creacion',
            ],
        });

        return {
            data: usuarios,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Obtener un usuario por ID
     */
    async findOne(id: string): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id_usuario: id },
            select: [
                'id_usuario',
                'nombre_usuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documento_identidad',
                'id_asociado',
                'supervisor_id',
                'esta_activo',
                'ultimo_acceso',
                'cuenta_bloqueada',
                'id_rol',
                'fecha_creacion',
                'intentos_fallidos',
            ],
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return usuario;
    }

    /**
     * Obtener usuario por email
     */
    async findByEmail(email: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: { email, esta_activo: true },
            select: [
                'id_usuario',
                'nombre_usuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documento_identidad',
                'id_asociado',
                'supervisor_id',
                'esta_activo',
                'ultimo_acceso',
                'cuenta_bloqueada',
                'id_rol',
                'fecha_creacion',
            ],
        });
    }

    /**
     * Obtener usuario por nombre de usuario
     */
    async findByUsername(nombre_usuario: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: { nombre_usuario, esta_activo: true },
            select: [
                'id_usuario',
                'nombre_usuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documento_identidad',
                'id_asociado',
                'supervisor_id',
                'esta_activo',
                'ultimo_acceso',
                'cuenta_bloqueada',
                'id_rol',
                'fecha_creacion',
            ],
        });
    }

    /**
     * Actualizar usuario (sin contraseña)
     */
    async update(
        id: string,
        updateData: Partial<Usuario>,
    ): Promise<Usuario> {
        const usuario = await this.findOne(id);

        // No permitir actualizar la contraseña desde aquí
        if (updateData.contrasena) {
            throw new BadRequestException(
                'Use el endpoint de cambio de contraseña para actualizar la contraseña',
            );
        }

        // Verificar si el email ya está en uso por otro usuario
        if (updateData.email && updateData.email !== usuario.email) {
            const existingEmail = await this.usuarioRepository.findOne({
                where: { email: updateData.email },
            });

            if (existingEmail && existingEmail.id_usuario !== id) {
                throw new ConflictException('El email ya está en uso');
            }
        }

        // Verificar si el nombre de usuario ya está en uso
        if (
            updateData.nombre_usuario &&
            updateData.nombre_usuario !== usuario.nombre_usuario
        ) {
            const existingUsername = await this.usuarioRepository.findOne({
                where: { nombre_usuario: updateData.nombre_usuario },
            });

            if (existingUsername && existingUsername.id_usuario !== id) {
                throw new ConflictException('El nombre de usuario ya está en uso');
            }
        }

        Object.assign(usuario, updateData);
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Activar usuario
     */
    async activate(id: string): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.esta_activo = true;
        usuario.cuenta_bloqueada = false;
        usuario.intentos_fallidos = 0;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Desactivar usuario (soft delete)
     */
    async deactivate(id: string): Promise<void> {
        const usuario = await this.findOne(id);
        usuario.esta_activo = false;
        await this.usuarioRepository.save(usuario);
    }

    /**
     * Bloquear usuario
     */
    async block(id: string): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.cuenta_bloqueada = true;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Desbloquear usuario
     */
    async unblock(id: string): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.cuenta_bloqueada = false;
        usuario.intentos_fallidos = 0;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Obtener usuarios por rol
     */
    async findByRole(id_rol: string): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            where: { id_rol, esta_activo: true },
            order: { nombre: 'ASC' },
            select: [
                'id_usuario',
                'nombre_usuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documento_identidad',
                'id_asociado',
                'supervisor_id',
                'esta_activo',
                'ultimo_acceso',
                'cuenta_bloqueada',
                'id_rol',
                'fecha_creacion',
            ],
        });
    }

    /**
     * Obtener estadísticas de usuarios
     */
    async getStats(): Promise<{
        total: number;
        activos: number;
        inactivos: number;
        bloqueados: number;
    }> {
        const [total, activos, bloqueados] = await Promise.all([
            this.usuarioRepository.count(),
            this.usuarioRepository.count({ where: { esta_activo: true } }),
            this.usuarioRepository.count({ where: { cuenta_bloqueada: true } }),
        ]);

        return {
            total,
            activos,
            inactivos: total - activos,
            bloqueados,
        };
    }
}
