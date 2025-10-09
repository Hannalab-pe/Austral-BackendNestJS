import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from '../entities/notificacion.entity';
import { CreateNotificacionDto, UpdateNotificacionDto } from '../dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.notificacionRepository.findAndCount({
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

  async findOne(id: number): Promise<Notificacion> {
    const notificacion = await this.notificacionRepository.findOne({
      where: { id },
    });

    if (!notificacion) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    return notificacion;
  }

  async create(
    createNotificacionDto: CreateNotificacionDto,
  ): Promise<Notificacion> {
    try {
      const notificacion = this.notificacionRepository.create(
        createNotificacionDto,
      );
      return await this.notificacionRepository.save(notificacion);
    } catch (error) {
      throw new BadRequestException('Error al crear la notificación');
    }
  }

  async update(
    id: number,
    updateNotificacionDto: UpdateNotificacionDto,
  ): Promise<Notificacion> {
    const notificacion = await this.findOne(id);

    Object.assign(notificacion, updateNotificacionDto);
    return await this.notificacionRepository.save(notificacion);
  }

  async remove(id: number): Promise<void> {
    const notificacion = await this.findOne(id);
    await this.notificacionRepository.remove(notificacion);
  }

  async findByUsuario(usuarioId: number): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findUnreadByUsuario(usuarioId: number): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { usuarioId, leida: false },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByTipo(tipo: string): Promise<Notificacion[]> {
    return await this.notificacionRepository.find({
      where: { tipo },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<Notificacion> {
    const notificacion = await this.findOne(id);
    notificacion.leida = true;
    notificacion.fechaLectura = new Date();
    return await this.notificacionRepository.save(notificacion);
  }

  async markAllAsReadByUsuario(usuarioId: number): Promise<void> {
    await this.notificacionRepository.update(
      { usuarioId, leida: false },
      { leida: true, fechaLectura: new Date() },
    );
  }

  async getUnreadCountByUsuario(usuarioId: number): Promise<number> {
    return await this.notificacionRepository.count({
      where: { usuarioId, leida: false },
    });
  }

  async createBulkNotifications(
    usuarioIds: number[],
    data: CreateNotificacionDto,
  ): Promise<Notificacion[]> {
    const notificaciones = usuarioIds.map((usuarioId) =>
      this.notificacionRepository.create({ ...data, usuarioId }),
    );
    return await this.notificacionRepository.save(notificaciones);
  }

  async deleteOldNotifications(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.notificacionRepository
      .createQueryBuilder()
      .delete()
      .where('fechaCreacion < :cutoffDate', { cutoffDate })
      .andWhere('leida = :leida', { leida: true })
      .execute();
  }
}
