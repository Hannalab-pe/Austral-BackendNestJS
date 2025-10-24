import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsUUID, IsOptional, Length } from 'class-validator';

export class CreateUsuarioDto {
    @ApiProperty({
        description: 'Nombre de usuario único',
        example: 'vendedor1',
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    nombreUsuario: string;

    @ApiProperty({
        description: 'Email único del usuario',
        example: 'vendedor@austral.com',
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