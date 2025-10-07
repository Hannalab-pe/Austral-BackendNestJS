import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  usuario: string; // Puede ser email o nombre de usuario

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasena: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  contrasenaActual: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasenaNueva: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ConfirmResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  contrasenaNueva: string;
}
