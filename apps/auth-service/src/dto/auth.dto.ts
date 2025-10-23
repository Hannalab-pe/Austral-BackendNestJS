import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario o email',
    example: 'admin@austral.com',
  })
  @IsNotEmpty()
  @IsString()
  usuario: string; // Puede ser email o nombre de usuario

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasena: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  nombreUsuario: string;

  @ApiProperty({
    description: 'Email único del usuario',
    example: 'admin@austral.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasena: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  apellido: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+54 11 1234-5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({
    description: 'Documento de identidad',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  documentoIdentidad?: string;

  @ApiProperty({
    description: 'ID del rol (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  idRol: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario',
  })
  user: {
    idUsuario: string;
    nombreUsuario: string;
    email: string;
    nombre: string;
    apellido: string;
    idRol: string;
  };
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual',
    example: 'oldpassword123',
  })
  @IsNotEmpty()
  @IsString()
  contrasenaActual: string;

  @ApiProperty({
    description: 'Nueva contraseña',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasenaNueva: string;
}
