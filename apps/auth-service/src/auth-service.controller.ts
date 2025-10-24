import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthServiceService } from './auth-service.service';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  AuthResponseDto,
  CreateVendedorDto,
  UpdateVendedorDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) { }

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
  @Post('create-vendedor')
  @ApiOperation({
    summary: 'Crear vendedor (solo Brokers)',
    description: 'Permitir que un Broker cree un nuevo Vendedor y asigne porcentaje de comisión',
  })
  @ApiBody({ type: CreateVendedorDto })
  @ApiResponse({
    status: 201,
    description: 'Vendedor creado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los Brokers pueden crear Vendedores',
  })
  @ApiResponse({
    status: 409,
    description: 'El email o nombre de usuario ya existe',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async createVendedor(
    @Request() req,
    @Body() createVendedorDto: CreateVendedorDto,
  ) {
    return this.authServiceService.createVendedor(
      req.user.userId,
      createVendedorDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('vendedores/:id')
  @ApiOperation({
    summary: 'Actualizar vendedor (solo Brokers)',
    description: 'Permitir que un Broker actualice información limitada de un Vendedor asignado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del vendedor a actualizar',
    example: 'usr_123456',
  })
  @ApiBody({ type: UpdateVendedorDto })
  @ApiResponse({
    status: 200,
    description: 'Vendedor actualizado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los Brokers pueden actualizar Vendedores o vendedor no asignado',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendedor no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El email o nombre de usuario ya existe',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async updateVendedor(
    @Request() req,
    @Param('id') vendedorId: string,
    @Body() updateVendedorDto: UpdateVendedorDto,
  ) {
    return this.authServiceService.updateVendedor(
      req.user.userId,
      vendedorId,
      updateVendedorDto,
    );
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-vendedores')
  @ApiOperation({
    summary: 'Obtener vendedores del Broker actual',
    description: 'Obtener la lista de vendedores asignados al Broker autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendedores obtenida exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los Brokers pueden acceder a esta información',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getMyVendedores(@Request() req) {
    return this.authServiceService.getVendedoresByBroker(req.user.userId);
  }
}
