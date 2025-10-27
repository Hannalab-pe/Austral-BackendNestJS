import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateContactoClienteDto {
  @ApiProperty({ description: 'Nombre del contacto', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  nombre?: string;

  @ApiProperty({ description: 'Cargo del contacto', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  cargo?: string;

  @ApiProperty({ description: 'Teléfono del contacto', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ description: 'Correo del contacto', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;
}
