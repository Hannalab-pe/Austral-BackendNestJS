import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcularCotizacionDto, CotizacionResultDto } from '../dto/cotizaciones.dto';

interface VehiculoData {
  marca: string;
  modelo: string;
  anio: number;
  precio_base: number;
  tasa_base: number;
}

@Injectable()
export class CotizacionesService {
  // Data ficticia de precios de vehículos (simulando APSEG)
  private vehiculosData: VehiculoData[] = [
    // Toyota
    { marca: 'Toyota', modelo: 'Corolla', anio: 2020, precio_base: 15000, tasa_base: 3.5 },
    { marca: 'Toyota', modelo: 'Corolla', anio: 2021, precio_base: 16500, tasa_base: 3.3 },
    { marca: 'Toyota', modelo: 'Corolla', anio: 2022, precio_base: 18000, tasa_base: 3.1 },
    { marca: 'Toyota', modelo: 'Yaris', anio: 2020, precio_base: 12000, tasa_base: 4.0 },
    { marca: 'Toyota', modelo: 'Yaris', anio: 2021, precio_base: 13500, tasa_base: 3.8 },
    { marca: 'Toyota', modelo: 'RAV4', anio: 2020, precio_base: 22000, tasa_base: 3.2 },
    { marca: 'Toyota', modelo: 'RAV4', anio: 2021, precio_base: 24000, tasa_base: 3.0 },
    { marca: 'Toyota', modelo: 'Sportage', anio: 2020, precio_base: 19000, tasa_base: 3.6 },

    // Hyundai
    { marca: 'Hyundai', modelo: 'Tucson', anio: 2020, precio_base: 18000, tasa_base: 3.8 },
    { marca: 'Hyundai', modelo: 'Tucson', anio: 2021, precio_base: 19500, tasa_base: 3.6 },
    { marca: 'Hyundai', modelo: 'Creta', anio: 2020, precio_base: 16000, tasa_base: 4.2 },
    { marca: 'Hyundai', modelo: 'Creta', anio: 2021, precio_base: 17500, tasa_base: 4.0 },

    // Kia
    { marca: 'Kia', modelo: 'Sportage', anio: 2020, precio_base: 17000, tasa_base: 3.9 },
    { marca: 'Kia', modelo: 'Sportage', anio: 2021, precio_base: 18500, tasa_base: 3.7 },
    { marca: 'Kia', modelo: 'Rio', anio: 2020, precio_base: 13000, tasa_base: 4.1 },
    { marca: 'Kia', modelo: 'Rio', anio: 2021, precio_base: 14500, tasa_base: 3.9 },

    // Nissan
    { marca: 'Nissan', modelo: 'Sentra', anio: 2020, precio_base: 14000, tasa_base: 4.0 },
    { marca: 'Nissan', modelo: 'Sentra', anio: 2021, precio_base: 15500, tasa_base: 3.8 },
    { marca: 'Nissan', modelo: 'Kicks', anio: 2020, precio_base: 15000, tasa_base: 3.7 },
    { marca: 'Nissan', modelo: 'Kicks', anio: 2021, precio_base: 16500, tasa_base: 3.5 },

    // Chevrolet
    { marca: 'Chevrolet', modelo: 'Onix', anio: 2020, precio_base: 11000, tasa_base: 4.5 },
    { marca: 'Chevrolet', modelo: 'Onix', anio: 2021, precio_base: 12500, tasa_base: 4.3 },
    { marca: 'Chevrolet', modelo: 'Tracker', anio: 2020, precio_base: 14000, tasa_base: 4.2 },
    { marca: 'Chevrolet', modelo: 'Tracker', anio: 2021, precio_base: 15500, tasa_base: 4.0 },

    // Volkswagen
    { marca: 'Volkswagen', modelo: 'Virtus', anio: 2020, precio_base: 13500, tasa_base: 4.1 },
    { marca: 'Volkswagen', modelo: 'Virtus', anio: 2021, precio_base: 15000, tasa_base: 3.9 },
    { marca: 'Volkswagen', modelo: 'T-Cross', anio: 2020, precio_base: 16000, tasa_base: 3.8 },
    { marca: 'Volkswagen', modelo: 'T-Cross', anio: 2021, precio_base: 17500, tasa_base: 3.6 },
  ];

  async calcularCotizacion(dto: CalcularCotizacionDto): Promise<CotizacionResultDto> {
    switch (dto.tipo_seguro) {
      case 'auto':
        return this.calcularCotizacionAuto(dto.datos);
      case 'salud':
        return this.calcularCotizacionSalud(dto.datos);
      case 'sctr':
        return this.calcularCotizacionSctr(dto.datos);
      default:
        throw new BadRequestException('Tipo de seguro no válido');
    }
  }

