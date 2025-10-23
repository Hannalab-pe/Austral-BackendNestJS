import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../entities/actividad.entity';
import { CreateActividadDto, UpdateActividadDto } from '../dto';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    private readonly auditoriaService: AuditoriaService,
  ) { }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.actividadRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { idActividad: id },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return actividad;
  }

  async create(createActividadDto: CreateActividadDto, userId: string): Promise<Actividad> {
    try {
      const actividad = this.actividadRepository.create(createActividadDto);
      const savedActividad = await this.actividadRepository.save(actividad);

      // Registrar en auditoría
      await this.auditoriaService.createAuditoriaRecord({
        tabla: 'actividad',
        idRegistro: savedActividad.idActividad,
        accion: 'INSERT',
        idUsuario: userId,
      });

      return savedActividad;
    } catch (error) {
      throw new BadRequestException('Error al crear la actividad');
    }
  }

  async update(
    id: string,
    updateActividadDto: UpdateActividadDto,
    userId: string,
  ): Promise<Actividad> {
    const actividad = await this.findOne(id);

    Object.assign(actividad, updateActividadDto);
    const savedActividad = await this.actividadRepository.save(actividad);

    // Registrar en auditoría
    await this.auditoriaService.createAuditoriaRecord({
      tabla: 'actividad',
      idRegistro: id,
      accion: 'UPDATE',
      idUsuario: userId,
    });

    return savedActividad;
  }

  async remove(id: string): Promise<void> {
    const actividad = await this.findOne(id);
    await this.actividadRepository.remove(actividad);
  }

  async findByUsuario(usuarioId: string): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { realizadaPorUsuario: usuarioId },
      order: { fechaActividad: 'ASC' },
    });
  }

  async findByCliente(clienteId: string): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { idCliente: clienteId },
      order: { fechaActividad: 'ASC' },
    });
  }

  async findByLead(leadId: string): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { idLead: leadId },
      order: { fechaActividad: 'ASC' },
    });
  }

  async findUpcomingActivities(): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: {
        fechaActividad: {
          $gte: new Date()
        } as any
      },
      order: { fechaActividad: 'ASC' },
    });
  }

  async findByTipo(tipo: string): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { tipoActividad: tipo },
      order: { fechaActividad: 'ASC' },
    });
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Actividad[]> {
    return await this.actividadRepository
      .createQueryBuilder('actividad')
      .where('actividad.fechaActividad BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .orderBy('actividad.fechaActividad', 'ASC')
      .getMany();
  }
}
