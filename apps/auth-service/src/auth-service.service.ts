import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RolesService } from './services/roles.service';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  AuthResponseDto,
} from './dto';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { usuario, contrasena } = loginDto;

    // Buscar usuario por email o nombre de usuario
    const user = await this.usuarioRepository.findOne({
      where: [
        { email: usuario, estaActivo: true },
        { nombreUsuario: usuario, estaActivo: true },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.cuentaBloqueada) {
      throw new UnauthorizedException(
        'Cuenta bloqueada. Contacte al administrador',
      );
    }

    // Verificar contraseña
    const esContrasenaValida = await bcrypt.compare(
      contrasena,
      user.contrasena,
    );

    if (!esContrasenaValida) {
      // Incrementar intentos fallidos
      user.intentosFallidos += 1;

      // Bloquear cuenta después de 5 intentos
      if (user.intentosFallidos >= 5) {
        user.cuentaBloqueada = true;
      }

      await this.usuarioRepository.save(user);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Resetear intentos fallidos en login exitoso
    user.intentosFallidos = 0;
    user.ultimoAcceso = new Date();
    await this.usuarioRepository.save(user);

    // Crear JWT payload
    const payload = {
      sub: user.idUsuario,
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      idRol: user.idRol,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        idUsuario: user.idUsuario,
        nombreUsuario: user.nombreUsuario,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        idRol: user.idRol,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: [
        { email: registerDto.email },
        { nombreUsuario: registerDto.nombreUsuario },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'El email o nombre de usuario ya está en uso',
      );
    }

    // Verificar que el rol existe
    const rol = await this.rolesService.findOne(registerDto.idRol);
    if (!rol) {
      throw new BadRequestException('Rol no válido');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 12);

    // Crear nuevo usuario
    const newUser = this.usuarioRepository.create({
      ...registerDto,
      contrasena: hashedPassword,
      estaActivo: true,
      intentosFallidos: 0,
      cuentaBloqueada: false,
    });

    const savedUser = await this.usuarioRepository.save(newUser);

    // Crear JWT para el nuevo usuario
    const payload = {
      sub: savedUser.idUsuario,
      email: savedUser.email,
      nombreUsuario: savedUser.nombreUsuario,
      nombreCompleto: `${savedUser.nombre} ${savedUser.apellido}`,
      idRol: savedUser.idRol,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        idUsuario: savedUser.idUsuario,
        nombreUsuario: savedUser.nombreUsuario,
        email: savedUser.email,
        nombre: savedUser.nombre,
        apellido: savedUser.apellido,
        idRol: savedUser.idRol,
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { contrasenaActual, contrasenaNueva } = changePasswordDto;

    const user = await this.usuarioRepository.findOne({
      where: { idUsuario: userId, estaActivo: true },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const esContrasenaActualValida = await bcrypt.compare(
      contrasenaActual,
      user.contrasena,
    );

    if (!esContrasenaActualValida) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    const hashedPassword = await bcrypt.hash(contrasenaNueva, 12);
    user.contrasena = hashedPassword;

    await this.usuarioRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async getUserProfile(userId: string) {
    const user = await this.usuarioRepository.findOne({
      where: { idUsuario: userId, estaActivo: true },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Retornar usuario sin contraseña
    const { contrasena, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usuarioRepository.findOne({
      where: { idUsuario: payload.sub, estaActivo: true },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.idUsuario,
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      idRol: user.idRol,
    };
  }
}
