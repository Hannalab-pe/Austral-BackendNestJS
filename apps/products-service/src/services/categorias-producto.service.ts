import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaProducto } from '../entities/categoria-producto.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto';

@Injectable()
export class CategoriasProductoService {
  constructor(
    @InjectRepository(CategoriaProducto)
    private readonly categoriaRepository: Repository<CategoriaProducto>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.categoriaRepository.findAndCount({
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

  async findOne(id: number): Promise<CategoriaProducto> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaProducto> {
    try {
      const categoria = this.categoriaRepository.create({
        ...createCategoriaDto,
        activa: true,
      });
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      throw new BadRequestException('Error al crear la categoría');
    }
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<CategoriaProducto> {
    const categoria = await this.findOne(id);

    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }

  async findActiveCategories(): Promise<CategoriaProducto[]> {
    return await this.categoriaRepository.find({
      where: { activa: true },
      order: { nombre: 'ASC' },
    });
  }

  async findByName(nombre: string): Promise<CategoriaProducto[]> {
    return await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('categoria.nombre ILIKE :nombre', { nombre: `%${nombre}%` })
      .orderBy('categoria.nombre', 'ASC')
      .getMany();
  }
}