  private calcularCotizacionAuto(datos: any): CotizacionResultDto {
    const { marca, modelo, anio, valor_vehiculo, tipo_cobertura, zona_riesgo, antiguedad_licencia } = datos;

    if (!marca || !modelo || !anio) {
      throw new BadRequestException('Marca, modelo y año son requeridos para cotizar auto');
    }

    // Buscar vehículo en data ficticia
    const vehiculoBase = this.vehiculosData.find(
      v => v.marca.toLowerCase() === marca.toLowerCase() &&
           v.modelo.toLowerCase() === modelo.toLowerCase() &&
           v.anio === anio
    );

    if (!vehiculoBase) {
      throw new BadRequestException(`Vehículo ${marca} ${modelo} ${anio} no encontrado en nuestra base de datos`);
    }

    // Determinar valor asegurado (usar valor proporcionado o precio base ±15%)
    const valorAsegurado = valor_vehiculo || vehiculoBase.precio_base;

    // Ajustar tasa base según factores adicionales
    let tasaAjustada = vehiculoBase.tasa_base;

    // Ajuste por zona de riesgo
    if (zona_riesgo === 'Alta') tasaAjustada += 0.5;
    else if (zona_riesgo === 'Baja') tasaAjustada -= 0.3;

    // Ajuste por antigüedad de licencia
    if (antiguedad_licencia < 3) tasaAjustada += 0.8;
    else if (antiguedad_licencia > 10) tasaAjustada -= 0.4;

    // Ajuste por tipo de cobertura
    if (tipo_cobertura === 'Todo riesgo') tasaAjustada += 0.2;
    else if (tipo_cobertura === 'Terceros') tasaAjustada -= 0.5;

    // Calcular primas según la fórmula
    const primaNeta = valorAsegurado * (tasaAjustada / 100);
    const primaComercial = primaNeta * 1.03; // 3% de emisión
    const primaTotal = primaComercial * 1.18; // IGV 18%

    // Determinar deducibles según tipo de cobertura
    const deducibles = this.calcularDeducibles(tipo_cobertura, valorAsegurado);

    // Determinar coberturas disponibles
    const coberturas = this.obtenerCoberturasAuto(tipo_cobertura);

    // Garantías requeridas
    const garantiasRequeridas = this.obtenerGarantiasRequeridas(marca, modelo, anio);

    return {
      prima: Math.round(primaTotal * 100) / 100,
      deducibles,
      coberturas,
      total: Math.round(primaTotal * 100) / 100,
      metadata: {
        primaNeta: Math.round(primaNeta * 100) / 100,
        primaComercial: Math.round(primaComercial * 100) / 100,
        tasaAplicada: tasaAjustada,
        valorAsegurado,
        garantiasRequeridas,
        vehiculoBase: {
          marca: vehiculoBase.marca,
          modelo: vehiculoBase.modelo,
          anio: vehiculoBase.anio,
          precioReferencial: vehiculoBase.precio_base
        }
      }
    };
  }

  private calcularDeducibles(tipoCobertura: string, valorVehiculo: number): number[] {
    const porcentajeBase = tipoCobertura === 'Todo riesgo' ? 0.01 : 0.05; // 1% o 5%
    const deducibleBase = valorVehiculo * porcentajeBase;

    return [
      Math.round(deducibleBase * 100) / 100,
      Math.round(deducibleBase * 1.5 * 100) / 100,
      Math.round(deducibleBase * 2 * 100) / 100
    ];
  }

  private obtenerCoberturasAuto(tipoCobertura: string): string[] {
    const coberturasBasicas = [
      'Responsabilidad Civil',
      'Asistencia Vial 24/7',
      'Defensa Jurídica'
    ];

    if (tipoCobertura === 'Todo riesgo') {
      return [
        ...coberturasBasicas,
        'Choque',
        'Robo Total',
        'Robo de Autopartes',
        'Daños por Granizo',
        'Incendio Total',
        'Daños por Vandalismo'
      ];
    } else if (tipoCobertura === 'Terceros completo') {
      return [
        ...coberturasBasicas,
        'Robo Total',
        'Incendio Total'
      ];
    }

    return coberturasBasicas;
  }

  private obtenerGarantiasRequeridas(marca: string, modelo: string, anio: number): string[] {
    const garantias = ['GPS'];

    // Si no es nuevo, requiere inspección vehicular
    if (anio < new Date().getFullYear()) {
      garantias.push('Inspección Vehicular');
    }

    // Vehículos con mayor riesgo requieren alarma
    const vehiculosAltoRiesgo = ['Onix', 'Rio', 'Virtus'];
    if (vehiculosAltoRiesgo.some(m => modelo.toLowerCase().includes(m.toLowerCase()))) {
      garantias.push('Alarma');
    }

    return garantias;
  }

  private calcularCotizacionSalud(datos: any): CotizacionResultDto {
    // TODO: Implementar lógica de salud
    return {
      prima: 0,
      deducibles: [],
      coberturas: [],
      total: 0,
    };
  }

  private calcularCotizacionSctr(datos: any): CotizacionResultDto {
    // TODO: Implementar lógica de SCTR
    return {
      prima: 0,
      deducibles: [],
      coberturas: [],
      total: 0,
    };
  }
}