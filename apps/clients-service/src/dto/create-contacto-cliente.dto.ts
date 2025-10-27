import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateContactoClienteDto {
  @ApiProperty({ description: 'ID del cliente', example: 'uuid-del-cliente' })
  @IsNotEmpty()
  @IsString()
  idCliente: string;

  @ApiProperty({ description: 'Nombre del contacto', example: 'María González' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  nombre: string;

  @ApiProperty({ description: 'Cargo del contacto', example: 'Gerente General', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  cargo?: string;

  @ApiProperty({ description: 'Teléfono del contacto', example: '925757152', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ description: 'Correo del contacto', example: 'maria.gonzalez@email.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;
}
