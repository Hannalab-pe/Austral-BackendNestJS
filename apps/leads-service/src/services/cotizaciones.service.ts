import { Injectable } from '@nestjs/common';
import { CalcularCotizacionDto, CotizacionResultDto } from '../dto/cotizaciones.dto';

@Injectable()
export class CotizacionesService {
  // TODO: Implementar lógica de cálculos matemáticos
  async calcularCotizacion(dto: CalcularCotizacionDto): Promise<CotizacionResultDto> {
    // Lógica de cálculo irá aquí
    // Por ahora retornamos un objeto vacío
    return {
      prima: 0,
      deducibles: [],
      coberturas: [],
      total: 0,
    };
  }
}