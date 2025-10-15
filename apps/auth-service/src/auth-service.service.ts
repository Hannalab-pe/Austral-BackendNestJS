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
        { email: usuario, esta_activo: true },
        { nombre_usuario: usuario, esta_activo: true },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.cuenta_bloqueada) {
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
      user.intentos_fallidos += 1;

      // Bloquear cuenta después de 5 intentos
      if (user.intentos_fallidos >= 5) {
        user.cuenta_bloqueada = true;
      }

      await this.usuarioRepository.save(user);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Resetear intentos fallidos en login exitoso
    user.intentos_fallidos = 0;
    user.ultimo_acceso = new Date();
    await this.usuarioRepository.save(user);

    // Crear JWT payload
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      nombre_usuario: user.nombre_usuario,
      nombre_completo: `${user.nombre} ${user.apellido}`,
      id_rol: user.id_rol,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        id_rol: user.id_rol,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: [
        { email: registerDto.email },
        { nombre_usuario: registerDto.nombre_usuario },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'El email o nombre de usuario ya está en uso',
      );
    }

    // Verificar que el rol existe
    const rol = await this.rolesService.findOne(registerDto.id_rol);
    if (!rol) {
      throw new BadRequestException('Rol no válido');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 12);

    // Crear nuevo usuario
    const newUser = this.usuarioRepository.create({
      ...registerDto,
      contrasena: hashedPassword,
      esta_activo: true,
      intentos_fallidos: 0,
      cuenta_bloqueada: false,
    });

    const savedUser = await this.usuarioRepository.save(newUser);

    // Crear JWT para el nuevo usuario
    const payload = {
      sub: savedUser.id_usuario,
      email: savedUser.email,
      nombre_usuario: savedUser.nombre_usuario,
      nombre_completo: `${savedUser.nombre} ${savedUser.apellido}`,
      id_rol: savedUser.id_rol,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id_usuario: savedUser.id_usuario,
        nombre_usuario: savedUser.nombre_usuario,
        email: savedUser.email,
        nombre: savedUser.nombre,
        apellido: savedUser.apellido,
        id_rol: savedUser.id_rol,
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { contrasena_actual, contrasena_nueva } = changePasswordDto;

    const user = await this.usuarioRepository.findOne({
      where: { id_usuario: userId, esta_activo: true },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const esContrasenaActualValida = await bcrypt.compare(
      contrasena_actual,
      user.contrasena,
    );

    if (!esContrasenaActualValida) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    const hashedPassword = await bcrypt.hash(contrasena_nueva, 12);
    user.contrasena = hashedPassword;

    await this.usuarioRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async getUserProfile(userId: string) {
    const user = await this.usuarioRepository.findOne({
      where: { id_usuario: userId, esta_activo: true },
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
      where: { id_usuario: payload.sub, esta_activo: true },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id_usuario,
      email: user.email,
      nombre_usuario: user.nombre_usuario,
      nombre_completo: `${user.nombre} ${user.apellido}`,
      id_rol: user.id_rol,
    };
  }
}
