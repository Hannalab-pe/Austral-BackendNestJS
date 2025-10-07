import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { Lead, EstadoLead, FuenteLead } from '../entities';
import { CreateLeadDto, UpdateLeadDto } from '../dto';
import { PrioridadLead } from 'y/common';

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
    // Verificar que el estado y la fuente existen
    const estado = await this.estadoLeadRepository.findOne({
      where: { id: createLeadDto.idEstado, estaActivo: true },
    });

    if (!estado) {
      throw new BadRequestException('Estado de lead no válido');
    }

    const fuente = await this.fuenteLeadRepository.findOne({
      where: { id: createLeadDto.idFuente, estaActivo: true },
    });

    if (!fuente) {
      throw new BadRequestException('Fuente de lead no válida');
    }

    const lead = this.leadRepository.create({
      ...createLeadDto,
      fechaNacimiento: createLeadDto.fechaNacimiento
        ? new Date(createLeadDto.fechaNacimiento)
        : undefined,
      proximaFechaSeguimiento: createLeadDto.proximaFechaSeguimiento
        ? new Date(createLeadDto.proximaFechaSeguimiento)
        : undefined,
    });

    return await this.leadRepository.save(lead);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: any,
  ): Promise<{ leads: Lead[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Lead> = { estaActivo: true };

    if (filters?.estado) {
      where.idEstado = filters.estado;
    }

    if (filters?.asignado) {
      where.asignadoAUsuario = filters.asignado;
    }

    if (filters?.prioridad) {
      where.prioridad = filters.prioridad;
    }

    if (filters?.fuente) {
      where.idFuente = filters.fuente;
    }

    const [leads, total] = await this.leadRepository.findAndCount({
      where,
      relations: ['estado', 'fuente'],
      skip,
      take: limit,
      order: { fechaCreacion: 'DESC' },
    });

    return {
      leads,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id, estaActivo: true },
      relations: ['estado', 'fuente'],
    });

    if (!lead) {
      throw new NotFoundException('Lead no encontrado');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    // Verificar estado si se está actualizando
    if (updateLeadDto.idEstado) {
      const estado = await this.estadoLeadRepository.findOne({
        where: { id: updateLeadDto.idEstado, estaActivo: true },
      });

      if (!estado) {
        throw new BadRequestException('Estado de lead no válido');
      }
    }

    Object.assign(lead, {
      ...updateLeadDto,
      fechaNacimiento: updateLeadDto.fechaNacimiento
        ? new Date(updateLeadDto.fechaNacimiento)
        : lead.fechaNacimiento,
      proximaFechaSeguimiento: updateLeadDto.proximaFechaSeguimiento
        ? new Date(updateLeadDto.proximaFechaSeguimiento)
        : lead.proximaFechaSeguimiento,
    });

    return await this.leadRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    lead.estaActivo = false;
    await this.leadRepository.save(lead);
  }

  async assign(leadId: string, usuarioId: string): Promise<Lead> {
    const lead = await this.findOne(leadId);
    lead.asignadoAUsuario = usuarioId;
    return await this.leadRepository.save(lead);
  }

  async updateStatus(leadId: string, estadoId: string): Promise<Lead> {
    const lead = await this.findOne(leadId);

    const estado = await this.estadoLeadRepository.findOne({
      where: { id: estadoId, estaActivo: true },
    });

    if (!estado) {
      throw new BadRequestException('Estado no válido');
    }

    lead.idEstado = estadoId;
    lead.fechaUltimoContacto = new Date();

    return await this.leadRepository.save(lead);
  }

  async findByUser(usuarioId: string): Promise<Lead[]> {
    return await this.leadRepository.find({
      where: { asignadoAUsuario: usuarioId, estaActivo: true },
      relations: ['estado', 'fuente'],
      order: { proximaFechaSeguimiento: 'ASC' },
    });
  }

  async getFollowupToday(): Promise<Lead[]> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    return await this.leadRepository.find({
      where: {
        proximaFechaSeguimiento: Between(startOfDay, endOfDay),
        estaActivo: true,
      },
      relations: ['estado', 'fuente'],
    });
  }

  async getStats(): Promise<any> {
    const totalLeads = await this.leadRepository.count({
      where: { estaActivo: true },
    });

    const leadsPorEstado = await this.leadRepository
      .createQueryBuilder('lead')
      .select('estado.nombre', 'estado')
      .addSelect('COUNT(lead.id)', 'count')
      .innerJoin('lead.estado', 'estado')
      .where('lead.estaActivo = :activo', { activo: true })
      .groupBy('estado.id, estado.nombre')
      .getRawMany();

    const leadsPorPrioridad = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.prioridad', 'prioridad')
      .addSelect('COUNT(lead.id)', 'count')
      .where('lead.estaActivo = :activo', { activo: true })
      .groupBy('lead.prioridad')
      .getRawMany();

    const leadsPorFuente = await this.leadRepository
      .createQueryBuilder('lead')
      .select('fuente.nombre', 'fuente')
      .addSelect('COUNT(lead.id)', 'count')
      .innerJoin('lead.fuente', 'fuente')
      .where('lead.estaActivo = :activo', { activo: true })
      .groupBy('fuente.id, fuente.nombre')
      .getRawMany();

    return {
      totalLeads,
      leadsPorEstado,
      leadsPorPrioridad,
      leadsPorFuente,
    };
  }
}
