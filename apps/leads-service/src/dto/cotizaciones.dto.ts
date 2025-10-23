import { IsString, IsNumber, IsObject, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO para calcular cotización
export class CalcularCotizacionDto {
  @ApiProperty({
    description: 'Tipo de seguro a cotizar',
    example: 'salud',
    enum: ['salud', 'auto', 'sctr']
  })
  @IsString()
  tipo_seguro: 'salud' | 'auto' | 'sctr';

  @ApiProperty({
    description: 'Datos específicos del seguro',
    example: {
      edad: 35,
      sexo: 'Masculino',
      grupo_familiar: 'Pareja e hijos (2)'
    }
  })
  @IsObject()
  datos: Record<string, any>;
}

// DTO para resultado de cotización
export class CotizacionResultDto {
  @ApiProperty({
    description: 'Prima calculada',
    example: 1500.50
  })
  @IsNumber()
  prima: number;

  @ApiProperty({
    description: 'Lista de deducibles',
    example: [500, 1000, 2000]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  deducibles: number[];

  @ApiProperty({
    description: 'Lista de coberturas disponibles',
    example: ['Consultas médicas', 'Hospitalización', 'Medicamentos']
  })
  @IsArray()
  @IsString({ each: true })
  coberturas: string[];

  @ApiProperty({
    description: 'Total calculado',
    example: 1800.75
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Información adicional',
    required: false
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}