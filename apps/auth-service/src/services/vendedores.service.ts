import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { BrokerVendedor } from '../entities/broker-vendedor.entity';
import { Rol } from '../entities/rol.entity';
import { CreateVendedorDto } from '../dto/create-vendedor.dto';
import { UpdateVendedorDto } from '../dto/update-vendedor.dto';
import * as bcrypt from 'bcrypt';

export interface VendedorFiltros {
    estaActivo?: boolean;
    search?: string;
}

export interface VendedorPaginado {
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class VendedoresService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(BrokerVendedor)
        private brokerVendedorRepository: Repository<BrokerVendedor>,
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
    ) { }

    /**
     * Crear un nuevo vendedor y asignarlo a un broker
     */
    async create(createVendedorDto: CreateVendedorDto, idBroker: string): Promise<Usuario> {
        // Verificar que el broker existe y tiene rol de broker
        const broker = await this.usuarioRepository.findOne({
            where: { idUsuario: idBroker },
            relations: ['rol'],
        });

        if (!broker) {
            throw new NotFoundException('Broker no encontrado');
        }

        if (broker.rol.nombre !== 'Broker') {
            throw new BadRequestException('El usuario no tiene rol de Broker');
        }

        // Verificar que el email y nombre de usuario no existan
        const usuarioExistente = await this.usuarioRepository.findOne({
            where: [
                { email: createVendedorDto.email },
                { nombreUsuario: createVendedorDto.nombreUsuario },
            ],
        });

        if (usuarioExistente) {
            if (usuarioExistente.email === createVendedorDto.email) {
                throw new ConflictException('El email ya está registrado');
            }
            throw new ConflictException('El nombre de usuario ya está registrado');
        }

        // Obtener el rol de vendedor
        const rolVendedor = await this.rolRepository.findOne({
            where: { nombre: 'Vendedor' },
        });

        if (!rolVendedor) {
            throw new BadRequestException('Rol de Vendedor no configurado en el sistema');
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(createVendedorDto.contrasena, 10);

        // Crear el usuario vendedor
        const nuevoVendedor = new Usuario();
        nuevoVendedor.nombreUsuario = createVendedorDto.nombreUsuario;
        nuevoVendedor.email = createVendedorDto.email;
        nuevoVendedor.contrasena = hashedPassword;
        nuevoVendedor.nombre = createVendedorDto.nombre;
        nuevoVendedor.apellido = createVendedorDto.apellido;
        nuevoVendedor.telefono = createVendedorDto.telefono || undefined;
        nuevoVendedor.documentoIdentidad = createVendedorDto.documentoIdentidad || undefined;
        nuevoVendedor.idRol = rolVendedor.idRol;
        nuevoVendedor.estaActivo = true;

        const vendedorGuardado = await this.usuarioRepository.save(nuevoVendedor);

        // Crear la relación broker-vendedor
        const brokerVendedor = this.brokerVendedorRepository.create({
            idBroker: idBroker,
            idVendedor: vendedorGuardado.idUsuario,
            porcentajeComision: createVendedorDto.porcentajeComision,
            estaActivo: true,
        });

        await this.brokerVendedorRepository.save(brokerVendedor);

        // Retornar el vendedor sin la contraseña
        const { contrasena, ...vendedorSinContrasena } = vendedorGuardado;
        return vendedorSinContrasena as Usuario;
    }

    /**
     * Obtener todos los vendedores de un broker
     */
    async findAllByBroker(
        idBroker: string,
        filtros?: VendedorFiltros,
    ): Promise<any[]> {
        const where: any = { idBroker };

        if (filtros?.estaActivo !== undefined) {
            where.estaActivo = filtros.estaActivo;
        }

        const relaciones = await this.brokerVendedorRepository.find({
            where,
            relations: ['vendedor', 'vendedor.rol'],
            order: { fechaAsignacion: 'DESC' },
        });

        let vendedoresConInfo = relaciones.map((rel) => ({
            idUsuario: rel.vendedor.idUsuario,
            nombreUsuario: rel.vendedor.nombreUsuario,
            email: rel.vendedor.email,
            nombre: rel.vendedor.nombre,
            apellido: rel.vendedor.apellido,
            telefono: rel.vendedor.telefono,
            documentoIdentidad: rel.vendedor.documentoIdentidad,
            estaActivo: rel.vendedor.estaActivo,
            porcentajeComision: rel.porcentajeComision,
            relacionActiva: rel.estaActivo,
            fechaAsignacion: rel.fechaAsignacion,
        }));

        // Filtro de búsqueda
        if (filtros?.search) {
            const searchLower = filtros.search.toLowerCase();
            vendedoresConInfo = vendedoresConInfo.filter(
                (v) =>
                    v.nombre.toLowerCase().includes(searchLower) ||
                    v.apellido.toLowerCase().includes(searchLower) ||
                    v.email.toLowerCase().includes(searchLower) ||
                    v.nombreUsuario.toLowerCase().includes(searchLower),
            );
        }

        return vendedoresConInfo;
    }

    /**
     * Obtener vendedores de un broker con paginación
     */
    async findAllByBrokerPaginated(
        idBroker: string,
        page: number = 1,
        limit: number = 10,
        filtros?: VendedorFiltros,
    ): Promise<VendedorPaginado> {
        const vendedores = await this.findAllByBroker(idBroker, filtros);

        const total = vendedores.length;
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const data = vendedores.slice(skip, skip + limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }

    /**
     * Obtener un vendedor específico por su ID (verificando que pertenezca al broker)
     */
    async findOne(idVendedor: string, idBroker: string): Promise<any> {
        const relacion = await this.brokerVendedorRepository.findOne({
            where: { idVendedor, idBroker },
            relations: ['vendedor', 'vendedor.rol'],
        });

        if (!relacion) {
            throw new NotFoundException('Vendedor no encontrado o no pertenece a este broker');
        }

        return {
            idUsuario: relacion.vendedor.idUsuario,
            nombreUsuario: relacion.vendedor.nombreUsuario,
            email: relacion.vendedor.email,
            nombre: relacion.vendedor.nombre,
            apellido: relacion.vendedor.apellido,
            telefono: relacion.vendedor.telefono,
            documentoIdentidad: relacion.vendedor.documentoIdentidad,
            estaActivo: relacion.vendedor.estaActivo,
            porcentajeComision: relacion.porcentajeComision,
            relacionActiva: relacion.estaActivo,
            fechaAsignacion: relacion.fechaAsignacion,
        };
    }

    /**
     * Actualizar información del vendedor
     */
    async update(
        idVendedor: string,
        idBroker: string,
        updateVendedorDto: UpdateVendedorDto,
    ): Promise<any> {
        // Verificar que la relación existe
        const relacion = await this.brokerVendedorRepository.findOne({
            where: { idVendedor, idBroker },
            relations: ['vendedor'],
        });

        if (!relacion) {
            throw new NotFoundException('Vendedor no encontrado o no pertenece a este broker');
        }

        const vendedor = relacion.vendedor;

        // Si se actualiza el email o nombre de usuario, verificar que no exista
        if (updateVendedorDto.email && updateVendedorDto.email !== vendedor.email) {
            const emailExiste = await this.usuarioRepository.findOne({
                where: { email: updateVendedorDto.email },
            });

            if (emailExiste) {
                throw new ConflictException('El email ya está registrado');
            }
        }

        if (updateVendedorDto.nombreUsuario && updateVendedorDto.nombreUsuario !== vendedor.nombreUsuario) {
            const nombreUsuarioExiste = await this.usuarioRepository.findOne({
                where: { nombreUsuario: updateVendedorDto.nombreUsuario },
            });

            if (nombreUsuarioExiste) {
                throw new ConflictException('El nombre de usuario ya está registrado');
            }
        }

        // Actualizar datos del usuario
        if (updateVendedorDto.nombreUsuario) vendedor.nombreUsuario = updateVendedorDto.nombreUsuario;
        if (updateVendedorDto.email) vendedor.email = updateVendedorDto.email;
        if (updateVendedorDto.telefono !== undefined) vendedor.telefono = updateVendedorDto.telefono;

        await this.usuarioRepository.save(vendedor);

        // Actualizar porcentaje de comisión si se proporciona
        if (updateVendedorDto.porcentajeComision !== undefined) {
            relacion.porcentajeComision = updateVendedorDto.porcentajeComision;
            await this.brokerVendedorRepository.save(relacion);
        }

        return this.findOne(idVendedor, idBroker);
    }

    /**
     * Desactivar un vendedor (soft delete en la relación)
     */
    async remove(idVendedor: string, idBroker: string): Promise<void> {
        const relacion = await this.brokerVendedorRepository.findOne({
            where: { idVendedor, idBroker },
        });

        if (!relacion) {
            throw new NotFoundException('Vendedor no encontrado o no pertenece a este broker');
        }

        // Desactivar la relación
        relacion.estaActivo = false;
        await this.brokerVendedorRepository.save(relacion);

        // También desactivar el usuario vendedor
        const vendedor = await this.usuarioRepository.findOne({
            where: { idUsuario: idVendedor },
        });

        if (vendedor) {
            vendedor.estaActivo = false;
            await this.usuarioRepository.save(vendedor);
        }
    }

    /**
     * Reactivar un vendedor
     */
    async activate(idVendedor: string, idBroker: string): Promise<any> {
        const relacion = await this.brokerVendedorRepository.findOne({
            where: { idVendedor, idBroker },
            relations: ['vendedor'],
        });

        if (!relacion) {
            throw new NotFoundException('Vendedor no encontrado o no pertenece a este broker');
        }

        // Activar la relación
        relacion.estaActivo = true;
        await this.brokerVendedorRepository.save(relacion);

        // Activar el usuario vendedor
        const vendedor = relacion.vendedor;
        vendedor.estaActivo = true;
        await this.usuarioRepository.save(vendedor);

        return this.findOne(idVendedor, idBroker);
    }
}
