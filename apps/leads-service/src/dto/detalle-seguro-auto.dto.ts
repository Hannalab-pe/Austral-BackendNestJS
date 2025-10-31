import { IsString, IsInt, IsUUID, Min, Max, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDetalleSeguroAutoDto {
  @IsUUID()
  id_lead: string;

  @IsString()
  marca: string;

  @IsString()
  modelo: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  anio: number;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsNumber()
  valor_vehiculo?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Terceros', 'Terceros completo', 'Todo riesgo'])
  tipo_cobertura?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Baja', 'Media', 'Alta'])
  zona_riesgo?: string;

  @IsOptional()
  @IsInt()
  antiguedad_licencia?: number;

  @IsOptional()
  @IsBoolean()
  tiene_gps?: boolean;

  @IsOptional()
  @IsBoolean()
  tiene_alarma?: boolean;

  @IsOptional()
  @IsInt()
  numero_siniestros_previos?: number;

  @IsOptional()
  @IsBoolean()
  esta_financiado?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['Particular', 'Comercial', 'Uber/Taxi', 'Otro'])
  uso_vehiculo?: string;
}

export class UpdateDetalleSeguroAutoDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  marca?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  modelo?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  anio?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  placa?: string;

  @IsOptional()
  @IsNumber()
  valor_vehiculo?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Terceros', 'Terceros completo', 'Todo riesgo'])
  tipo_cobertura?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Baja', 'Media', 'Alta'])
  zona_riesgo?: string;

  @IsOptional()
  @IsInt()
  antiguedad_licencia?: number;

  @IsOptional()
  @IsBoolean()
  tiene_gps?: boolean;

  @IsOptional()
  @IsBoolean()
  tiene_alarma?: boolean;

  @IsOptional()
  @IsInt()
  numero_siniestros_previos?: number;

  @IsOptional()
  @IsBoolean()
  esta_financiado?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['Particular', 'Comercial', 'Uber/Taxi', 'Otro'])
  uso_vehiculo?: string;
}

export class DetalleSeguroAutoResponseDto {
  id_detalle_auto: string;
  id_lead: string;
  marca: string;
  modelo: string;
  anio: number;
  placa?: string;
  valor_vehiculo?: number;
  tipo_cobertura?: string;
  zona_riesgo: string;
  antiguedad_licencia?: number;
  tiene_gps: boolean;
  tiene_alarma: boolean;
  numero_siniestros_previos: number;
  esta_financiado: boolean;
  uso_vehiculo?: string;
  esta_activo: boolean;
  fecha_creacion: Date;

  // Información del lead relacionada
  lead?: {
    id_lead: string;
    nombre: string;
    apellido?: string;
    telefono: string;
  };
}