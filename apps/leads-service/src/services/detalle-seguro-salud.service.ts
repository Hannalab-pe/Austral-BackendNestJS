import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleSeguroSalud } from '../entities/detalle-seguro-salud.entity';
import { Lead } from '../entities/lead.entity';
import { CreateDetalleSeguroSaludDto } from '../dto/detalle-seguro-salud.dto';

@Injectable()
export class DetalleSeguroSaludService {
  constructor(
    @InjectRepository(DetalleSeguroSalud)
    private detalleSeguroSaludRepository: Repository<DetalleSeguroSalud>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(
    createDto: CreateDetalleSeguroSaludDto,
  ): Promise<DetalleSeguroSalud> {
    // Verificar que el lead existe y está activo
    const lead = await this.leadRepository.findOne({
      where: { idLead: createDto.lead_id, esta_activo: true },
    });

    if (!lead) {
      throw new BadRequestException('Lead no válido o inactivo');
    }

    // Verificar que no existe ya un detalle para este lead
    const existingDetalle = await this.detalleSeguroSaludRepository.findOne({
      where: { lead_id: createDto.lead_id },
    });

    if (existingDetalle) {
      throw new BadRequestException(
        'Ya existe un detalle de seguro salud para este lead',
      );
    }

    // Crear el detalle
    const detalle = this.detalleSeguroSaludRepository.create(createDto);
    return await this.detalleSeguroSaludRepository.save(detalle);
  }

  async findAll(): Promise<DetalleSeguroSalud[]> {
    return await this.detalleSeguroSaludRepository.find({
      relations: ['lead'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findByLeadId(leadId: string): Promise<DetalleSeguroSalud | null> {
    return await this.detalleSeguroSaludRepository.findOne({
      where: { lead_id: leadId },
      relations: ['lead'],
    });
  }
}
