import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Acceso completo al sistema',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Nivel de acceso (1-10)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  nivel_acceso?: number;
}

export class UpdateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Acceso completo al sistema',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Nivel de acceso (1-10)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  nivel_acceso?: number;

  @ApiProperty({
    description: 'Estado activo del rol',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}
