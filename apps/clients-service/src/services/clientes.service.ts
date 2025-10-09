import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from '../dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.clienteRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const cliente = this.clienteRepository.create({
        ...createClienteDto,
        activo: true,
      });
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      throw new BadRequestException('Error al crear el cliente');
    }
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);

    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
  }

  async findByTipoDocumento(
    tipoDocumento: string,
    numeroDocumento: string,
  ): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { tipoDocumento, numeroDocumento },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con documento ${tipoDocumento}: ${numeroDocumento} no encontrado`,
      );
    }

    return cliente;
  }

  async findByEmail(email: string): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      where: { email },
    });
  }

  async findActiveClients(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      where: { activo: true },
      order: { fechaCreacion: 'DESC' },
    });
  }
}
