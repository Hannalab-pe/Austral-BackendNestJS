import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prima } from '../entities/prima.entity';

@Injectable()
export class PrimaService {
  constructor(
    @InjectRepository(Prima)
    private readonly primaRepository: Repository<Prima>,
  ) {}

  async findAll(): Promise<Prima[]> {
    return this.primaRepository.find();
  }

  async findById(id: string): Promise<Prima | null> {
    return this.primaRepository.findOne({ where: { idPrima: id } });
  }

  async findByPoliza(idPoliza: string): Promise<Prima[]> {
    return this.primaRepository.find({ where: { idPoliza } });
  }

  async create(data: Partial<Prima>): Promise<Prima> {
    const prima = this.primaRepository.create(data);
    return this.primaRepository.save(prima);
  }

  async update(id: string, data: Partial<Prima>): Promise<Prima | null> {
    await this.primaRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.primaRepository.delete(id);
  }
}
