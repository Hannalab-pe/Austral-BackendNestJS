import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsDateString,
  Length,
  Min,
  Max,
} from 'class-validator';
import { PrioridadLead } from 'y/common';

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @Length(9, 20)
  telefono: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  tipoSeguroInteres?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  presupuestoAproximado?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  puntajeCalificacion?: number;

  @IsOptional()
  @IsEnum(PrioridadLead)
  prioridad?: PrioridadLead;

  @IsNotEmpty()
  @IsUUID()
  idEstado: string;

  @IsNotEmpty()
  @IsUUID()
  idFuente: string;

  @IsOptional()
  @IsUUID()
  asignadoAUsuario?: string;

  @IsOptional()
  @IsDateString()
  proximaFechaSeguimiento?: string;
}

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(9, 20)
  telefono?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  tipoSeguroInteres?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  presupuestoAproximado?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  puntajeCalificacion?: number;

  @IsOptional()
  @IsEnum(PrioridadLead)
  prioridad?: PrioridadLead;

  @IsOptional()
  @IsUUID()
  idEstado?: string;

  @IsOptional()
  @IsUUID()
  asignadoAUsuario?: string;

  @IsOptional()
  @IsDateString()
  proximaFechaSeguimiento?: string;
}

export class CreateEstadoLeadDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @Length(7, 7)
  colorHex?: string;

  @IsOptional()
  @IsNumber()
  ordenProceso?: number;

  @IsOptional()
  esEstadoFinal?: boolean;
}

export class CreateFuenteLeadDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}
