import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleSeguroScrtDto {
  @ApiProperty({ description: 'ID del lead', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  lead_id: string;

  @ApiProperty({ description: 'Razón social de la empresa', example: 'Empresa XYZ S.A.' })
  @IsNotEmpty()
  @IsString()
  razon_social: string;

  @ApiProperty({ description: 'RUC de la empresa', example: '20123456789' })
  @IsNotEmpty()
  @IsString()
  ruc: string;

  @ApiProperty({ description: 'Número de trabajadores', example: 50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numero_trabajadores: number;

  @ApiProperty({ description: 'Monto de planilla', example: 50000.00 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monto_planilla: number;

  @ApiProperty({ description: 'Actividad de negocio', example: 'Comercio al por mayor' })
  @IsNotEmpty()
  @IsString()
  actividad_negocio: string;

  @ApiProperty({ description: 'Tipo de seguro', example: 'SCTR' })
  @IsNotEmpty()
  @IsString()
  tipo_seguro: string;
}

export class UpdateDetalleSeguroScrtDto {
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Empresa XYZ S.A.',
    required: false,
  })
  @IsString()
  razon_social?: string;

  @ApiProperty({
    description: 'RUC de la empresa',
    example: '20123456789',
    required: false,
  })
  @IsString()
  ruc?: string;

  @ApiProperty({
    description: 'Número de trabajadores',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(1)
  numero_trabajadores?: number;

  @ApiProperty({
    description: 'Monto de planilla',
    example: 50000.00,
    required: false,
  })
  @IsNumber()
  @Min(0)
  monto_planilla?: number;

  @ApiProperty({
    description: 'Actividad de negocio',
    example: 'Comercio al por mayor',
    required: false,
  })
  @IsString()
  actividad_negocio?: string;

  @ApiProperty({
    description: 'Tipo de seguro',
    example: 'SCTR',
    required: false,
  })
  @IsString()
  tipo_seguro?: string;
}