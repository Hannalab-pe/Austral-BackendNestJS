import {
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  IsArray,
  IsDateString,
  IsBoolean,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO para cotización de auto
export class CalcularCotizacionAutoDto {
  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
  })
  @IsString()
  marca: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Corolla',
  })
  @IsString()
  modelo: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2020,
  })
  @IsNumber()
  @Min(2000)
  @Max(2025)
  anio: number;

  @ApiProperty({
    description:
      'Valor del vehículo (opcional, si no se proporciona se usa valor referencial)',
    example: 15000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  valor_vehiculo?: number;

  @ApiProperty({
    description: 'Tipo de cobertura',
    example: 'Todo riesgo',
    enum: ['Todo riesgo', 'Terceros', 'Terceros completo'],
  })
  @IsString()
  @IsIn(['Todo riesgo', 'Terceros', 'Terceros completo'])
  tipo_cobertura: 'Todo riesgo' | 'Terceros' | 'Terceros completo';

  @ApiProperty({
    description: 'Zona de riesgo',
    example: 'Media',
    enum: ['Baja', 'Media', 'Alta'],
  })
  @IsString()
  @IsIn(['Baja', 'Media', 'Alta'])
  zona_riesgo: 'Baja' | 'Media' | 'Alta';

  @ApiProperty({
    description: 'Antigüedad de la licencia de conducir en años',
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(50)
  antiguedad_licencia: number;
}

// DTO para cotización de salud
export class CalcularCotizacionSaludDto {
  @ApiProperty({
    description: 'Fecha de nacimiento del asegurado (formato YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsDateString()
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'Tipo de plan de salud',
    example: 'intermedio',
    enum: ['basico', 'intermedio', 'premium', 'internacional'],
  })
  @IsString()
  @IsIn(['basico', 'intermedio', 'premium', 'internacional'])
  tipo_plan: 'basico' | 'intermedio' | 'premium' | 'internacional';

  @ApiProperty({
    description: 'Lista de enfermedades preexistentes',
    example: ['hipertension', 'diabetes'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enfermedades_preexistentes?: string[];

  @ApiProperty({
    description: 'Indica si el asegurado pertenece a una EPS',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  es_eps?: boolean;

  @ApiProperty({
    description: 'Tipo de cobertura familiar',
    example: 'individual',
    enum: ['individual', 'pareja', 'familiar'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['individual', 'pareja', 'familiar'])
  tipo_familiar?: 'individual' | 'pareja' | 'familiar';

  @ApiProperty({
    description: 'Zona de riesgo',
    example: 'Media',
    enum: ['Baja', 'Media', 'Alta'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['Baja', 'Media', 'Alta'])
  zona_riesgo?: 'Baja' | 'Media' | 'Alta';

  @ApiProperty({
    description: 'Descuento promocional en porcentaje (0-50%)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  descuento_promocional?: number;
}

// DTO para cotización de SCTR
export class CalcularCotizacionSctrDto {
  @ApiProperty({
    description: 'Número de trabajadores',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  numero_trabajadores: number;

  @ApiProperty({
    description: 'Sueldo mínimo mensual por trabajador',
    example: 1025,
  })
  @IsNumber()
  @Min(0)
  sueldo_minimo: number;

  @ApiProperty({
    description: 'Código de actividad económica (CIIU)',
    example: '4520',
  })
  @IsString()
  codigo_actividad: string;

  @ApiProperty({
    description:
      'Indica si se realizó evaluación de riesgo para actividades de alto riesgo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  evaluacion_riesgo_realizada?: boolean;
}

// DTO para resultado de cotización
export class CotizacionResultDto {
  @ApiProperty({
    description: 'Tipo de seguro',
    example: 'AUTO',
    enum: ['AUTO', 'SALUD', 'SCTR'],
  })
  @IsString()
  @IsIn(['AUTO', 'SALUD', 'SCTR'])
  tipo_seguro: 'AUTO' | 'SALUD' | 'SCTR';

  @ApiProperty({
    description: 'Prima total calculada',
    example: 1500.5,
  })
  @IsNumber()
  prima_total: number;

  @ApiProperty({
    description: 'Prima neta (después de deducciones)',
    example: 1350.45,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  prima_neta?: number;

  @ApiProperty({
    description: 'Costo mensual',
    example: 150.08,
  })
  @IsNumber()
  costo_mensual: number;

  @ApiProperty({
    description: 'Costo anual',
    example: 1800.96,
  })
  @IsNumber()
  costo_anual: number;

  @ApiProperty({
    description: 'Información adicional específica del tipo de seguro',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
