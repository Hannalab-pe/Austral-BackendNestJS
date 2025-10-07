import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuenteLead } from '../entities';
import { CreateFuenteLeadDto } from '../dto';

@Injectable()
export class FuentesLeadService {
  constructor(
    @InjectRepository(FuenteLead)
    private fuenteLeadRepository: Repository<FuenteLead>,
  ) {}

  async create(createFuenteDto: CreateFuenteLeadDto): Promise<FuenteLead> {
    const fuente = this.fuenteLeadRepository.create(createFuenteDto);
    return await this.fuenteLeadRepository.save(fuente);
  }

  async findAll(): Promise<FuenteLead[]> {
    return await this.fuenteLeadRepository.find({
      where: { estaActivo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FuenteLead> {
    const fuente = await this.fuenteLeadRepository.findOne({
      where: { id, estaActivo: true },
    });

    if (!fuente) {
      throw new NotFoundException('Fuente no encontrada');
    }

    return fuente;
  }

  async update(
    id: string,
    updateData: Partial<CreateFuenteLeadDto>,
  ): Promise<FuenteLead> {
    const fuente = await this.findOne(id);
    Object.assign(fuente, updateData);
    return await this.fuenteLeadRepository.save(fuente);
  }

  async remove(id: string): Promise<void> {
    const fuente = await this.findOne(id);
    fuente.estaActivo = false;
    await this.fuenteLeadRepository.save(fuente);
  }
}
