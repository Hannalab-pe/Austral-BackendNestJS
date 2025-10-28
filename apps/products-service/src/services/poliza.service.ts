import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poliza } from '../entities/poliza.entity';
import { CreatePolizaDto, UpdatePolizaDto, PolizaResponseDto } from '../dto/poliza.dto';
import { CompaniaSeguro } from '../entities/compania-seguro.entity';
import { ProductoSeguro } from '../entities/producto-seguro.entity';

@Injectable()
export class PolizaService {
  constructor(
    @InjectRepository(Poliza)
    private polizaRepository: Repository<Poliza>,
    @InjectRepository(CompaniaSeguro)
    private companiaRepository: Repository<CompaniaSeguro>,
    @InjectRepository(ProductoSeguro)
    private productoRepository: Repository<ProductoSeguro>,
  ) {}

  async create(
    createPolizaDto: CreatePolizaDto,
    idUsuarioCreador: string,
  ): Promise<PolizaResponseDto> {
    // Verificar que la compañía existe
    const compania = await this.companiaRepository.findOne({
      where: { idCompania: createPolizaDto.idCompania, estaActivo: true },
    });

    if (!compania) {
      throw new BadRequestException('Compañía de seguro no encontrada o inactiva');
    }

    // Verificar que el producto existe
    const producto = await this.productoRepository.findOne({
      where: { idProducto: createPolizaDto.idProducto, estaActivo: true },
    });

    if (!producto) {
      throw new BadRequestException('Producto de seguro no encontrado o inactivo');
    }

    // Verificar que el número de póliza no exista
    const existingPoliza = await this.polizaRepository.findOne({
      where: { numeroPoliza: createPolizaDto.numeroPoliza },
    });

    if (existingPoliza) {
      throw new BadRequestException('El número de póliza ya existe');
    }

    // Validar fechas
    const vigenciaInicio = new Date(createPolizaDto.vigenciaInicio);
    const vigenciaFin = new Date(createPolizaDto.vigenciaFin);
    const fechaEmision = new Date(createPolizaDto.fechaEmision);

    if (vigenciaFin <= vigenciaInicio) {
      throw new BadRequestException(
        'La fecha de fin de vigencia debe ser posterior a la fecha de inicio',
      );
    }

    // Crear la póliza
    const polizaData: any = {
      ...createPolizaDto,
      vigenciaInicio,
      vigenciaFin,
      fechaEmision,
      idUsuarioCreador,
      porcentajeComisionCompania: createPolizaDto.porcentajeComisionCompania ?? 0,
      porcentajeComisionSubagente: createPolizaDto.porcentajeComisionSubagente ?? 0,
      moneda: createPolizaDto.moneda ?? 'PEN',
      estaActivo: true,
    };

    if (createPolizaDto.fechaRenovacion) {
      polizaData.fechaRenovacion = new Date(createPolizaDto.fechaRenovacion);
    }

    const poliza = this.polizaRepository.create(polizaData) as unknown as Poliza;

    const savedPoliza = await this.polizaRepository.save(poliza);

    return this.mapToResponseDto(savedPoliza);
  }

  async findAll(): Promise<PolizaResponseDto[]> {
    const polizas = await this.polizaRepository.find({
      relations: ['compania', 'producto'],
      where: { estaActivo: true },
      order: { fechaCreacion: 'DESC' },
    });

    return polizas.map((poliza) => this.mapToResponseDto(poliza));
  }

  async findOne(id: string): Promise<PolizaResponseDto> {
    const poliza = await this.polizaRepository.findOne({
      where: { idPoliza: id, estaActivo: true },
      relations: ['compania', 'producto'],
    });

    if (!poliza) {
      throw new NotFoundException(`Póliza con ID ${id} no encontrada`);
    }

    return this.mapToResponseDto(poliza);
  }

  async findByCliente(idCliente: string): Promise<PolizaResponseDto[]> {
    const polizas = await this.polizaRepository.find({
      where: { idCliente, estaActivo: true },
      relations: ['compania', 'producto'],
      order: { fechaCreacion: 'DESC' },
    });

    return polizas.map((poliza) => this.mapToResponseDto(poliza));
  }

  async findByUsuarioCreador(idUsuarioCreador: string): Promise<PolizaResponseDto[]> {
    const polizas = await this.polizaRepository.find({
      where: { idUsuarioCreador, estaActivo: true },
      relations: ['compania', 'producto'],
      order: { fechaCreacion: 'DESC' },
    });

    return polizas.map((poliza) => this.mapToResponseDto(poliza));
  }

