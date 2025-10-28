import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  Length,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePolizaDto {
  @ApiProperty({
    description: 'Número de la póliza',
    example: 'POL-2025-001234',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  numeroPoliza: string;

  @ApiProperty({
    description: 'Nombre completo del asegurado',
    example: 'MENDOZA GOZAR, ENRIQUE CARLOS',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 300)
  asegurado: string;

  @ApiProperty({
    description: 'Nombre del sub agente',
    example: 'ROSANA MARIA ALVAREZ CALDERON VELIZ',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  subAgente?: string;

  @ApiProperty({
    description: 'ID de la compañía de seguros (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  idCompania: string;

  @ApiProperty({
    description: 'Ramo del seguro',
    example: 'VIDA',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  ramo: string;

  @ApiProperty({
    description: 'ID del producto de seguro (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  idProducto: string;

  @ApiProperty({
    description: 'Porcentaje de comisión de la compañía (0-100)',
    example: 15.5,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeComisionCompania?: number;

  @ApiProperty({
    description: 'Porcentaje de comisión del sub agente (0-100)',
    example: 70,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeComisionSubagente?: number;

  @ApiProperty({
    description: 'Tipo de vigencia',
    example: 'ANUAL',
    enum: ['ANUAL', 'SEMESTRAL', 'TRIMESTRAL', 'MENSUAL', 'OTRO'],
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  tipoVigencia: string;

  @ApiProperty({
    description: 'Fecha de inicio de vigencia (formato: YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  vigenciaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin de vigencia (formato: YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  vigenciaFin: string;

  @ApiProperty({
    description: 'Fecha de emisión de la póliza (formato: YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  fechaEmision: string;

  @ApiProperty({
    description: 'Moneda de la póliza',
    example: 'PEN',
    enum: ['PEN', 'USD', 'EUR'],
    default: 'PEN',
  })
  @IsOptional()
  @IsString()
  @Length(3, 10)
  moneda?: string;

  @ApiProperty({
    description: 'Breve descripción de lo que se asegura',
    example: 'Seguro de vida con cobertura amplia',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcionAsegura?: string;

  @ApiProperty({
    description: 'Nombre del ejecutivo de cuenta',
    example: 'Juan Pérez López',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  ejecutivoCuenta?: string;

  @ApiProperty({
    description: 'Información adicional sobre la póliza',
    required: false,
  })
  @IsOptional()
  @IsString()
  masInformacion?: string;

  @ApiProperty({
    description: 'ID del cliente al que pertenece la póliza (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsUUID()
  idCliente: string;

  @ApiProperty({
    description: 'Fecha de renovación (formato: YYYY-MM-DD)',
    example: '2026-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaRenovacion?: string;
}

export class UpdatePolizaDto extends PartialType(CreatePolizaDto) {
  @ApiProperty({
    description: 'Estado de la póliza',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}

export class PolizaResponseDto {
  @ApiProperty({ description: 'ID de la póliza' })
  idPoliza: string;

  @ApiProperty({ description: 'Número de la póliza' })
  numeroPoliza: string;

  @ApiProperty({ description: 'Asegurado' })
  asegurado: string;

  @ApiProperty({ description: 'Sub agente', required: false })
  subAgente?: string;

  @ApiProperty({ description: 'ID de la compañía' })
  idCompania: string;

  @ApiProperty({ description: 'Ramo' })
  ramo: string;

  @ApiProperty({ description: 'ID del producto' })
  idProducto: string;

  @ApiProperty({ description: 'Porcentaje comisión compañía' })
  porcentajeComisionCompania: number;

  @ApiProperty({ description: 'Porcentaje comisión sub agente' })
  porcentajeComisionSubagente: number;

  @ApiProperty({ description: 'Tipo de vigencia' })
  tipoVigencia: string;

  @ApiProperty({ description: 'Vigencia inicio' })
  vigenciaInicio: Date;

  @ApiProperty({ description: 'Vigencia fin' })
  vigenciaFin: Date;

  @ApiProperty({ description: 'Fecha emisión' })
  fechaEmision: Date;

  @ApiProperty({ description: 'Moneda' })
  moneda: string;

  @ApiProperty({ description: 'Descripción', required: false })
  descripcionAsegura?: string;

  @ApiProperty({ description: 'Ejecutivo de cuenta', required: false })
  ejecutivoCuenta?: string;

  @ApiProperty({ description: 'Más información', required: false })
  masInformacion?: string;

  @ApiProperty({ description: 'ID del cliente' })
  idCliente: string;

  @ApiProperty({ description: 'ID del usuario creador' })
  idUsuarioCreador: string;

  @ApiProperty({ description: 'Fecha de renovación', required: false })
  fechaRenovacion?: Date;

  @ApiProperty({ description: 'Estado activo' })
  estaActivo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  fechaCreacion: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  fechaActualizacion: Date;

  @ApiProperty({ description: 'Información de la compañía', required: false })
  compania?: {
    idCompania: string;
    nombre: string;
    razonSocial?: string;
  };

  @ApiProperty({ description: 'Información del producto', required: false })
  producto?: {
    idProducto: string;
    nombre: string;
    descripcion?: string;
  };
}
