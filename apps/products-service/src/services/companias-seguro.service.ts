import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniaSeguro } from '../entities';
import { CreateCompaniaSeguroDto, UpdateCompaniaSeguroDto } from '../dto';

@Injectable()
export class CompaniasSeguroService {
  constructor(
    @InjectRepository(CompaniaSeguro)
    private companiaSeguroRepository: Repository<CompaniaSeguro>,
  ) {}

  async findAll(): Promise<CompaniaSeguro[]> {
    return await this.companiaSeguroRepository.find({
      where: { estaActivo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CompaniaSeguro> {
    const compania = await this.companiaSeguroRepository.findOne({
      where: { idCompania: id, estaActivo: true },
      relations: ['productos'],
    });

    if (!compania) {
      throw new NotFoundException(`Compañía de seguro con ID ${id} no encontrada`);
    }

    return compania;
  }

  async create(
    createCompaniaSeguroDto: CreateCompaniaSeguroDto,
  ): Promise<CompaniaSeguro> {
    // Verificar que el RUC no esté en uso si se proporciona
    if (createCompaniaSeguroDto.ruc) {
      const existingCompania = await this.companiaSeguroRepository.findOne({
        where: { ruc: createCompaniaSeguroDto.ruc },
      });

      if (existingCompania) {
        throw new ConflictException('El RUC ya está en uso');
      }
    }

    try {
      const newCompania = this.companiaSeguroRepository.create({
        ...createCompaniaSeguroDto,
        estaActivo: true,
      });

      return await this.companiaSeguroRepository.save(newCompania);
    } catch (error) {
      throw new BadRequestException('Error al crear la compañía de seguros');
    }
  }

  async update(
    id: string,
    updateCompaniaSeguroDto: UpdateCompaniaSeguroDto,
  ): Promise<CompaniaSeguro> {
    const compania = await this.findOne(id);

    // Si se está actualizando el RUC, verificar que no esté en uso
    if (
      updateCompaniaSeguroDto.ruc &&
      updateCompaniaSeguroDto.ruc !== compania.ruc
    ) {
      const existingCompania = await this.companiaSeguroRepository.findOne({
        where: { ruc: updateCompaniaSeguroDto.ruc },
      });

      if (existingCompania) {
        throw new ConflictException('El RUC ya está en uso');
      }
    }

    Object.assign(compania, updateCompaniaSeguroDto);
    return await this.companiaSeguroRepository.save(compania);
  }

  async remove(id: string): Promise<void> {
    const compania = await this.findOne(id);

    // Soft delete - marcar como inactivo en lugar de eliminar
    compania.estaActivo = false;
    await this.companiaSeguroRepository.save(compania);
  }

  async findByRuc(ruc: string): Promise<CompaniaSeguro | null> {
    return await this.companiaSeguroRepository.findOne({
      where: { ruc, estaActivo: true },
    });
  }
}