  async update(id: string, updatePolizaDto: UpdatePolizaDto): Promise<PolizaResponseDto> {
    const poliza = await this.polizaRepository.findOne({
      where: { idPoliza: id },
    });

    if (!poliza) {
      throw new NotFoundException(`Póliza con ID ${id} no encontrada`);
    }

    // Si se actualiza la compañía, verificar que existe
    if (updatePolizaDto.idCompania) {
      const compania = await this.companiaRepository.findOne({
        where: { idCompania: updatePolizaDto.idCompania, estaActivo: true },
      });

      if (!compania) {
        throw new BadRequestException('Compañía de seguro no encontrada o inactiva');
      }
    }

    // Si se actualiza el producto, verificar que existe
    if (updatePolizaDto.idProducto) {
      const producto = await this.productoRepository.findOne({
        where: { idProducto: updatePolizaDto.idProducto, estaActivo: true },
      });

      if (!producto) {
        throw new BadRequestException('Producto de seguro no encontrado o inactivo');
      }
    }

    // Si se actualiza el número de póliza, verificar que no exista
    if (updatePolizaDto.numeroPoliza && updatePolizaDto.numeroPoliza !== poliza.numeroPoliza) {
      const existingPoliza = await this.polizaRepository.findOne({
        where: { numeroPoliza: updatePolizaDto.numeroPoliza },
      });

      if (existingPoliza) {
        throw new BadRequestException('El número de póliza ya existe');
      }
    }

    // Validar fechas si se actualizan
    if (updatePolizaDto.vigenciaInicio || updatePolizaDto.vigenciaFin) {
      const vigenciaInicio = updatePolizaDto.vigenciaInicio
        ? new Date(updatePolizaDto.vigenciaInicio)
        : poliza.vigenciaInicio;
      const vigenciaFin = updatePolizaDto.vigenciaFin
        ? new Date(updatePolizaDto.vigenciaFin)
        : poliza.vigenciaFin;

      if (vigenciaFin <= vigenciaInicio) {
        throw new BadRequestException(
          'La fecha de fin de vigencia debe ser posterior a la fecha de inicio',
        );
      }
    }

    // Actualizar campos
    Object.assign(poliza, {
      ...updatePolizaDto,
      vigenciaInicio: updatePolizaDto.vigenciaInicio
        ? new Date(updatePolizaDto.vigenciaInicio)
        : poliza.vigenciaInicio,
      vigenciaFin: updatePolizaDto.vigenciaFin
        ? new Date(updatePolizaDto.vigenciaFin)
        : poliza.vigenciaFin,
      fechaEmision: updatePolizaDto.fechaEmision
        ? new Date(updatePolizaDto.fechaEmision)
        : poliza.fechaEmision,
      fechaRenovacion: updatePolizaDto.fechaRenovacion
        ? new Date(updatePolizaDto.fechaRenovacion)
        : poliza.fechaRenovacion,
    });

    const updatedPoliza = await this.polizaRepository.save(poliza);

    return this.findOne(updatedPoliza.idPoliza);
  }

  async remove(id: string): Promise<void> {
    const poliza = await this.polizaRepository.findOne({
      where: { idPoliza: id },
    });

    if (!poliza) {
      throw new NotFoundException(`Póliza con ID ${id} no encontrada`);
    }

    // Soft delete
    poliza.estaActivo = false;
    await this.polizaRepository.save(poliza);
  }

  private mapToResponseDto(poliza: Poliza): PolizaResponseDto {
    const response: PolizaResponseDto = {
      idPoliza: poliza.idPoliza,
      numeroPoliza: poliza.numeroPoliza,
      asegurado: poliza.asegurado,
      subAgente: poliza.subAgente,
      idCompania: poliza.idCompania,
      ramo: poliza.ramo,
      idProducto: poliza.idProducto,
      porcentajeComisionCompania: poliza.porcentajeComisionCompania,
      porcentajeComisionSubagente: poliza.porcentajeComisionSubagente,
      tipoVigencia: poliza.tipoVigencia,
      vigenciaInicio: poliza.vigenciaInicio,
      vigenciaFin: poliza.vigenciaFin,
      fechaEmision: poliza.fechaEmision,
      moneda: poliza.moneda,
      descripcionAsegura: poliza.descripcionAsegura,
      ejecutivoCuenta: poliza.ejecutivoCuenta,
      masInformacion: poliza.masInformacion,
      idCliente: poliza.idCliente,
      idUsuarioCreador: poliza.idUsuarioCreador,
      fechaRenovacion: poliza.fechaRenovacion,
      estaActivo: poliza.estaActivo,
      fechaCreacion: poliza.fechaCreacion,
      fechaActualizacion: poliza.fechaActualizacion,
    };

    if (poliza.compania) {
      response.compania = {
        idCompania: poliza.compania.idCompania,
        nombre: poliza.compania.nombre,
        razonSocial: poliza.compania.razonSocial,
      };
    }

    if (poliza.producto) {
      response.producto = {
        idProducto: poliza.producto.idProducto,
        nombre: poliza.producto.nombre,
        descripcion: poliza.producto.descripcion,
      };
    }

    return response;
  }
}
