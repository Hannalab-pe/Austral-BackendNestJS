import { IsString, IsInt, IsUUID, IsIn, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDetalleSeguroAutoDto {
  @IsUUID()
  lead_id: string;

  @IsString()
  marca_auto: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano_auto: number;

  @IsString()
  modelo_auto: string;

  @IsString()
  placa_auto: string;

  @IsString()
  @IsIn(['particular', 'comercial', 'uber', 'taxi', 'delivery', 'otro'])
  tipo_uso: string;
}

export class UpdateDetalleSeguroAutoDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  marca_auto?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano_auto?: number;

  @IsString()
  @Transform(({ value }) => value?.trim())
  modelo_auto?: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  placa_auto?: string;

  @IsString()
  @IsIn(['particular', 'comercial', 'uber', 'taxi', 'delivery', 'otro'])
  tipo_uso?: string;
}

export class DetalleSeguroAutoResponseDto {
  id: string;
  lead_id: string;
  marca_auto: string;
  ano_auto: number;
  modelo_auto: string;
  placa_auto: string;
  tipo_uso: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;

  // Información del lead relacionada
  lead?: {
    id_lead: string;
    nombre: string;
    apellido?: string;
    telefono: string;
  };
}