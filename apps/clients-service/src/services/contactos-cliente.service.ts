import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteContacto } from '../entities/cliente-contacto.entity';
import { CreateContactoClienteDto, UpdateContactoClienteDto } from '../dto';

@Injectable()
export class ContactosClienteService {
  constructor(
    @InjectRepository(ClienteContacto)
    private readonly contactoRepository: Repository<ClienteContacto>,
  ) { }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.contactoRepository.findAndCount({
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

  async findOne(id: string): Promise<ClienteContacto> {
    const contacto = await this.contactoRepository.findOne({
      where: { idContacto: id },
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return contacto;
  }

  async create(
    createContactoDto: CreateContactoClienteDto,
  ): Promise<ClienteContacto> {
    try {
      const contacto = this.contactoRepository.create({
        ...createContactoDto,
      });
      return await this.contactoRepository.save(contacto);
    } catch (error) {
      throw new BadRequestException('Error al crear el contacto');
    }
  }

  async update(
    id: string,
    updateContactoDto: UpdateContactoClienteDto,
  ): Promise<ClienteContacto> {
    const contacto = await this.findOne(id);

    Object.assign(contacto, updateContactoDto);
    return await this.contactoRepository.save(contacto);
  }

  async remove(id: string): Promise<void> {
    const contacto = await this.findOne(id);
    await this.contactoRepository.remove(contacto);
  }

  async findByCliente(clienteId: string): Promise<ClienteContacto[]> {
    return await this.contactoRepository.find({
      where: { idCliente: clienteId },
      order: { fechaCreacion: 'ASC' },
    });
  }
}
