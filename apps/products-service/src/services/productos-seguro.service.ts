import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoSeguro } from '../entities';
import { CreateProductoSeguroDto, UpdateProductoSeguroDto } from '../dto';
import { CompaniasSeguroService } from './companias-seguro.service';
import { TiposSegurosService } from './tipos-seguros.service';

@Injectable()
export class ProductosSeguroService {
  constructor(
    @InjectRepository(ProductoSeguro)
    private productoSeguroRepository: Repository<ProductoSeguro>,
    private companiasSeguroService: CompaniasSeguroService,
    private tiposSegurosService: TiposSegurosService,
  ) {}

  async findAll(): Promise<ProductoSeguro[]> {
    return await this.productoSeguroRepository.find({
      where: { estaActivo: true },
      relations: ['compania', 'tipoSeguro'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProductoSeguro> {
    const producto = await this.productoSeguroRepository.findOne({
      where: { idProducto: id, estaActivo: true },
      relations: ['compania', 'tipoSeguro'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto de seguro con ID ${id} no encontrado`);
    }

    return producto;
  }

  async create(
    createProductoSeguroDto: CreateProductoSeguroDto,
  ): Promise<ProductoSeguro> {
    // Verificar que la compañía exista
    await this.companiasSeguroService.findOne(
      createProductoSeguroDto.idCompania,
    );

    // Verificar que el tipo de seguro exista
    await this.tiposSegurosService.findOne(
      createProductoSeguroDto.idTipoSeguro,
    );

    // Validar primas
    if (
      createProductoSeguroDto.primaMinima &&
      createProductoSeguroDto.primaMaxima &&
      createProductoSeguroDto.primaMinima > createProductoSeguroDto.primaMaxima
    ) {
      throw new BadRequestException(
        'La prima mínima no puede ser mayor que la prima máxima',
      );
    }

    // Validar edades
    if (
      createProductoSeguroDto.edadMinima &&
      createProductoSeguroDto.edadMaxima &&
      createProductoSeguroDto.edadMinima > createProductoSeguroDto.edadMaxima
    ) {
      throw new BadRequestException(
        'La edad mínima no puede ser mayor que la edad máxima',
      );
    }

    try {
      const newProducto = this.productoSeguroRepository.create({
        ...createProductoSeguroDto,
        estaActivo: true,
      });

      return await this.productoSeguroRepository.save(newProducto);
    } catch (error) {
      throw new BadRequestException('Error al crear el producto de seguro');
    }
  }

  async update(
    id: string,
    updateProductoSeguroDto: UpdateProductoSeguroDto,
  ): Promise<ProductoSeguro> {
    const producto = await this.findOne(id);

    // Verificar que la compañía exista si se está actualizando
    if (updateProductoSeguroDto.idCompania) {
      await this.companiasSeguroService.findOne(
        updateProductoSeguroDto.idCompania,
      );
    }

    // Verificar que el tipo de seguro exista si se está actualizando
    if (updateProductoSeguroDto.idTipoSeguro) {
      await this.tiposSegurosService.findOne(
        updateProductoSeguroDto.idTipoSeguro,
      );
    }

    // Validar primas
    const primaMinima =
      updateProductoSeguroDto.primaMinima ?? producto.primaMinima;
    const primaMaxima =
      updateProductoSeguroDto.primaMaxima ?? producto.primaMaxima;

    if (primaMinima && primaMaxima && primaMinima > primaMaxima) {
      throw new BadRequestException(
        'La prima mínima no puede ser mayor que la prima máxima',
      );
    }

    // Validar edades
    const edadMinima = updateProductoSeguroDto.edadMinima ?? producto.edadMinima;
    const edadMaxima = updateProductoSeguroDto.edadMaxima ?? producto.edadMaxima;

    if (edadMinima && edadMaxima && edadMinima > edadMaxima) {
      throw new BadRequestException(
        'La edad mínima no puede ser mayor que la edad máxima',
      );
    }

    Object.assign(producto, updateProductoSeguroDto);
    return await this.productoSeguroRepository.save(producto);
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);

    // Soft delete - marcar como inactivo en lugar de eliminar
    producto.estaActivo = false;
    await this.productoSeguroRepository.save(producto);
  }

  async findByCompania(idCompania: string): Promise<ProductoSeguro[]> {
    // Verificar que la compañía exista
    await this.companiasSeguroService.findOne(idCompania);

    return await this.productoSeguroRepository.find({
      where: { idCompania },
      relations: ['compania', 'tipoSeguro'],
      order: { nombre: 'ASC' },
    });
  }

  async findByTipoSeguro(idTipoSeguro: string): Promise<ProductoSeguro[]> {
    // Verificar que el tipo de seguro exista
    await this.tiposSegurosService.findOne(idTipoSeguro);

    return await this.productoSeguroRepository.find({
      where: { idTipoSeguro, estaActivo: true },
      relations: ['compania', 'tipoSeguro'],
      order: { nombre: 'ASC' },
    });
  }

  async activate(id: string): Promise<ProductoSeguro> {
    const producto = await this.productoSeguroRepository.findOne({
      where: { idProducto: id },
      relations: ['compania', 'tipoSeguro'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto de seguro con ID ${id} no encontrado`);
    }

    if (producto.estaActivo) {
      throw new BadRequestException('El producto de seguro ya está activo');
    }

    producto.estaActivo = true;
    return await this.productoSeguroRepository.save(producto);
  }

  async deactivate(id: string): Promise<ProductoSeguro> {
    const producto = await this.findOne(id);

    if (!producto.estaActivo) {
      throw new BadRequestException('El producto de seguro ya está inactivo');
    }

    producto.estaActivo = false;
    return await this.productoSeguroRepository.save(producto);
  }
}
