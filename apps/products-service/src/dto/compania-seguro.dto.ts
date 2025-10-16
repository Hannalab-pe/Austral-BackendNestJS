import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompaniaSeguroDto {
  @ApiProperty({
    description: 'Nombre de la compañía de seguros',
    example: 'Rímac Seguros',
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nombre: string;

  @ApiProperty({
    description: 'Razón social de la compañía',
    example: 'Rímac Seguros y Reaseguros S.A.',
    maxLength: 300,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  razonSocial?: string;

  @ApiProperty({
    description: 'RUC de la compañía',
    example: '20100041953',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'El RUC debe contener solo números' })
  ruc?: string;

  @ApiProperty({
    description: 'Dirección de la compañía',
    example: 'Av. Benavides 1555, Miraflores, Lima',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'Teléfono de la compañía',
    example: '+51 1 411 1111',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({
    description: 'Email corporativo de la compañía',
    example: 'contacto@rimac.com.pe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Sitio web de la compañía',
    example: 'https://www.rimac.com.pe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sitioWeb?: string;

  @ApiProperty({
    description: 'Nombre del contacto principal',
    example: 'Juan Pérez',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactoPrincipal?: string;

  @ApiProperty({
    description: 'Teléfono del contacto principal',
    example: '+51 987 654 321',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefonoContacto?: string;

  @ApiProperty({
    description: 'Email del contacto principal',
    example: 'juan.perez@rimac.com.pe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  emailContacto?: string;
}

export class UpdateCompaniaSeguroDto {
  @ApiProperty({
    description: 'Nombre de la compañía de seguros',
    example: 'Rímac Seguros',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nombre?: string;

  @ApiProperty({
    description: 'Razón social de la compañía',
    example: 'Rímac Seguros y Reaseguros S.A.',
    maxLength: 300,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  razonSocial?: string;

  @ApiProperty({
    description: 'RUC de la compañía',
    example: '20100041953',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'El RUC debe contener solo números' })
  ruc?: string;

  @ApiProperty({
    description: 'Dirección de la compañía',
    example: 'Av. Benavides 1555, Miraflores, Lima',
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({
    description: 'Teléfono de la compañía',
    example: '+51 1 411 1111',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({
    description: 'Email corporativo de la compañía',
    example: 'contacto@rimac.com.pe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Sitio web de la compañía',
    example: 'https://www.rimac.com.pe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sitioWeb?: string;

  @ApiProperty({
    description: 'Nombre del contacto principal',
    example: 'Juan Pérez',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactoPrincipal?: string;

  @ApiProperty({
    description: 'Teléfono del contacto principal',
    example: '+51 987 654 321',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefonoContacto?: string;

  @ApiProperty({
    description: 'Email del contacto principal',
    example: 'juan.perez@rimac.com.pe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  emailContacto?: string;

  @ApiProperty({
    description: 'Estado activo de la compañía',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estaActivo?: boolean;
}
