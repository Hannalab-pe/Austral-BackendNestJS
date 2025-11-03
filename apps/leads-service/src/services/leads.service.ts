import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, EstadoLead, FuenteLead } from '../entities';
import { CreateLeadDto } from '../dto/leads.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(EstadoLead)
    private estadoLeadRepository: Repository<EstadoLead>,
    @InjectRepository(FuenteLead)
    private fuenteLeadRepository: Repository<FuenteLead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Verificar que el estado existe y está activo
    const estado = await this.estadoLeadRepository.findOne({
      where: { id_estado: createLeadDto.id_estado, esta_activo: true },
    });

    if (!estado) {
      throw new BadRequestException('Estado de lead no válido o inactivo');
    }

    // Verificar que la fuente existe y está activa
    const fuente = await this.fuenteLeadRepository.findOne({
      where: { id_fuente: createLeadDto.id_fuente, esta_activo: true },
    });

    if (!fuente) {
      throw new BadRequestException('Fuente de lead no válida o inactiva');
    }

    // Crear el lead con los datos del DTO
    const lead = this.leadRepository.create({
      ...createLeadDto,
      fecha_nacimiento: createLeadDto.fecha_nacimiento
        ? new Date(createLeadDto.fecha_nacimiento)
        : undefined,
      proxima_fecha_seguimiento: createLeadDto.proxima_fecha_seguimiento
        ? new Date(createLeadDto.proxima_fecha_seguimiento)
        : undefined,
    });

    return await this.leadRepository.save(lead);
  }

  async findAll(): Promise<Lead[]> {
    return await this.leadRepository.find({
      relations: ['estado', 'fuente'],
      where: { esta_activo: true },
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { idLead: id, esta_activo: true },
      relations: ['estado', 'fuente'],
    });

    if (!lead) {
      throw new BadRequestException('Lead no encontrado');
    }

    return lead;
  }

  async update(id: string, updateData: Partial<Lead>): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { idLead: id, esta_activo: true },
    });

    if (!lead) {
      throw new BadRequestException('Lead no encontrado');
    }

    // Si se está actualizando el estado, verificar que existe
    if (updateData.id_estado) {
      const estado = await this.estadoLeadRepository.findOne({
        where: { id_estado: updateData.id_estado, esta_activo: true },
      });

      if (!estado) {
        throw new BadRequestException('Estado de lead no válido o inactivo');
      }
    }

    // Si se está actualizando la fuente, verificar que existe
    if (updateData.id_fuente) {
      const fuente = await this.fuenteLeadRepository.findOne({
        where: { id_fuente: updateData.id_fuente, esta_activo: true },
      });

      if (!fuente) {
        throw new BadRequestException('Fuente de lead no válida o inactiva');
      }
    }

    // Actualizar los campos
    Object.assign(lead, updateData);

    return await this.leadRepository.save(lead);
  }

  async updateStatus(id: string, idEstado: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { idLead: id, esta_activo: true },
    });

    if (!lead) {
      throw new BadRequestException('Lead no encontrado');
    }

    // Verificar que el estado existe
    const estado = await this.estadoLeadRepository.findOne({
      where: { id_estado: idEstado, esta_activo: true },
    });

    if (!estado) {
      throw new BadRequestException('Estado de lead no válido o inactivo');
    }

    lead.id_estado = idEstado;
    return await this.leadRepository.save(lead);
  }
}
