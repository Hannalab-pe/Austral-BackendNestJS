import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleSeguroSctr } from '../entities/detalle-seguro-sctr.entity';
import { Lead } from '../entities/lead.entity';
import { CreateDetalleSeguroSctrDto } from '../dto/detalle-seguro-sctr.dto';

@Injectable()
export class DetalleSeguroSctrService {
  constructor(
    @InjectRepository(DetalleSeguroSctr)
    private detalleSeguroSctrRepository: Repository<DetalleSeguroSctr>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(
    createDto: CreateDetalleSeguroSctrDto,
  ): Promise<DetalleSeguroSctr> {
    // Verificar que el lead existe y está activo
    const lead = await this.leadRepository.findOne({
      where: { id_lead: createDto.lead_id, esta_activo: true },
    });

    if (!lead) {
      throw new BadRequestException('Lead no válido o inactivo');
    }

    // Verificar que no existe ya un detalle para este lead
    const existingDetalle = await this.detalleSeguroSctrRepository.findOne({
      where: { lead_id: createDto.lead_id },
    });

    if (existingDetalle) {
      throw new BadRequestException(
        'Ya existe un detalle de seguro SCTR para este lead',
      );
    }

    // Crear el detalle
    const detalle = this.detalleSeguroSctrRepository.create(createDto);
    return await this.detalleSeguroSctrRepository.save(detalle);
  }

  async findAll(): Promise<DetalleSeguroSctr[]> {
    return await this.detalleSeguroSctrRepository.find({
      relations: ['lead'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findByLeadId(leadId: string): Promise<DetalleSeguroSctr | null> {
    return await this.detalleSeguroSctrRepository.findOne({
      where: { lead_id: leadId },
      relations: ['lead'],
    });
  }
}
