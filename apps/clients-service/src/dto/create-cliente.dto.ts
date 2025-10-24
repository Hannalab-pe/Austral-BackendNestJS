import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsDateString, IsOptional, Length } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({ description: 'Apellido del cliente', example: 'Pérez' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  apellido: string;

  @ApiProperty({ description: 'Email del cliente', example: 'juan.perez@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Teléfono principal', example: '+51 999 888 777' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  telefono: string;

  @ApiProperty({ description: 'Teléfono secundario', example: '+51 999 888 666', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefonoSecundario?: string;

  @ApiProperty({ description: 'Número de documento de identidad', example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  documentoIdentidad: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'DNI' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  tipoDocumento: string;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '1990-01-15' })
  @IsNotEmpty()
  @IsDateString()
  fechaNacimiento: Date;

  @ApiProperty({ description: 'Dirección completa', example: 'Av. Principal 123, San Isidro' })
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

  @ApiProperty({ description: 'Ocupación', example: 'Ingeniero', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  ocupacion?: string;

  @ApiProperty({ description: 'Empresa donde trabaja', example: 'Tech Corp', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  empresa?: string;

  @ApiProperty({ description: 'Estado civil', example: 'Soltero', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  estadoCivil?: string;

  @ApiProperty({ description: 'Nombre del contacto de emergencia', example: 'María Pérez', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  contactoEmergenciaNombre?: string;

  @ApiProperty({ description: 'Teléfono del contacto de emergencia', example: '+51 999 777 666', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  contactoEmergenciaTelefono?: string;

  @ApiProperty({ description: 'Relación con el contacto de emergencia', example: 'Hermana', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  contactoEmergenciaRelacion?: string;

  @ApiProperty({ description: 'ID del lead asociado', required: false })
  @IsOptional()
  @IsString()
  idLead?: string;
}
