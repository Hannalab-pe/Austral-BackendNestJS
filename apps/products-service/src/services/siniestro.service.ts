import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siniestro } from '../entities/siniestro.entity';

@Injectable()
export class SiniestroService {
  constructor(
    @InjectRepository(Siniestro)
    private readonly siniestroRepository: Repository<Siniestro>,
  ) {}

  async findAll(): Promise<Siniestro[]> {
    return this.siniestroRepository.find();
  }

  async findById(id: string): Promise<Siniestro | null> {
    return this.siniestroRepository.findOne({ where: { idSiniestro: id } });
  }

  async findByPoliza(idPoliza: string): Promise<Siniestro[]> {
    return this.siniestroRepository.find({ where: { idPoliza } });
  }

  async create(data: Partial<Siniestro>): Promise<Siniestro> {
    const siniestro = this.siniestroRepository.create(data);
    return this.siniestroRepository.save(siniestro);
  }

  async update(id: string, data: Partial<Siniestro>): Promise<Siniestro | null> {
    await this.siniestroRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.siniestroRepository.delete(id);
  }
}
