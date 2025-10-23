import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, Rol, Vista, Permiso, RolPermisoVista } from '../entities';
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
    PermisoResponse,
    RolResponse,
} from '../dto';

@Injectable()
export class PermisosService {
    private readonly logger = new Logger(PermisosService.name);

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
        @InjectRepository(Vista)
        private vistaRepository: Repository<Vista>,
        @InjectRepository(Permiso)
        private permisoRepository: Repository<Permiso>,
        @InjectRepository(RolPermisoVista)
        private rolPermisoVistaRepository: Repository<RolPermisoVista>,
    ) { }

    /**
     * Verifica si un usuario tiene un permiso específico en una vista
     */
    async verificarPermiso(request: VerificarPermisoRequest): Promise<VerificarPermisoResponse> {
        try {
            this.logger.debug(`Verificando permiso: usuario=${request.idUsuario}, vista=${request.vista}, permiso=${request.permiso}`);

            // 1. Obtener el usuario y su rol
            const usuario = await this.usuarioRepository.findOne({
                where: { idUsuario: request.idUsuario, estaActivo: true },
                relations: ['rol'],
            });

            if (!usuario) {
                this.logger.warn(`Usuario no encontrado: ${request.idUsuario}`);
                return { tienePermiso: false, mensaje: 'Usuario no encontrado' };
            }

            if (!usuario.idRol) {
                this.logger.warn(`Usuario sin rol asignado: ${request.idUsuario}`);
                return { tienePermiso: false, mensaje: 'Usuario sin rol asignado' };
            }            // 2. Buscar la vista por ruta
            const vista = await this.vistaRepository.findOne({
                where: { ruta: request.vista, estaActiva: true },
            });

            if (!vista) {
                this.logger.warn(`Vista no encontrada: ${request.vista}`);
                return { tienePermiso: false, mensaje: 'Vista no encontrada' };
            }

            // 3. Buscar el permiso por nombre
            const permiso = await this.permisoRepository.findOne({
                where: { nombre: request.permiso, estaActivo: true },
            });

            if (!permiso) {
                this.logger.warn(`Permiso no encontrado: ${request.permiso}`);
                return { tienePermiso: false, mensaje: 'Permiso no encontrado' };
            }

            // 4. Verificar si el rol del usuario tiene este permiso en esta vista
            const tienePermiso = await this.rolPermisoVistaRepository.exists({
                where: {
                    idRol: usuario.idRol,
                    idVista: vista.idVista,
                    idPermiso: permiso.idPermiso,
                },
            }); this.logger.debug(`Resultado verificación permiso: ${tienePermiso}`);
            return {
                tienePermiso,
                mensaje: tienePermiso ? 'Permiso concedido' : 'Permiso denegado'
            };

        } catch (error) {
            this.logger.error(`Error al verificar permiso: ${error.message}`, error.stack);
            throw new BadRequestException('Error al verificar permiso');
        }
    }

    /**
     * Verifica si un usuario tiene acceso a una vista (al menos un permiso)
     */
    async verificarVista(request: VerificarVistaRequest): Promise<VerificarPermisoResponse> {
        try {
            this.logger.debug(`Verificando vista: usuario=${request.idUsuario}, vista=${request.vista}`);

            // 1. Obtener el usuario y su rol
            const usuario = await this.usuarioRepository.findOne({
                where: { idUsuario: request.idUsuario, estaActivo: true },
            });

            if (!usuario || !usuario.idRol) {
                this.logger.warn(`Usuario no encontrado o sin rol: ${request.idUsuario}`);
                return { tienePermiso: false, mensaje: 'Usuario no encontrado o sin rol asignado' };
            }

            // 2. Buscar la vista por ruta
            const vista = await this.vistaRepository.findOne({
                where: { ruta: request.vista, estaActiva: true },
            }); if (!vista) {
                this.logger.warn(`Vista no encontrada: ${request.vista}`);
                return { tienePermiso: false, mensaje: 'Vista no encontrada' };
            }

            // 3. Verificar si el rol tiene al menos un permiso en esta vista
            const count = await this.rolPermisoVistaRepository.count({
                where: {
                    idRol: usuario.idRol,
                    idVista: vista.idVista,
                },
            });

            const tieneAcceso = count > 0;
            this.logger.debug(`Resultado verificación vista: ${tieneAcceso} (permisos: ${count})`);

            return {
                tienePermiso: tieneAcceso,
                mensaje: tieneAcceso ? 'Acceso concedido a la vista' : 'Acceso denegado a la vista'
            };

        } catch (error) {
            this.logger.error(`Error al verificar vista: ${error.message}`, error.stack);
            throw new BadRequestException('Error al verificar vista');
        }
    }

    /**
     * Verifica si un usuario tiene acceso a una ruta (con soporte para wildcards)
     */
    async verificarRuta(request: VerificarRutaRequest): Promise<VerificarPermisoResponse> {
        try {
            this.logger.debug(`Verificando ruta: usuario=${request.idUsuario}, ruta=${request.ruta}`);

            // 1. Obtener el usuario y su rol
            const usuario = await this.usuarioRepository.findOne({
                where: { idUsuario: request.idUsuario, estaActivo: true },
            });

            if (!usuario || !usuario.idRol) {
                this.logger.warn(`Usuario no encontrado o sin rol: ${request.idUsuario}`);
                return { tienePermiso: false, mensaje: 'Usuario no encontrado o sin rol asignado' };
            }

            // 2. Buscar vistas que coincidan con la ruta (con soporte para wildcards)
            const vistasCoincidentes = await this.encontrarVistasPorRuta(request.ruta);

            if (vistasCoincidentes.length === 0) {
                this.logger.warn(`No se encontraron vistas para la ruta: ${request.ruta}`);
                return { tienePermiso: false, mensaje: 'Ruta no encontrada' };
            }

            // 3. Verificar si el usuario tiene al menos un permiso en alguna de las vistas coincidentes
            for (const vista of vistasCoincidentes) {
                const count = await this.rolPermisoVistaRepository.count({
                    where: {
                        idRol: usuario.idRol,
                        idVista: vista.idVista,
                    },
                });

                if (count > 0) {
                    this.logger.debug(`Acceso concedido a ruta ${request.ruta} via vista ${vista.ruta}`);
                    return {
                        tienePermiso: true,
                        mensaje: 'Acceso concedido a la ruta'
                    };
                }
            }

            this.logger.debug(`Acceso denegado a ruta: ${request.ruta}`);
            return {
                tienePermiso: false,
                mensaje: 'Acceso denegado a la ruta'
            };

        } catch (error) {
            this.logger.error(`Error al verificar ruta: ${error.message}`, error.stack);
            throw new BadRequestException('Error al verificar ruta');
        }
    }

    /**
     * Encuentra vistas que coincidan con una ruta, soportando wildcards
     */
    private async encontrarVistasPorRuta(ruta: string): Promise<Vista[]> {
        // Primero buscar coincidencia exacta
        let vistas = await this.vistaRepository.find({
            where: { ruta: ruta, estaActiva: true },
        });

        if (vistas.length > 0) {
            return vistas;
        }

        // Si no hay coincidencia exacta, buscar patrones con wildcards
        const patrones = this.generarPatronesWildcard(ruta);

        for (const patron of patrones) {
            const vistasPatron = await this.vistaRepository
                .createQueryBuilder('vista')
                .where('vista.ruta LIKE :patron AND vista.estaActiva = true', { patron })
                .getMany();

            if (vistasPatron.length > 0) {
                return vistasPatron;
            }
        }

        return [];
    }

    /**
     * Genera patrones de búsqueda con wildcards para una ruta
     */
    private generarPatronesWildcard(ruta: string): string[] {
        const partes = ruta.split('/').filter(p => p.length > 0);
        const patrones: string[] = [];

        // Generar patrones progresivamente más genéricos
        for (let i = partes.length; i > 0; i--) {
            const patron = partes.slice(0, i).join('/') + (i < partes.length ? '/%' : '');
            patrones.push(patron);
        }

        // Agregar patrón completamente wildcard al final
        patrones.push('%');

        return patrones;
    }

    /**
     * Obtiene todas las vistas activas
     */
    async getVistas(): Promise<VistasResponse> {
        try {
            const vistas = await this.vistaRepository.find({
                where: { estaActiva: true },
                order: { ruta: 'ASC' },
            });

            const vistasResponse: VistaResponse[] = vistas.map(vista => ({
                idVista: vista.idVista,
                nombre: vista.nombre,
                descripcion: vista.descripcion,
                ruta: vista.ruta,
                estaActiva: vista.estaActiva,
            }));

            return {
                vistas: vistasResponse,
                total: vistasResponse.length,
            };

        } catch (error) {
            this.logger.error(`Error al obtener vistas: ${error.message}`, error.stack);
            throw new BadRequestException('Error al obtener vistas');
        }
    }

    /**
     * Obtiene todos los permisos activos
     */
    async getPermisos(): Promise<PermisosResponse> {
        try {
            const permisos = await this.permisoRepository.find({
                where: { estaActivo: true },
                order: { nombre: 'ASC' },
            });

            const permisosResponse: PermisoResponse[] = permisos.map(permiso => ({
                idPermiso: permiso.idPermiso,
                nombre: permiso.nombre,
                descripcion: permiso.descripcion,
                estaActivo: permiso.estaActivo,
            }));

            return {
                permisos: permisosResponse,
                total: permisosResponse.length,
            };

        } catch (error) {
            this.logger.error(`Error al obtener permisos: ${error.message}`, error.stack);
            throw new BadRequestException('Error al obtener permisos');
        }
    }

    /**
     * Obtiene todos los roles activos
     */
    async getRoles(): Promise<RolesResponse> {
        try {
            const roles = await this.rolRepository.find({
                where: { estaActivo: true },
                order: { nivelAcceso: 'DESC', nombre: 'ASC' },
            });

            const rolesResponse: RolResponse[] = roles.map(rol => ({
                idRol: rol.idRol,
                nombre: rol.nombre,
                descripcion: rol.descripcion,
                nivelAcceso: rol.nivelAcceso,
                estaActivo: rol.estaActivo,
            }));

            return {
                roles: rolesResponse,
                total: rolesResponse.length,
            };

        } catch (error) {
            this.logger.error(`Error al obtener roles: ${error.message}`, error.stack);
            throw new BadRequestException('Error al obtener roles');
        }
    }

    /**
 * Asignar una vista a un rol
 */
    async assignVistaToRol(idRol: string, idVista: string): Promise<void> {
        try {
            this.logger.debug(`Asignando vista ${idVista} al rol ${idRol}`);

            // Verificar que el rol existe
            const rol = await this.rolRepository.findOne({
                where: { idRol, estaActivo: true },
            });

            if (!rol) {
                throw new NotFoundException(`Rol con ID ${idRol} no encontrado`);
            }

            // Verificar que la vista existe
            const vista = await this.vistaRepository.findOne({
                where: { idVista, estaActiva: true },
            });

            if (!vista) {
                throw new NotFoundException(`Vista con ID ${idVista} no encontrada`);
            }

            // Buscar o crear el permiso de "acceso"
            let permisoAcceso = await this.permisoRepository.findOne({
                where: { nombre: 'acceso', estaActivo: true },
            });

            if (!permisoAcceso) {
                // Crear el permiso de acceso si no existe
                permisoAcceso = this.permisoRepository.create({
                    nombre: 'acceso',
                    descripcion: 'Permiso básico de acceso a vista',
                    estaActivo: true,
                });
                permisoAcceso = await this.permisoRepository.save(permisoAcceso);
                this.logger.debug(`Permiso de acceso creado con ID: ${permisoAcceso.idPermiso}`);
            }

            // Verificar si ya existe la asignación
            const existingAssignment = await this.rolPermisoVistaRepository.findOne({
                where: { idRol, idVista, idPermiso: permisoAcceso.idPermiso },
            });

            if (existingAssignment) {
                this.logger.warn(`La vista ${idVista} ya está asignada al rol ${idRol}`);
                return; // Ya está asignada, no hacer nada
            }

            // Crear la asignación con el permiso de acceso
            const newAssignment = this.rolPermisoVistaRepository.create({
                idRol,
                idVista,
                idPermiso: permisoAcceso.idPermiso,
            });

            await this.rolPermisoVistaRepository.save(newAssignment);
            this.logger.debug(`Vista ${idVista} asignada exitosamente al rol ${idRol}`);

        } catch (error) {
            this.logger.error(`Error al asignar vista al rol: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Desasignar una vista de un rol
     */
    async unassignVistaFromRol(idRol: string, idVista: string): Promise<void> {
        try {
            this.logger.debug(`Desasignando vista ${idVista} del rol ${idRol}`);

            // Eliminar todas las asignaciones de esta vista para este rol
            const result = await this.rolPermisoVistaRepository.delete({
                idRol,
                idVista,
            });

            if (result.affected === 0) {
                this.logger.warn(`No se encontró asignación de vista ${idVista} para el rol ${idRol}`);
            } else {
                this.logger.debug(`Vista ${idVista} desasignada exitosamente del rol ${idRol}`);
            }

        } catch (error) {
            this.logger.error(`Error al desasignar vista del rol: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Obtener vistas asignadas a un rol específico
     */
    async getVistasByRol(idRol: string): Promise<Vista[]> {
        try {
            this.logger.debug(`Obteniendo vistas asignadas al rol ${idRol}`);

            // Verificar que el rol existe
            const rol = await this.rolRepository.findOne({
                where: { idRol, estaActivo: true },
            });

            if (!rol) {
                throw new NotFoundException(`Rol con ID ${idRol} no encontrado`);
            }

            // Buscar el permiso de "acceso"
            const permisoAcceso = await this.permisoRepository.findOne({
                where: { nombre: 'acceso', estaActivo: true },
            });

            if (!permisoAcceso) {
                this.logger.debug(`No se encontró permiso de acceso, retornando lista vacía para rol ${idRol}`);
                return [];
            }

            // Obtener vistas asignadas al rol con el permiso de acceso
            const assignments = await this.rolPermisoVistaRepository.find({
                where: { idRol, idPermiso: permisoAcceso.idPermiso },
                relations: ['vista'],
            });

            const vistas = assignments
                .map(assignment => assignment.vista)
                .filter(vista => vista && vista.estaActiva);

            this.logger.debug(`Encontradas ${vistas.length} vistas asignadas al rol ${idRol}`);
            return vistas;

        } catch (error) {
            this.logger.error(`Error al obtener vistas del rol: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas del sistema de permisos
     */
    async getEstadisticas(): Promise<EstadisticasPermisos> {
        try {
            const [totalVistas, totalPermisos, totalRoles, totalAsignaciones] = await Promise.all([
                this.vistaRepository.count({ where: { estaActiva: true } }),
                this.permisoRepository.count({ where: { estaActivo: true } }),
                this.rolRepository.count({ where: { estaActivo: true } }),
                this.rolPermisoVistaRepository.count(),
            ]);

            return {
                totalVistas,
                totalPermisos,
                totalRoles,
                totalAsignaciones,
            };

        } catch (error) {
            this.logger.error(`Error al obtener estadísticas: ${error.message}`, error.stack);
            throw new BadRequestException('Error al obtener estadísticas');
        }
    }
}