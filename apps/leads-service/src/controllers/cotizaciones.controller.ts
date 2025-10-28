import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CotizacionesService } from '../services/cotizaciones.service';
import {
  CalcularCotizacionAutoDto,
  CalcularCotizacionSaludDto,
  CalcularCotizacionSctrDto,
  CotizacionResultDto,
} from '../dto/cotizaciones.dto';

@ApiTags('Cotizaciones')
@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post('auto')
  @ApiOperation({ summary: 'Calcular cotización de seguro vehicular' })
  @ApiResponse({
    status: 200,
    description: 'Cotización de auto calculada exitosamente',
    type: CotizacionResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para el cálculo de auto',
  })
  async calcularCotizacionAuto(
    @Body() dto: CalcularCotizacionAutoDto,
  ): Promise<CotizacionResultDto> {
    return this.cotizacionesService.calcularCotizacionAuto(dto);
  }

  @Post('salud')
  @ApiOperation({ summary: 'Calcular cotización de seguro de salud' })
  @ApiResponse({
    status: 200,
    description: 'Cotización de salud calculada exitosamente',
    type: CotizacionResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para el cálculo de salud',
  })
  async calcularCotizacionSalud(
    @Body() dto: CalcularCotizacionSaludDto,
  ): Promise<CotizacionResultDto> {
    return this.cotizacionesService.calcularCotizacionSalud(dto);
  }

  @Post('sctr')
  @ApiOperation({ summary: 'Calcular cotización de seguro SCTR' })
  @ApiResponse({
    status: 200,
    description: 'Cotización SCTR calculada exitosamente',
    type: CotizacionResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para el cálculo SCTR',
  })
  async calcularCotizacionSctr(
    @Body() dto: CalcularCotizacionSctrDto,
  ): Promise<CotizacionResultDto> {
    return this.cotizacionesService.calcularCotizacionSctr(dto);
  }
}
