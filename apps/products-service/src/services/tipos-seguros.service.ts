import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSeguro } from '../entities';
import { CreateTipoSeguroDto, UpdateTipoSeguroDto } from '../dto';

@Injectable()
export class TiposSegurosService {
  constructor(
    @InjectRepository(TipoSeguro)
    private tipoSeguroRepository: Repository<TipoSeguro>,
  ) {}

  async findAll(): Promise<TipoSeguro[]> {
    return await this.tipoSeguroRepository.find({
      where: { estaActivo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TipoSeguro> {
    const tipoSeguro = await this.tipoSeguroRepository.findOne({
      where: { idTipoSeguro: id, estaActivo: true },
    });

    if (!tipoSeguro) {
      throw new NotFoundException(`Tipo de seguro con ID ${id} no encontrado`);
    }

    return tipoSeguro;
  }

  async create(createTipoSeguroDto: CreateTipoSeguroDto): Promise<TipoSeguro> {
    // Verificar que el nombre no esté en uso
    const existingTipo = await this.tipoSeguroRepository.findOne({
      where: { nombre: createTipoSeguroDto.nombre },
    });

    if (existingTipo) {
      throw new ConflictException('El nombre del tipo de seguro ya está en uso');
    }

    // Validar duraciones
    if (
      createTipoSeguroDto.duracionMinimaMeses &&
      createTipoSeguroDto.duracionMaximaMeses &&
      createTipoSeguroDto.duracionMinimaMeses >
        createTipoSeguroDto.duracionMaximaMeses
    ) {
      throw new BadRequestException(
        'La duración mínima no puede ser mayor que la duración máxima',
      );
    }

    try {
      const newTipoSeguro = this.tipoSeguroRepository.create({
        ...createTipoSeguroDto,
        estaActivo: true,
      });

      return await this.tipoSeguroRepository.save(newTipoSeguro);
    } catch (error) {
      throw new BadRequestException('Error al crear el tipo de seguro');
    }
  }

  async update(
    id: string,
    updateTipoSeguroDto: UpdateTipoSeguroDto,
  ): Promise<TipoSeguro> {
    const tipoSeguro = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no esté en uso
    if (
      updateTipoSeguroDto.nombre &&
      updateTipoSeguroDto.nombre !== tipoSeguro.nombre
    ) {
      const existingTipo = await this.tipoSeguroRepository.findOne({
        where: { nombre: updateTipoSeguroDto.nombre },
      });

      if (existingTipo) {
        throw new ConflictException(
          'El nombre del tipo de seguro ya está en uso',
        );
      }
    }

    // Validar duraciones
    const duracionMinima =
      updateTipoSeguroDto.duracionMinimaMeses ?? tipoSeguro.duracionMinimaMeses;
    const duracionMaxima =
      updateTipoSeguroDto.duracionMaximaMeses ?? tipoSeguro.duracionMaximaMeses;

    if (duracionMinima && duracionMaxima && duracionMinima > duracionMaxima) {
      throw new BadRequestException(
        'La duración mínima no puede ser mayor que la duración máxima',
      );
    }

    Object.assign(tipoSeguro, updateTipoSeguroDto);
    return await this.tipoSeguroRepository.save(tipoSeguro);
  }

  async remove(id: string): Promise<void> {
    const tipoSeguro = await this.findOne(id);

    // Soft delete - marcar como inactivo en lugar de eliminar
    tipoSeguro.estaActivo = false;
    await this.tipoSeguroRepository.save(tipoSeguro);
  }

  async findByCategory(categoria: string): Promise<TipoSeguro[]> {
    return await this.tipoSeguroRepository.find({
      where: { categoria, estaActivo: true },
      order: { nombre: 'ASC' },
    });
  }
}
