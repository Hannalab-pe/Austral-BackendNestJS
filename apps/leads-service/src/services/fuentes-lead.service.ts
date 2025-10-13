import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuenteLead } from '../entities';
import { CreateFuenteLeadDto, UpdateFuenteLeadDto } from '../dto/leads.dto';

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
      where: { esta_activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FuenteLead> {
    const fuente = await this.fuenteLeadRepository.findOne({
      where: { id_fuente: id, esta_activo: true },
    });

    if (!fuente) {
      throw new NotFoundException('Fuente no encontrada');
    }

    return fuente;
  }

  async update(
    id: string,
    updateData: UpdateFuenteLeadDto,
  ): Promise<FuenteLead> {
    const fuente = await this.findOne(id);
    Object.assign(fuente, updateData);
    return await this.fuenteLeadRepository.save(fuente);
  }

  async remove(id: string): Promise<void> {
    const fuente = await this.findOne(id);
    fuente.esta_activo = false;
    await this.fuenteLeadRepository.save(fuente);
  }
}
