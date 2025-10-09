import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from '../entities/tarea.entity';
import { CreateTareaDto, UpdateTareaDto } from '../dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.tareaRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id_tarea: 'DESC' }, // Usar el campo correcto
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({
      where: { id_tarea: id },
    });

    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return tarea;
  }

  async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
    try {
      const tarea = this.tareaRepository.create({
        ...createTareaDto,
        estado: 'PENDIENTE', // Estado por defecto
      });
      return await this.tareaRepository.save(tarea);
    } catch (error) {
      throw new BadRequestException('Error al crear la tarea');
    }
  }

  async update(id: string, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.findOne(id);

    Object.assign(tarea, updateTareaDto);
    return await this.tareaRepository.save(tarea);
  }

  async remove(id: string): Promise<void> {
    const tarea = await this.findOne(id);
    await this.tareaRepository.remove(tarea);
  }

  async findByUsuarioAsignado(usuarioId: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { asignada_a: usuarioId },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async findByUsuarioCreador(usuarioId: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { creada_por: usuarioId },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async findByCliente(clienteId: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { id_cliente: clienteId },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async findByEstado(estado: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { estado },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async findByPrioridad(prioridad: string): Promise<Tarea[]> {
    return await this.tareaRepository.find({
      where: { prioridad },
      order: { fecha_vencimiento: 'ASC' },
    });
  }

  async findOverdueTasks(): Promise<Tarea[]> {
    return await this.tareaRepository
      .createQueryBuilder('tarea')
      .where('tarea.fecha_vencimiento < :today', { today: new Date() })
      .andWhere('tarea.estado != :estado', { estado: 'COMPLETADA' })
      .orderBy('tarea.fecha_vencimiento', 'ASC')
      .getMany();
  }

  async findTasksDueToday(): Promise<Tarea[]> {
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

    return await this.tareaRepository
      .createQueryBuilder('tarea')
      .where('tarea.fecha_vencimiento BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .andWhere('tarea.estado != :estado', { estado: 'COMPLETADA' })
      .orderBy('tarea.fecha_vencimiento', 'ASC')
      .getMany();
  }
}
