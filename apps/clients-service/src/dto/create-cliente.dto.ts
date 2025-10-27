import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsBoolean, IsDateString, Length, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClienteContactoDto {
  @ApiProperty({ description: 'Nombre del contacto', example: 'María González' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({ description: 'Cargo del contacto', example: 'Gerente General', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  cargo?: string;

  @ApiProperty({ description: 'Teléfono del contacto', example: '925757153', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ description: 'Correo del contacto', example: 'maria.gonzalez@email.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;
}

export class CreateClienteDto {
  @ApiProperty({ description: 'Tipo de persona', example: 'NATURAL', enum: ['NATURAL', 'JURIDICO'] })
  @IsNotEmpty()
  @IsString()
  tipoPersona: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'DNI', enum: ['DNI', 'CEDULA', 'PASAPORTE', 'RUC'] })
  @IsNotEmpty()
  @IsString()
  tipoDocumento: string;

  @ApiProperty({ description: 'Número de documento', example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  numeroDocumento: string;

  @ApiProperty({ description: 'Nombres', example: 'Juan Carlos', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombres?: string;

  @ApiProperty({ description: 'Apellidos', example: 'Pérez García', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellidos?: string;

  @ApiProperty({ description: 'Razón social', example: 'Mi Empresa S.A.', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 300)
  razonSocial?: string;

  @ApiProperty({ description: 'Teléfono principal', example: '925757151' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  telefono1: string;

  @ApiProperty({ description: 'Teléfono secundario', example: '925757152', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono2?: string;

  @ApiProperty({ description: 'WhatsApp', example: '+51925757151', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  whatsapp?: string;

  @ApiProperty({ description: 'Email para notificaciones', example: 'juan.perez@email.com', required: false })
  @IsOptional()
  @IsEmail()
  emailNotificaciones?: string;

  @ApiProperty({ description: 'Recibir notificaciones', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  recibirNotificaciones?: boolean;

  @ApiProperty({ description: 'Dirección', example: 'Av. Siempre Viva 123' })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiProperty({ description: 'Distrito', example: 'San Isidro', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  distrito?: string;

  @ApiProperty({ description: 'Provincia', example: 'Lima', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  provincia?: string;

  @ApiProperty({ description: 'Departamento', example: 'Lima', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  departamento?: string;

  @ApiProperty({ description: 'Fecha de cumpleaños', example: '1990-01-15', required: false })
  @IsOptional()
  @IsDateString()
  cumpleanos?: string;

  @ApiProperty({ description: 'ID del lead asociado', required: false })
  @IsOptional()
  @IsString()
  idLead?: string;

  @ApiProperty({ description: 'ID del usuario asignado', example: 'uuid-del-usuario', required: false })
  @IsOptional()
  @IsString()
  asignadoA?: string;

  @ApiProperty({ description: 'Contactos adicionales del cliente', type: [CreateClienteContactoDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClienteContactoDto)
  contactos?: CreateClienteContactoDto[];
}
