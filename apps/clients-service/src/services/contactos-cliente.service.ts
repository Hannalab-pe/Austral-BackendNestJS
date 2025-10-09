import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactoCliente } from '../entities/contacto-cliente.entity';
import { CreateContactoClienteDto, UpdateContactoClienteDto } from '../dto';

@Injectable()
export class ContactosClienteService {
  constructor(
    @InjectRepository(ContactoCliente)
    private readonly contactoRepository: Repository<ContactoCliente>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.contactoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<ContactoCliente> {
    const contacto = await this.contactoRepository.findOne({
      where: { id },
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return contacto;
  }

  async create(
    createContactoDto: CreateContactoClienteDto,
  ): Promise<ContactoCliente> {
    try {
      const contacto = this.contactoRepository.create({
        ...createContactoDto,
        activo: true,
      });
      return await this.contactoRepository.save(contacto);
    } catch (error) {
      throw new BadRequestException('Error al crear el contacto');
    }
  }

  async update(
    id: number,
    updateContactoDto: UpdateContactoClienteDto,
  ): Promise<ContactoCliente> {
    const contacto = await this.findOne(id);

    Object.assign(contacto, updateContactoDto);
    return await this.contactoRepository.save(contacto);
  }

  async remove(id: number): Promise<void> {
    const contacto = await this.findOne(id);
    await this.contactoRepository.remove(contacto);
  }

  async findByCliente(clienteId: number): Promise<ContactoCliente[]> {
    return await this.contactoRepository.find({
      where: { clienteId },
      order: { id: 'ASC' },
    });
  }

  async findByTipo(tipo: string): Promise<ContactoCliente[]> {
    return await this.contactoRepository.find({
      where: { tipo },
      order: { id: 'DESC' },
    });
  }
}
