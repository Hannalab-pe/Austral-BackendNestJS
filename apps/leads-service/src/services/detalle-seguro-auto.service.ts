import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleSeguroAuto } from '../entities/detalle-seguro-auto.entity';
import { Lead } from '../entities/lead.entity';
import { CreateDetalleSeguroAutoDto } from '../dto/detalle-seguro-auto.dto';
import { UpdateDetalleSeguroAutoDto } from '../dto/detalle-seguro-auto.dto';
import { DetalleSeguroAutoResponseDto } from '../dto/detalle-seguro-auto.dto';

@Injectable()
export class DetalleSeguroAutoService {
  constructor(
    @InjectRepository(DetalleSeguroAuto)
    private readonly detalleRepository: Repository<DetalleSeguroAuto>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(createDto: CreateDetalleSeguroAutoDto): Promise<DetalleSeguroAutoResponseDto> {
    // Verificar que el lead existe
    const lead = await this.leadRepository.findOne({
      where: { id_lead: createDto.lead_id },
    });

    if (!lead) {
      throw new NotFoundException(`Lead con ID ${createDto.lead_id} no encontrado`);
    }

    // Verificar que no exista ya un detalle para este lead
    const existingDetalle = await this.detalleRepository.findOne({
      where: { lead_id: createDto.lead_id },
    });

    if (existingDetalle) {
      throw new ConflictException('Ya existe un detalle de seguro auto para este lead');
    }

    const detalle = this.detalleRepository.create(createDto);
    const savedDetalle = await this.detalleRepository.save(detalle);

    return this.mapToResponseDto(savedDetalle);
  }

  async findAll(): Promise<DetalleSeguroAutoResponseDto[]> {
    const detalles = await this.detalleRepository.find({
      relations: ['lead'],
      order: { fecha_creacion: 'DESC' },
    });

    return detalles.map(detalle => this.mapToResponseDto(detalle));
  }

  async findOne(id: string): Promise<DetalleSeguroAutoResponseDto> {
    const detalle = await this.detalleRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de seguro auto con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(detalle);
  }

  async findByLeadId(leadId: string): Promise<DetalleSeguroAutoResponseDto | null> {
    const detalle = await this.detalleRepository.findOne({
      where: { lead_id: leadId },
      relations: ['lead'],
    });

    if (!detalle) {
      return null;
    }

    return this.mapToResponseDto(detalle);
  }

  async update(id: string, updateDto: UpdateDetalleSeguroAutoDto): Promise<DetalleSeguroAutoResponseDto> {
    const detalle = await this.detalleRepository.findOne({
      where: { id },
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de seguro auto con ID ${id} no encontrado`);
    }

    await this.detalleRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const detalle = await this.detalleRepository.findOne({
      where: { id },
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de seguro auto con ID ${id} no encontrado`);
    }

    await this.detalleRepository.delete(id);
  }

  async removeByLeadId(leadId: string): Promise<void> {
    await this.detalleRepository.delete({ lead_id: leadId });
  }

  private mapToResponseDto(detalle: DetalleSeguroAuto): DetalleSeguroAutoResponseDto {
    const response = new DetalleSeguroAutoResponseDto();
    response.id = detalle.id;
    response.lead_id = detalle.lead_id;
    response.marca_auto = detalle.marca_auto;
    response.ano_auto = detalle.ano_auto;
    response.modelo_auto = detalle.modelo_auto;
    response.placa_auto = detalle.placa_auto;
    response.tipo_uso = detalle.tipo_uso;
    response.fecha_creacion = detalle.fecha_creacion;
    response.fecha_actualizacion = detalle.fecha_actualizacion;

    if (detalle.lead) {
      response.lead = {
        id_lead: detalle.lead.id_lead,
        nombre: detalle.lead.nombre,
        apellido: detalle.lead.apellido,
        telefono: detalle.lead.telefono,
      };
    }

    return response;
  }
}