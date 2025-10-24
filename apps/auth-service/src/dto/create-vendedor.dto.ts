import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber, Min, Max, Length } from 'class-validator';

export class CreateVendedorDto {
    @ApiProperty({
        description: 'Nombre de usuario único para el vendedor',
        example: 'vendedor1',
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    nombreUsuario: string;

    @ApiProperty({
        description: 'Email único del vendedor',
        example: 'vendedor@austral.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del vendedor',
        example: 'password123',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 255)
    contrasena: string;

    @ApiProperty({
        description: 'Nombre del vendedor',
        example: 'Juan',
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    nombre: string;

    @ApiProperty({
        description: 'Apellido del vendedor',
        example: 'Pérez',
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    apellido: string;

    @ApiProperty({
        description: 'Teléfono del vendedor',
        example: '+54 11 1234-5678',
        required: false,
    })
    @IsString()
    @Length(1, 20)
    telefono?: string;

    @ApiProperty({
        description: 'Documento de identidad del vendedor',
        example: '12345678',
        required: false,
    })
    @IsString()
    @Length(1, 20)
    documentoIdentidad?: string;

    @ApiProperty({
        description: 'Porcentaje de comisión que el broker asigna al vendedor',
        example: 15.5,
        minimum: 0,
        maximum: 100,
    })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    porcentajeComision: number;
}