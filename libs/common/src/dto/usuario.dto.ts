import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  nombreUsuario: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  apellido: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  documentoIdentidad?: string;

  @IsNotEmpty()
  @IsUUID()
  idRol: string;

  @IsOptional()
  @IsUUID()
  idAsociado?: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  documentoIdentidad?: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;
}
