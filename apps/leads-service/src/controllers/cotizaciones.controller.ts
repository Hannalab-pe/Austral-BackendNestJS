import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CotizacionesService } from '../services/cotizaciones.service';
import { CalcularCotizacionDto, CotizacionResultDto } from '../dto/cotizaciones.dto';

@ApiTags('Cotizaciones')
@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post('calcular')
  @ApiOperation({ summary: 'Calcular cotización de seguro' })
  @ApiResponse({
    status: 200,
    description: 'Cotización calculada exitosamente',
    type: CotizacionResultDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para el cálculo'
  })
  async calcularCotizacion(@Body() dto: CalcularCotizacionDto): Promise<CotizacionResultDto> {
    return this.cotizacionesService.calcularCotizacion(dto);
  }
}