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
import { Usuario, Asociado } from './entities';
import { Rol, Permiso, CreateUsuarioDto } from 'y/common';
import { LoginDto, ChangePasswordDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(Asociado)
    private asociadoRepository: Repository<Asociado>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { usuario, contrasena } = loginDto;

    // Buscar usuario por email o nombre de usuario
    const user = await this.usuarioRepository.findOne({
      where: [
        { email: usuario, estaActivo: true },
        { nombreUsuario: usuario, estaActivo: true },
      ],
      relations: ['rol'],
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

    // Obtener permisos del usuario
    const permisos = await this.getPermisosUsuario(user.idRol);

    const payload = {
      sub: user.id,
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      nombre: `${user.nombre} ${user.apellido}`,
      rol: user.rol.nombre,
      permisos: permisos.map((p) => `${p.modulo}:${p.accion}`),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return {
      user: {
        id: user.id,
        nombreUsuario: user.nombreUsuario,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol.nombre,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usuarioRepository.findOne({
        where: { id: payload.sub, estaActivo: true },
        relations: ['rol'],
      });

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      const permisos = await this.getPermisosUsuario(user.idRol);

      const newPayload = {
        sub: user.id,
        email: user.email,
        nombreUsuario: user.nombreUsuario,
        nombre: `${user.nombre} ${user.apellido}`,
        rol: user.rol.nombre,
        permisos: permisos.map((p) => `${p.modulo}:${p.accion}`),
      };

      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Token de actualización inválido');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { contrasenaActual, contrasenaNueva } = changePasswordDto;

    const user = await this.usuarioRepository.findOne({
      where: { id: userId, estaActivo: true },
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

  async createUser(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: [
        { email: createUsuarioDto.email },
        { nombreUsuario: createUsuarioDto.nombreUsuario },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'El email o nombre de usuario ya está en uso',
      );
    }

    // Verificar que el rol existe
    const rol = await this.rolRepository.findOne({
      where: { id: createUsuarioDto.idRol, estaActivo: true },
    });

    if (!rol) {
      throw new BadRequestException('Rol no válido');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 12);

    const newUser = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasena: hashedPassword,
    });

    const savedUser = await this.usuarioRepository.save(newUser);

    // Retornar usuario sin contraseña
    const { contrasena, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async getUserProfile(userId: string) {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId, estaActivo: true },
      relations: ['rol', 'supervisor'],
      select: {
        id: true,
        nombreUsuario: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        documentoIdentidad: true,
        ultimoAcceso: true,
        fechaCreacion: true,
        rol: { id: true, nombre: true, descripcion: true },
        supervisor: { id: true, nombre: true, apellido: true },
      },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return user;
  }

  private async getPermisosUsuario(rolId: string): Promise<Permiso[]> {
    return await this.permisoRepository
      .createQueryBuilder('permiso')
      .innerJoin('rol_permiso', 'rp', 'rp.id_permiso = permiso.id')
      .where('rp.id_rol = :rolId', { rolId })
      .getMany();
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usuarioRepository.findOne({
      where: { id: payload.sub, estaActivo: true },
      relations: ['rol'],
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      nombre: `${user.nombre} ${user.apellido}`,
      rol: user.rol.nombre,
    };
  }
}
