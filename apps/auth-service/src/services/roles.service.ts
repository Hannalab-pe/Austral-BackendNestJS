import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto, UpdateRolDto } from '../dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) { }

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({
      where: { estaActivo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { idRol: id, estaActivo: true },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    // Verificar que el nombre no esté en uso
    const existingRol = await this.rolRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });

    if (existingRol) {
      throw new ConflictException('El nombre del rol ya está en uso');
    }

    try {
      const newRol = this.rolRepository.create({
        ...createRolDto,
        estaActivo: true,
      });

      return await this.rolRepository.save(newRol);
    } catch (error) {
      throw new BadRequestException('Error al crear el rol');
    }
  }

  async update(id: string, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no esté en uso
    if (updateRolDto.nombre && updateRolDto.nombre !== rol.nombre) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: updateRolDto.nombre },
      });

      if (existingRol) {
        throw new ConflictException('El nombre del rol ya está en uso');
      }
    }

    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: string): Promise<void> {
    const rol = await this.findOne(id);

    // Soft delete - marcar como inactivo en lugar de eliminar
    rol.estaActivo = false;
    await this.rolRepository.save(rol);
  }

  async findByName(nombre: string): Promise<Rol | null> {
    return await this.rolRepository.findOne({
      where: { nombre, estaActivo: true },
    });
  }

  async createDefaultRoles(): Promise<void> {
    const defaultRoles = [
      {
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
        nivelAcceso: 10,
      },
      {
        nombre: 'Gerente',
        descripcion: 'Acceso de gestión y supervisión',
        nivelAcceso: 8,
      },
      {
        nombre: 'Vendedor',
        descripcion: 'Acceso para actividades de ventas',
        nivelAcceso: 5,
      },
      {
        nombre: 'Asistente',
        descripcion: 'Acceso básico al sistema',
        nivelAcceso: 3,
      },
    ];

    for (const rolData of defaultRoles) {
      const existingRol = await this.findByName(rolData.nombre);
      if (!existingRol) {
        await this.create(rolData);
      }
    }
  }
}
