import { IsString, IsOptional, IsDateString, IsInt, IsUUID, IsIn } from 'class-validator';

export class CreateActividadDto {
  @IsString()
  tipoActividad: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fechaActividad: string;

  @IsOptional()
  @IsInt()
  duracionMinutos?: number;

  @IsOptional()
  @IsString()
  resultado?: string;

  @IsOptional()
  @IsString()
  proximaAccion?: string;

  @IsOptional()
  @IsDateString()
  fechaProximaAccion?: string;

  @IsOptional()
  @IsUUID()
  idLead?: string;

  @IsOptional()
  @IsUUID()
  idCliente?: string;

  @IsOptional()
  @IsUUID()
  idPoliza?: string;

  @IsUUID()
  realizadaPorUsuario: string;
}