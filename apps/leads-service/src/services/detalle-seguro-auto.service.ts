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
      where: { idLead: createDto.id_lead },
    });

    if (!lead) {
      throw new NotFoundException(`Lead con ID ${createDto.id_lead} no encontrado`);
    }

    // Verificar que no exista ya un detalle para este lead
    const existingDetalle = await this.detalleRepository.findOne({
      where: { id_lead: createDto.id_lead },
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
      where: { id_detalle_auto: id },
      relations: ['lead'],
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de seguro auto con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(detalle);
  }

  async findByLeadId(leadId: string): Promise<DetalleSeguroAutoResponseDto | null> {
    const detalle = await this.detalleRepository.findOne({
      where: { id_lead: leadId },
      relations: ['lead'],
    });

    if (!detalle) {
      return null;
    }

    return this.mapToResponseDto(detalle);
  }

  async update(id: string, updateDto: UpdateDetalleSeguroAutoDto): Promise<DetalleSeguroAutoResponseDto> {
    const detalle = await this.detalleRepository.findOne({
      where: { id_detalle_auto: id },
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de seguro auto con ID ${id} no encontrado`);
    }

    await this.detalleRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const detalle = await this.detalleRepository.findOne({
      where: { id_detalle_auto: id },
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle de seguro auto con ID ${id} no encontrado`);
    }

    await this.detalleRepository.delete(id);
  }

  async removeByLeadId(leadId: string): Promise<void> {
    await this.detalleRepository.delete({ id_lead: leadId });
  }

  private mapToResponseDto(detalle: DetalleSeguroAuto): DetalleSeguroAutoResponseDto {
    const response = new DetalleSeguroAutoResponseDto();
    response.id_detalle_auto = detalle.id_detalle_auto;
    response.id_lead = detalle.id_lead;
    response.marca = detalle.marca;
    response.modelo = detalle.modelo;
    response.anio = detalle.anio;
    response.placa = detalle.placa;
    response.valor_vehiculo = detalle.valor_vehiculo;
    response.tipo_cobertura = detalle.tipo_cobertura;
    response.zona_riesgo = detalle.zona_riesgo;
    response.antiguedad_licencia = detalle.antiguedad_licencia;
    response.tiene_gps = detalle.tiene_gps;
    response.tiene_alarma = detalle.tiene_alarma;
    response.numero_siniestros_previos = detalle.numero_siniestros_previos;
    response.esta_financiado = detalle.esta_financiado;
    response.uso_vehiculo = detalle.uso_vehiculo;
    response.esta_activo = detalle.esta_activo;
    response.fecha_creacion = detalle.fecha_creacion;

    if (detalle.lead) {
      response.lead = {
        id_lead: detalle.lead.idLead,
        nombre: detalle.lead.nombre,
        apellido: detalle.lead.apellido,
        telefono: detalle.lead.telefono,
      };
    }

    return response;
  }
}