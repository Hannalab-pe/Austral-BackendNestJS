import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthServiceService } from './auth-service.service';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  AuthResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autenticar usuario con credenciales y obtener token JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authServiceService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crear una nueva cuenta de usuario en el sistema',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El email o nombre de usuario ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authServiceService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description: 'Actualizar la contraseña del usuario autenticado',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Contraseña actual incorrecta',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authServiceService.changePassword(
      req.user.userId,
      changePasswordDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Obtener información del perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getProfile(@Request() req) {
    return this.authServiceService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('validate')
  @ApiOperation({
    summary: 'Validar token',
    description: 'Verificar que el token JWT sea válido',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  async validateToken(@Request() req) {
    return { valid: true, user: req.user };
  }
}
