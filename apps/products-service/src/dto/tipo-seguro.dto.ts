import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoSeguroDto {
  @ApiProperty({
    description: 'Nombre del tipo de seguro',
    example: 'Seguro Vehicular',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del tipo de seguro',
    example: 'Seguro para vehículos particulares y comerciales',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Categoría del tipo de seguro',
    example: 'Automotriz',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @ApiProperty({
    description: 'Indica si requiere inspección previa',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiereInspeccion?: boolean;

  @ApiProperty({
    description: 'Duración mínima del seguro en meses',
    example: 12,
    minimum: 1,
    required: false,
    default: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duracionMinimaMeses?: number;

  @ApiProperty({
    description: 'Duración máxima del seguro en meses',
    example: 60,
    minimum: 1,
    required: false,
    default: 60,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duracionMaximaMeses?: number;
}

export class UpdateTipoSeguroDto {
  @ApiProperty({
    description: 'Nombre del tipo de seguro',
    example: 'Seguro Vehicular',
    maxLength: 150,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @ApiProperty({
    description: 'Descripción del tipo de seguro',
    example: 'Seguro para vehículos particulares y comerciales',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Categoría del tipo de seguro',
    example: 'Automotriz',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @ApiProperty({
    description: 'Indica si requiere inspección previa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requiereInspeccion?: boolean;

  @ApiProperty({
    description: 'Duración mínima del seguro en meses',
    example: 12,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duracionMinimaMeses?: number;

  @ApiProperty({
    description: 'Duración máxima del seguro en meses',
    example: 60,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duracionMaximaMeses?: number;

  @ApiProperty({
    description: 'Estado activo del tipo de seguro',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}
