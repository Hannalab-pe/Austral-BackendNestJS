import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoSeguroDto {
  @ApiProperty({
    description: 'Nombre del producto de seguro',
    example: 'Seguro Vehicular Todo Riesgo',
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Cobertura completa para vehículos particulares',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Código interno del producto',
    example: 'VEH-TR-001',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigoProducto?: string;

  @ApiProperty({
    description: 'Prima base del producto',
    example: 1500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  primaBase?: number;

  @ApiProperty({
    description: 'Prima mínima del producto',
    example: 800.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  primaMinima?: number;

  @ApiProperty({
    description: 'Prima máxima del producto',
    example: 5000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  primaMaxima?: number;

  @ApiProperty({
    description: 'Porcentaje de comisión (0-100)',
    example: 15.5,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeComision?: number;

  @ApiProperty({
    description: 'Cobertura máxima del producto',
    example: 50000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  coberturaMaxima?: number;

  @ApiProperty({
    description: 'Deducible del producto',
    example: 500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deducible?: number;

  @ApiProperty({
    description: 'Edad mínima para contratar el seguro',
    example: 18,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  edadMinima?: number;

  @ApiProperty({
    description: 'Edad máxima para contratar el seguro',
    example: 70,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  edadMaxima?: number;

  @ApiProperty({
    description: 'Condiciones especiales del producto',
    example: 'Requiere inspección previa del vehículo',
    required: false,
  })
  @IsOptional()
  @IsString()
  condicionesEspeciales?: string;

  @ApiProperty({
    description: 'ID de la compañía de seguros',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  idCompania: string;

  @ApiProperty({
    description: 'ID del tipo de seguro',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  idTipoSeguro: string;
}

export class UpdateProductoSeguroDto {
  @ApiProperty({
    description: 'Nombre del producto de seguro',
    example: 'Seguro Vehicular Todo Riesgo',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nombre?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Cobertura completa para vehículos particulares',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Código interno del producto',
    example: 'VEH-TR-001',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigoProducto?: string;

  @ApiProperty({
    description: 'Prima base del producto',
    example: 1500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  primaBase?: number;

  @ApiProperty({
    description: 'Prima mínima del producto',
    example: 800.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  primaMinima?: number;

  @ApiProperty({
    description: 'Prima máxima del producto',
    example: 5000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  primaMaxima?: number;

  @ApiProperty({
    description: 'Porcentaje de comisión (0-100)',
    example: 15.5,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeComision?: number;

  @ApiProperty({
    description: 'Cobertura máxima del producto',
    example: 50000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  coberturaMaxima?: number;

  @ApiProperty({
    description: 'Deducible del producto',
    example: 500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deducible?: number;

  @ApiProperty({
    description: 'Edad mínima para contratar el seguro',
    example: 18,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  edadMinima?: number;

  @ApiProperty({
    description: 'Edad máxima para contratar el seguro',
    example: 70,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  edadMaxima?: number;

  @ApiProperty({
    description: 'Condiciones especiales del producto',
    example: 'Requiere inspección previa del vehículo',
    required: false,
  })
  @IsOptional()
  @IsString()
  condicionesEspeciales?: string;

  @ApiProperty({
    description: 'ID de la compañía de seguros',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  idCompania?: string;

  @ApiProperty({
    description: 'ID del tipo de seguro',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  idTipoSeguro?: string;

  @ApiProperty({
    description: 'Estado activo del producto',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}
