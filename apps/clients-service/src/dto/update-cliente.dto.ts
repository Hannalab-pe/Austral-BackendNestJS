import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsDateString, IsBoolean, Length } from 'class-validator';

export class UpdateClienteDto {
  @ApiProperty({ description: 'Tipo de persona', required: false, enum: ['NATURAL', 'JURIDICO'] })
  @IsOptional()
  @IsString()
  tipoPersona?: string;

  @ApiProperty({ description: 'Tipo de documento', required: false, enum: ['DNI', 'CEDULA', 'PASAPORTE', 'RUC'] })
  @IsOptional()
  @IsString()
  tipoDocumento?: string;

  @ApiProperty({ description: 'Número de documento', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  numeroDocumento?: string;

  @ApiProperty({ description: 'Nombres', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombres?: string;

  @ApiProperty({ description: 'Apellidos', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellidos?: string;

  @ApiProperty({ description: 'Razón social', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  razonSocial?: string;

  @ApiProperty({ description: 'Teléfono principal', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono1?: string;

  @ApiProperty({ description: 'Teléfono secundario', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono2?: string;

  @ApiProperty({ description: 'WhatsApp', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  whatsapp?: string;

  @ApiProperty({ description: 'Email para notificaciones', required: false })
  @IsOptional()
  @IsEmail()
  emailNotificaciones?: string;

  @ApiProperty({ description: 'Recibir notificaciones', required: false })
  @IsOptional()
  @IsBoolean()
  recibirNotificaciones?: boolean;

  @ApiProperty({ description: 'Dirección', required: false })
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

  @ApiProperty({ description: 'Fecha de cumpleaños', required: false })
  @IsOptional()
  @IsDateString()
  cumpleanos?: string;

  @ApiProperty({ description: 'Estado activo del cliente', required: false })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;

  @ApiProperty({ description: 'ID del lead asociado', required: false })
  @IsOptional()
  @IsString()
  idLead?: string;

  @ApiProperty({ description: 'ID del usuario asignado', example: 'uuid-del-usuario', required: false })
  @IsOptional()
  @IsString()
  asignadoA?: string;
}
