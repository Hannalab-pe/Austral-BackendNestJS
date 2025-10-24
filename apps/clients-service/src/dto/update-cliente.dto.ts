import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsDateString, IsBoolean, Length } from 'class-validator';

export class UpdateClienteDto {
  @ApiProperty({ description: 'Nombre del cliente', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @ApiProperty({ description: 'Apellido del cliente', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellido?: string;

  @ApiProperty({ description: 'Email del cliente', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Teléfono principal', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ description: 'Teléfono secundario', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefonoSecundario?: string;

  @ApiProperty({ description: 'Número de documento de identidad', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  documentoIdentidad?: string;

  @ApiProperty({ description: 'Tipo de documento', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  tipoDocumento?: string;

  @ApiProperty({ description: 'Fecha de nacimiento', required: false })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: Date;

  @ApiProperty({ description: 'Dirección completa', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: 'Distrito', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  distrito?: string;

  @ApiProperty({ description: 'Provincia', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  provincia?: string;

  @ApiProperty({ description: 'Departamento', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  departamento?: string;

  @ApiProperty({ description: 'Ocupación', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  ocupacion?: string;

  @ApiProperty({ description: 'Empresa donde trabaja', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  empresa?: string;

  @ApiProperty({ description: 'Estado civil', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  estadoCivil?: string;

  @ApiProperty({ description: 'Nombre del contacto de emergencia', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  contactoEmergenciaNombre?: string;

  @ApiProperty({ description: 'Teléfono del contacto de emergencia', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  contactoEmergenciaTelefono?: string;

  @ApiProperty({ description: 'Relación con el contacto de emergencia', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  contactoEmergenciaRelacion?: string;

  @ApiProperty({ description: 'Estado activo del cliente', required: false })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}
