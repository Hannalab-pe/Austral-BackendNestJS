import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoLead } from '../entities';
import { CreateEstadoLeadDto } from '../dto';

@Injectable()
export class EstadosLeadService {
  constructor(
    @InjectRepository(EstadoLead)
    private estadoLeadRepository: Repository<EstadoLead>,
  ) {}

  async create(createEstadoDto: CreateEstadoLeadDto): Promise<EstadoLead> {
    const estado = this.estadoLeadRepository.create(createEstadoDto);
    return await this.estadoLeadRepository.save(estado);
  }

  async findAll(): Promise<EstadoLead[]> {
    return await this.estadoLeadRepository.find({
      where: { estaActivo: true },
      order: { ordenProceso: 'ASC' },
    });
  }

  async findOne(id: string): Promise<EstadoLead> {
    const estado = await this.estadoLeadRepository.findOne({
      where: { id, estaActivo: true },
    });

    if (!estado) {
      throw new NotFoundException('Estado no encontrado');
    }

    return estado;
  }

  async update(
    id: string,
    updateData: Partial<CreateEstadoLeadDto>,
  ): Promise<EstadoLead> {
    const estado = await this.findOne(id);
    Object.assign(estado, updateData);
    return await this.estadoLeadRepository.save(estado);
  }

  async remove(id: string): Promise<void> {
    const estado = await this.findOne(id);
    estado.estaActivo = false;
    await this.estadoLeadRepository.save(estado);
  }
}
