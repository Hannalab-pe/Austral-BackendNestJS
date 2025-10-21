import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleSeguroScrt } from '../entities/detalle-seguro-scrt.entity';
import { Lead } from '../entities/lead.entity';
import { CreateDetalleSeguroScrtDto } from '../dto/detalle-seguro-scrt.dto';

@Injectable()
export class DetalleSeguroScrtService {
  constructor(
    @InjectRepository(DetalleSeguroScrt)
    private detalleSeguroScrtRepository: Repository<DetalleSeguroScrt>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(createDto: CreateDetalleSeguroScrtDto): Promise<DetalleSeguroScrt> {
    // Verificar que el lead existe y está activo
    const lead = await this.leadRepository.findOne({
      where: { id_lead: createDto.lead_id, esta_activo: true },
    });

    if (!lead) {
      throw new BadRequestException('Lead no válido o inactivo');
    }

    // Verificar que no existe ya un detalle para este lead
    const existingDetalle = await this.detalleSeguroScrtRepository.findOne({
      where: { lead_id: createDto.lead_id },
    });

    if (existingDetalle) {
      throw new BadRequestException('Ya existe un detalle de seguro SCTR para este lead');
    }

    // Crear el detalle
    const detalle = this.detalleSeguroScrtRepository.create(createDto);
    return await this.detalleSeguroScrtRepository.save(detalle);
  }

  async findAll(): Promise<DetalleSeguroScrt[]> {
    return await this.detalleSeguroScrtRepository.find({
      relations: ['lead'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findByLeadId(leadId: string): Promise<DetalleSeguroScrt | null> {
    return await this.detalleSeguroScrtRepository.findOne({
      where: { lead_id: leadId },
      relations: ['lead'],
    });
  }
}