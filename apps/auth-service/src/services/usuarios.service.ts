import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';

export interface UsuarioFiltros {
    estaActivo?: boolean;
    idRol?: string;
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
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
    ) { }

    /**
     * Obtener todos los usuarios con filtros opcionales
     */
    async findAll(filtros?: UsuarioFiltros): Promise<Usuario[]> {
        const where: any = {};

        if (filtros?.estaActivo !== undefined) {
            where.estaActivo = filtros.estaActivo;
        }

        if (filtros?.idRol) {
            where.idRol = filtros.idRol;
        }

        const usuarios = await this.usuarioRepository.find({
            where,
            relations: ['rol'],
            order: { fechaCreacion: 'DESC' },
            select: [
                'idUsuario',
                'nombreUsuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documentoIdentidad',
                'estaActivo',
                'ultimoAcceso',
                'cuentaBloqueada',
                'idRol',
                'fechaCreacion',
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
                    u.nombreUsuario.toLowerCase().includes(searchLower),
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

        if (filtros?.estaActivo !== undefined) {
            where.estaActivo = filtros.estaActivo;
        }

        if (filtros?.idRol) {
            where.idRol = filtros.idRol;
        }

        // Búsqueda por texto (simplificada para usar con TypeORM)
        if (filtros?.search) {
            // Para búsqueda más compleja, mejor usar findAll
            where.nombre = Like(`%${filtros.search}%`);
        }

        const [usuarios, total] = await this.usuarioRepository.findAndCount({
            where,
            order: { fechaCreacion: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: [
                'idUsuario',
                'nombreUsuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documentoIdentidad',
                'estaActivo',
                'ultimoAcceso',
                'cuentaBloqueada',
                'idRol',
                'fechaCreacion',
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
     * Crear un nuevo usuario
     */
    async create(createData: Partial<Usuario>): Promise<Usuario> {
        // Verificar si el email ya está en uso
        if (createData.email) {
            const existingEmail = await this.usuarioRepository.findOne({
                where: { email: createData.email },
            });
            if (existingEmail) {
                throw new ConflictException('El email ya está en uso');
            }
        }

        // Verificar si el nombre de usuario ya está en uso
        if (createData.nombreUsuario) {
            const existingUsername = await this.usuarioRepository.findOne({
                where: { nombreUsuario: createData.nombreUsuario },
            });
            if (existingUsername) {
                throw new ConflictException('El nombre de usuario ya está en uso');
            }
        }

        // Hash de la contraseña si está presente
        if (createData.contrasena) {
            createData.contrasena = await bcrypt.hash(createData.contrasena, 12);
        }

        // Crear el usuario con valores por defecto
        const newUser = this.usuarioRepository.create({
            ...createData,
            estaActivo: true,
            intentosFallidos: 0,
            cuentaBloqueada: false,
        });

        return await this.usuarioRepository.save(newUser);
    }
    async findOne(id: string): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { idUsuario: id },
            relations: ['rol'],
            select: [
                'idUsuario',
                'nombreUsuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documentoIdentidad',
                'estaActivo',
                'ultimoAcceso',
                'cuentaBloqueada',
                'idRol',
                'fechaCreacion',
                'intentosFallidos',
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
            where: { email, estaActivo: true },
            relations: ['rol'],
            select: [
                'idUsuario',
                'nombreUsuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documentoIdentidad',
                'estaActivo',
                'ultimoAcceso',
                'cuentaBloqueada',
                'idRol',
                'fechaCreacion',
            ],
        });
    }

    /**
     * Obtener usuario por nombre de usuario
     */
    async findByUsername(nombre_usuario: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: { nombreUsuario: nombre_usuario, estaActivo: true },
            relations: ['rol'],
            select: [
                'idUsuario',
                'nombreUsuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documentoIdentidad',
                'estaActivo',
                'ultimoAcceso',
                'cuentaBloqueada',
                'idRol',
                'fechaCreacion',
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

            if (existingEmail && existingEmail.idUsuario !== id) {
                throw new ConflictException('El email ya está en uso');
            }
        }

        // Verificar si el nombre de usuario ya está en uso
        if (
            updateData.nombreUsuario &&
            updateData.nombreUsuario !== usuario.nombreUsuario
        ) {
            const existingUsername = await this.usuarioRepository.findOne({
                where: { nombreUsuario: updateData.nombreUsuario },
            });

            if (existingUsername && existingUsername.idUsuario !== id) {
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
        usuario.estaActivo = true;
        usuario.cuentaBloqueada = false;
        usuario.intentosFallidos = 0;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Desactivar usuario (soft delete)
     */
    async deactivate(id: string): Promise<void> {
        const usuario = await this.findOne(id);
        usuario.estaActivo = false;
        await this.usuarioRepository.save(usuario);
    }

    /**
     * Bloquear usuario
     */
    async block(id: string): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.cuentaBloqueada = true;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Desbloquear usuario
     */
    async unblock(id: string): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.cuentaBloqueada = false;
        usuario.intentosFallidos = 0;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Obtener usuarios por rol
     */
    async findByRole(idRol: string): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            where: { idRol, estaActivo: true },
            relations: ['rol'],
            order: { nombre: 'ASC' },
            select: [
                'idUsuario',
                'nombreUsuario',
                'email',
                'nombre',
                'apellido',
                'telefono',
                'documentoIdentidad',
                'estaActivo',
                'ultimoAcceso',
                'cuentaBloqueada',
                'idRol',
                'fechaCreacion',
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
            this.usuarioRepository.count({ where: { estaActivo: true } }),
            this.usuarioRepository.count({ where: { cuentaBloqueada: true } }),
        ]);

        return {
            total,
            activos,
            inactivos: total - activos,
            bloqueados,
        };
    }
}
