import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compania } from '../entities/compania.entity';
import { CreateCompaniaDto, UpdateCompaniaDto } from '../dto';

@Injectable()
export class CompaniasService {
  constructor(
    @InjectRepository(Compania)
    private readonly companiaRepository: Repository<Compania>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.companiaRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { nombre: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Compania> {
    const compania = await this.companiaRepository.findOne({
      where: { id },
    });

    if (!compania) {
      throw new NotFoundException(`Compañía con ID ${id} no encontrada`);
    }

    return compania;
  }

  async create(createCompaniaDto: CreateCompaniaDto): Promise<Compania> {
    try {
      const compania = this.companiaRepository.create({
        ...createCompaniaDto,
        activa: true,
      });
      return await this.companiaRepository.save(compania);
    } catch (error) {
      throw new BadRequestException('Error al crear la compañía');
    }
  }

  async update(
    id: number,
    updateCompaniaDto: UpdateCompaniaDto,
  ): Promise<Compania> {
    const compania = await this.findOne(id);

    Object.assign(compania, updateCompaniaDto);
    return await this.companiaRepository.save(compania);
  }

  async remove(id: number): Promise<void> {
    const compania = await this.findOne(id);
    await this.companiaRepository.remove(compania);
  }

  async findActiveCompanies(): Promise<Compania[]> {
    return await this.companiaRepository.find({
      where: { activa: true },
      order: { nombre: 'ASC' },
    });
  }

  async findByName(nombre: string): Promise<Compania[]> {
    return await this.companiaRepository
      .createQueryBuilder('compania')
      .where('compania.nombre ILIKE :nombre', { nombre: `%${nombre}%` })
      .orderBy('compania.nombre', 'ASC')
      .getMany();
  }
}
