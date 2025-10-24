import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from '../dto';

export interface ClienteFiltros {
  estaActivo?: boolean;
  brokerAsignado?: string;
  registradoPor?: string;
  search?: string; // Búsqueda por nombre, apellido, email o documento
}

export interface ClientePaginado {
  data: Cliente[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) { }

  /**
   * Obtener todos los clientes con filtros opcionales
   */
  async findAll(filtros?: ClienteFiltros): Promise<Cliente[]> {
    const where: any = {};

    if (filtros?.estaActivo !== undefined) {
      where.estaActivo = filtros.estaActivo;
    }

    if (filtros?.brokerAsignado) {
      where.brokerAsignado = filtros.brokerAsignado;
    }

    if (filtros?.registradoPor) {
      where.registradoPor = filtros.registradoPor;
    }

    const clientes = await this.clienteRepository.find({
      where,
      order: { fechaRegistro: 'DESC' },
    });

    // Filtro de búsqueda en memoria
    if (filtros?.search) {
      const searchLower = filtros.search.toLowerCase();
      return clientes.filter(
        (c) =>
          c.nombre.toLowerCase().includes(searchLower) ||
          c.apellido.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.documentoIdentidad.toLowerCase().includes(searchLower),
      );
    }

    return clientes;
  }

  /**
   * Obtener clientes paginados
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filtros?: ClienteFiltros,
  ): Promise<ClientePaginado> {
    const where: any = {};

    if (filtros?.estaActivo !== undefined) {
      where.estaActivo = filtros.estaActivo;
    }

    if (filtros?.brokerAsignado) {
      where.brokerAsignado = filtros.brokerAsignado;
    }

    if (filtros?.registradoPor) {
      where.registradoPor = filtros.registradoPor;
    }

    const [clientes, total] = await this.clienteRepository.findAndCount({
      where,
      order: { fechaRegistro: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: clientes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Filtrar clientes según jerarquía del usuario
   * - Administrador: Ve todos los clientes
   * - Broker: Ve solo los clientes que él registró o que tienen su ID como broker_asignado
   * - Vendedor: Ve solo los clientes que él registró
   */
  async findClientesByHierarchy(
    userId: string,
    userRole: string,
    userSupervisorId: string | null,
    filtros?: ClienteFiltros,
  ): Promise<Cliente[]> {
    // Administrador puede ver todos los clientes
    if (userRole === 'Administrador') {
      return this.findAll(filtros);
    }

    // Broker puede ver clientes que él registró o que le están asignados
    if (userRole === 'Broker') {
      const where: any = {
        estaActivo: filtros?.estaActivo !== undefined ? filtros.estaActivo : true,
      };

      // Buscar clientes registrados por el broker o asignados a él
      const clientes = await this.clienteRepository
        .createQueryBuilder('cliente')
        .where('cliente.registrado_por = :userId OR cliente.broker_asignado = :userId', { userId })
        .andWhere('cliente.esta_activo = :estaActivo', { estaActivo: where.estaActivo })
        .orderBy('cliente.fecha_registro', 'DESC')
        .getMany();

      // Aplicar filtro de búsqueda si existe
      if (filtros?.search) {
        const searchLower = filtros.search.toLowerCase();
        return clientes.filter(
          (c) =>
            c.nombre.toLowerCase().includes(searchLower) ||
            c.apellido.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.documentoIdentidad.toLowerCase().includes(searchLower),
        );
      }

      return clientes;
    }

    // Vendedor solo puede ver clientes que él registró
    const clientesVendedor = await this.findAll({
      ...filtros,
      registradoPor: userId,
    });

    return clientesVendedor;
  }

  /**
   * Obtener un cliente por ID
   */
  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  /**
   * Crear un nuevo cliente con asignación automática de campos
   */
  async create(
    createClienteDto: CreateClienteDto,
    userId: string,
    userRole: string,
    userSupervisorId: string | null,
  ): Promise<Cliente> {
    try {
      // Verificar si el email ya está en uso
      const existingEmail = await this.clienteRepository.findOne({
        where: { email: createClienteDto.email },
      });
      if (existingEmail) {
        throw new BadRequestException('El email ya está en uso');
      }

      // Verificar si el documento ya está en uso
      const existingDoc = await this.clienteRepository.findOne({
        where: { documentoIdentidad: createClienteDto.documentoIdentidad },
      });
      if (existingDoc) {
        throw new BadRequestException('El documento de identidad ya está registrado');
      }

      // Asignar campos automáticamente según el rol
      const clienteData: any = {
        ...createClienteDto,
        registradoPor: userId,
        estaActivo: true,
      };

      // Si es un Broker, se asigna a sí mismo como broker_asignado
      if (userRole === 'Broker') {
        clienteData.brokerAsignado = userId;
      }

      // Si es un Vendedor, asigna su supervisor (Broker) como broker_asignado
      if (userRole === 'Vendedor' && userSupervisorId) {
        clienteData.brokerAsignado = userSupervisorId;
      }

      const cliente = this.clienteRepository.create(clienteData);
      const savedCliente = await this.clienteRepository.save(cliente);

      // Asegurarse de que retornamos un solo cliente, no un array
      return Array.isArray(savedCliente) ? savedCliente[0] : savedCliente;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el cliente');
    }
  }

  /**
   * Actualizar un cliente
   */
  async update(
    id: string,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Verificar si el email ya está en uso por otro cliente
    if (updateClienteDto.email && updateClienteDto.email !== cliente.email) {
      const existingEmail = await this.clienteRepository.findOne({
        where: { email: updateClienteDto.email },
      });

      if (existingEmail && existingEmail.idCliente !== id) {
        throw new BadRequestException('El email ya está en uso');
      }
    }

    // Verificar si el documento ya está en uso por otro cliente
    if (updateClienteDto.documentoIdentidad && updateClienteDto.documentoIdentidad !== cliente.documentoIdentidad) {
      const existingDoc = await this.clienteRepository.findOne({
        where: { documentoIdentidad: updateClienteDto.documentoIdentidad },
      });

      if (existingDoc && existingDoc.idCliente !== id) {
        throw new BadRequestException('El documento de identidad ya está registrado');
      }
    }

    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Desactivar cliente (soft delete)
   */
  async deactivate(id: string): Promise<void> {
    const cliente = await this.findOne(id);
    cliente.estaActivo = false;
    await this.clienteRepository.save(cliente);
  }

  /**
   * Activar cliente
   */
  async activate(id: string): Promise<Cliente> {
    const cliente = await this.findOne(id);
    cliente.estaActivo = true;
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Buscar cliente por documento
   */
  async findByDocumento(
    tipoDocumento: string,
    documentoIdentidad: string,
  ): Promise<Cliente | null> {
    return await this.clienteRepository.findOne({
      where: { tipoDocumento, documentoIdentidad },
    });
  }

  /**
   * Buscar clientes por broker asignado
   */
  async findByBroker(brokerId: string): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      where: { brokerAsignado: brokerId, estaActivo: true },
      order: { fechaRegistro: 'DESC' },
    });
  }

  /**
   * Obtener estadísticas de clientes
   */
  async getStats(): Promise<{
    total: number;
    activos: number;
    inactivos: number;
  }> {
    const [total, activos] = await Promise.all([
      this.clienteRepository.count(),
      this.clienteRepository.count({ where: { estaActivo: true } }),
    ]);

    return {
      total,
      activos,
      inactivos: total - activos,
    };
  }
}
