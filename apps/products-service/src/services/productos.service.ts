import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto, UpdateProductoDto } from '../dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.productoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      const producto = this.productoRepository.create({
        ...createProductoDto,
        activo: true, // Por defecto activo
      });
      return await this.productoRepository.save(producto);
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.findOne(id);

    Object.assign(producto, updateProductoDto);
    return await this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { categoriaId },
      order: { nombre: 'ASC' },
    });
  }

  async findByCompania(companiaId: number): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { companiaId },
      order: { nombre: 'ASC' },
    });
  }

  async findActiveProducts(): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Producto[]> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.precioBase BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .andWhere('producto.activo = :activo', { activo: true })
      .orderBy('producto.precioBase', 'ASC')
      .getMany();
  }
}
