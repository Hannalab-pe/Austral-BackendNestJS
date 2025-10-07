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
import { AuthServiceService } from './auth-service.service';
import { LoginDto, ChangePasswordDto, RefreshTokenDto } from './dto';
import { CreateUsuarioDto } from 'y/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authServiceService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authServiceService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authServiceService.changePassword(
      req.user.userId,
      changePasswordDto,
    );
  }

  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authServiceService.createUser(createUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authServiceService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Request() req) {
    return { valid: true, user: req.user };
  }
}
