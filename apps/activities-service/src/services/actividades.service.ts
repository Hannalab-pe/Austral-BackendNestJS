import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../entities/actividad.entity';
import { CreateActividadDto, UpdateActividadDto } from '../dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.actividadRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return actividad;
  }

  async create(createActividadDto: CreateActividadDto): Promise<Actividad> {
    try {
      const actividad = this.actividadRepository.create(createActividadDto);
      return await this.actividadRepository.save(actividad);
    } catch (error) {
      throw new BadRequestException('Error al crear la actividad');
    }
  }

  async update(
    id: number,
    updateActividadDto: UpdateActividadDto,
  ): Promise<Actividad> {
    const actividad = await this.findOne(id);

    Object.assign(actividad, updateActividadDto);
    return await this.actividadRepository.save(actividad);
  }

  async remove(id: number): Promise<void> {
    const actividad = await this.findOne(id);
    await this.actividadRepository.remove(actividad);
  }

  async findByUsuario(usuarioId: number): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { usuarioId },
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findByCliente(clienteId: number): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { clienteId },
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findByLead(leadId: number): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { leadId },
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findPendingActivities(): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { completada: false },
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findOverdueActivities(): Promise<Actividad[]> {
    return await this.actividadRepository
      .createQueryBuilder('actividad')
      .where('actividad.fechaVencimiento < :today', { today: new Date() })
      .andWhere('actividad.completada = :completada', { completada: false })
      .orderBy('actividad.fechaVencimiento', 'ASC')
      .getMany();
  }
}
