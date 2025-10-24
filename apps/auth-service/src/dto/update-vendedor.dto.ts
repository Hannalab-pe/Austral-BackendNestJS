import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max, Length } from 'class-validator';

export class UpdateVendedorDto {
    @ApiProperty({
        description: 'Nombre de usuario único para el vendedor',
        example: 'vendedor1',
        required: false,
    })
    @IsString()
    @Length(3, 50)
    nombreUsuario?: string;

    @ApiProperty({
        description: 'Email único del vendedor',
        example: 'vendedor@austral.com',
        required: false,
    })
    @IsString()
    @Length(1, 255)
    email?: string;

    @ApiProperty({
        description: 'Teléfono del vendedor',
        example: '+54 11 1234-5678',
        required: false,
    })
    @IsString()
    @Length(1, 20)
    telefono?: string;

    @ApiProperty({
        description: 'Porcentaje de comisión que el broker asigna al vendedor',
        example: 15.5,
        minimum: 0,
        maximum: 100,
        required: false,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    porcentajeComision?: number;
}