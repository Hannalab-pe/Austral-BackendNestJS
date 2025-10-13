import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
  IsBoolean,
  Length,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ description: 'Nombre del lead', example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @ApiProperty({
    description: 'Apellido del lead',
    example: 'Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  apellido?: string;

  @ApiProperty({
    description: 'Email del lead',
    example: 'juan@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Teléfono del lead',
    example: '+54 11 1234-5678',
  })
  @IsNotEmpty()
  @IsString()
  @Length(9, 20)
  telefono: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Tipo de seguro de interés',
    example: 'Vida',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  tipo_seguro_interes?: string;

  @ApiProperty({
    description: 'Presupuesto aproximado',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  presupuesto_aproximado?: number;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({
    description: 'Puntaje de calificación (0-100)',
    example: 75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  puntaje_calificacion?: number;

  @ApiProperty({
    description: 'Prioridad del lead',
    example: 'ALTA',
    enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
    required: false,
  })
  @IsOptional()
  @IsString()
  prioridad?: string;

  @ApiProperty({
    description: 'ID del estado del lead (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  id_estado: string;

  @ApiProperty({
    description: 'ID de la fuente del lead (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  id_fuente: string;

  @ApiProperty({
    description: 'ID del usuario asignado (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  asignado_a_usuario?: string;

  @ApiProperty({
    description: 'Próxima fecha de seguimiento',
    example: '2025-10-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  proxima_fecha_seguimiento?: string;
}

export class UpdateLeadDto {
  @ApiProperty({
    description: 'Nombre del lead',
    example: 'Juan',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del lead',
    example: 'Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  apellido?: string;

  @ApiProperty({
    description: 'Email del lead',
    example: 'juan@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Teléfono del lead',
    example: '+54 11 1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(9, 20)
  telefono?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Tipo de seguro de interés',
    example: 'Vida',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  tipo_seguro_interes?: string;

  @ApiProperty({
    description: 'Presupuesto aproximado',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  presupuesto_aproximado?: number;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({
    description: 'Puntaje de calificación (0-100)',
    example: 75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  puntaje_calificacion?: number;

  @ApiProperty({
    description: 'Prioridad del lead',
    example: 'ALTA',
    enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
    required: false,
  })
  @IsOptional()
  @IsString()
  prioridad?: string;

  @ApiProperty({
    description: 'ID del estado del lead (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id_estado?: string;

  @ApiProperty({
    description: 'ID de la fuente del lead (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id_fuente?: string;

  @ApiProperty({
    description: 'ID del usuario asignado (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  asignado_a_usuario?: string;

  @ApiProperty({
    description: 'Próxima fecha de seguimiento',
    example: '2025-10-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  proxima_fecha_seguimiento?: string;

  @ApiProperty({
    description: 'Fecha del último contacto',
    example: '2025-10-10T14:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_ultimo_contacto?: string;

  @ApiProperty({
    description: 'Estado activo del lead',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}

export class CreateEstadoLeadDto {
  @ApiProperty({ description: 'Nombre del estado', example: 'Nuevo' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del estado',
    example: 'Lead recién ingresado',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Color en hexadecimal',
    example: '#3B82F6',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  color_hex?: string;

  @ApiProperty({
    description: 'Orden en el proceso',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  orden_proceso?: number;

  @ApiProperty({
    description: 'Es estado final',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  es_estado_final?: boolean;
}

export class UpdateEstadoLeadDto {
  @ApiProperty({
    description: 'Nombre del estado',
    example: 'Nuevo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nombre?: string;

  @ApiProperty({
    description: 'Descripción del estado',
    example: 'Lead recién ingresado',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Color en hexadecimal',
    example: '#3B82F6',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  color_hex?: string;

  @ApiProperty({
    description: 'Orden en el proceso',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  orden_proceso?: number;

  @ApiProperty({
    description: 'Es estado final',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  es_estado_final?: boolean;

  @ApiProperty({ description: 'Estado activo', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}

export class CreateFuenteLeadDto {
  @ApiProperty({ description: 'Nombre de la fuente', example: 'Sitio Web' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @ApiProperty({
    description: 'Descripción de la fuente',
    example: 'Formulario de contacto del sitio web',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Tipo de fuente',
    example: 'Digital',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  tipo?: string;
}

export class UpdateFuenteLeadDto {
  @ApiProperty({
    description: 'Nombre de la fuente',
    example: 'Sitio Web',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nombre?: string;

  @ApiProperty({
    description: 'Descripción de la fuente',
    example: 'Formulario de contacto del sitio web',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Tipo de fuente',
    example: 'Digital',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  tipo?: string;

  @ApiProperty({ description: 'Estado activo', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}
