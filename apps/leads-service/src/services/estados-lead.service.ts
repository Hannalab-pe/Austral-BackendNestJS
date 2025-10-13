import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoLead } from '../entities';
import { CreateEstadoLeadDto, UpdateEstadoLeadDto } from '../dto/leads.dto';

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
      where: { esta_activo: true },
      order: { orden_proceso: 'ASC' },
    });
  }

  async findOne(id: string): Promise<EstadoLead> {
    const estado = await this.estadoLeadRepository.findOne({
      where: { id_estado: id, esta_activo: true },
    });

    if (!estado) {
      throw new NotFoundException('Estado no encontrado');
    }

    return estado;
  }

  async update(
    id: string,
    updateData: UpdateEstadoLeadDto,
  ): Promise<EstadoLead> {
    const estado = await this.findOne(id);
    Object.assign(estado, updateData);
    return await this.estadoLeadRepository.save(estado);
  }

  async remove(id: string): Promise<void> {
    const estado = await this.findOne(id);
    estado.esta_activo = false;
    await this.estadoLeadRepository.save(estado);
  }
}
