import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { BrokerVendedor } from './entities/broker-vendedor.entity';
import { RolesService } from './services/roles.service';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  AuthResponseDto,
  CreateVendedorDto,
  UpdateVendedorDto,
} from './dto';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(BrokerVendedor)
    private brokerVendedorRepository: Repository<BrokerVendedor>,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { usuario, contrasena } = loginDto;

    // Buscar usuario por email o nombre de usuario CON la relación del rol
    const user = await this.usuarioRepository.findOne({
      where: [
        { email: usuario, estaActivo: true },
        { nombreUsuario: usuario, estaActivo: true },
      ],
      relations: ['rol'], // Incluir la relación con el rol
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

    // Crear JWT payload CON TODA LA INFORMACIÓN necesaria
    const payload = {
      sub: user.idUsuario, // ID del usuario (estándar JWT)
      id: user.idUsuario, // También como 'id' para compatibilidad
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      nombre: user.nombre,
      apellido: user.apellido,
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      idRol: user.idRol,
      rol: user.rol, // Objeto completo del rol
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

    // Buscar el usuario guardado con la relación del rol
    const userWithRol = await this.usuarioRepository.findOne({
      where: { idUsuario: savedUser.idUsuario },
      relations: ['rol'],
    });

    if (!userWithRol) {
      throw new BadRequestException('Error al crear usuario');
    }

    // Crear JWT para el nuevo usuario CON TODA LA INFORMACIÓN
    const payload = {
      sub: userWithRol.idUsuario,
      id: userWithRol.idUsuario,
      email: userWithRol.email,
      nombreUsuario: userWithRol.nombreUsuario,
      nombre: userWithRol.nombre,
      apellido: userWithRol.apellido,
      nombreCompleto: `${userWithRol.nombre} ${userWithRol.apellido}`,
      idRol: userWithRol.idRol,
      rol: userWithRol.rol,
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

    // Validar seguridad de la nueva contraseña
    this.validatePasswordSecurity(contrasenaNueva);

    const hashedPassword = await bcrypt.hash(contrasenaNueva, 12);
    user.contrasena = hashedPassword;

    await this.usuarioRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  private validatePasswordSecurity(password: string): void {
    // Validar longitud mínima de 8 caracteres
    if (password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }

    // Validar al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException(
        'La contraseña debe contener al menos una letra mayúscula',
      );
    }

    // Validar al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException(
        'La contraseña debe contener al menos una letra minúscula',
      );
    }

    // Validar al menos un número
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException(
        'La contraseña debe contener al menos un número',
      );
    }
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
      relations: ['rol'],
    });

    if (!user) {
      return null;
    }

    return {
      idUsuario: user.idUsuario,
      userId: user.idUsuario, // Mantener compatibilidad
      email: user.email,
      nombreUsuario: user.nombreUsuario,
      nombreCompleto: `${user.nombre} ${user.apellido}`,
      idRol: user.idRol,
      rol: user.rol,
    };
  }

  async createVendedor(brokerId: string, createVendedorDto: CreateVendedorDto) {
    // Verificar que el broker existe y tiene rol de Broker
    const broker = await this.usuarioRepository.findOne({
      where: { idUsuario: brokerId, estaActivo: true },
      relations: ['rol'],
    });

    if (!broker) {
      throw new BadRequestException('Broker no encontrado');
    }

    if (broker.rol.nombre !== 'Broker') {
      throw new ForbiddenException('Solo los Brokers pueden crear Vendedores');
    }

    // Verificar si el email o nombre de usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: [
        { email: createVendedorDto.email },
        { nombreUsuario: createVendedorDto.nombreUsuario },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'El email o nombre de usuario ya está en uso',
      );
    }

    // Obtener el rol Vendedor
    const rolVendedor = await this.rolesService.findByName('Vendedor');
    if (!rolVendedor) {
      throw new BadRequestException('Rol Vendedor no encontrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(createVendedorDto.contrasena, 12);

    // Crear el usuario Vendedor
    const newVendedor = this.usuarioRepository.create({
      nombreUsuario: createVendedorDto.nombreUsuario,
      email: createVendedorDto.email,
      contrasena: hashedPassword,
      nombre: createVendedorDto.nombre,
      apellido: createVendedorDto.apellido,
      telefono: createVendedorDto.telefono,
      documentoIdentidad: createVendedorDto.documentoIdentidad,
      idRol: rolVendedor.idRol,
      estaActivo: true,
      intentosFallidos: 0,
      cuentaBloqueada: false,
    });

    const savedVendedor = await this.usuarioRepository.save(newVendedor);

    // Crear la relación broker-vendedor
    const brokerVendedor = this.brokerVendedorRepository.create({
      idBroker: brokerId,
      idVendedor: savedVendedor.idUsuario,
      porcentajeComision: createVendedorDto.porcentajeComision,
      estaActivo: true,
    });

    await this.brokerVendedorRepository.save(brokerVendedor);

    // Retornar el vendedor creado con la relación
    const vendedorWithRelation = await this.usuarioRepository.findOne({
      where: { idUsuario: savedVendedor.idUsuario },
      relations: ['rol'],
    });

    if (!vendedorWithRelation) {
      throw new BadRequestException('Error al recuperar el vendedor creado');
    }

    return {
      vendedor: {
        idUsuario: vendedorWithRelation.idUsuario,
        nombreUsuario: vendedorWithRelation.nombreUsuario,
        email: vendedorWithRelation.email,
        nombre: vendedorWithRelation.nombre,
        apellido: vendedorWithRelation.apellido,
        idRol: vendedorWithRelation.idRol,
        rol: vendedorWithRelation.rol,
      },
      brokerVendedor: {
        idBroker: brokerVendedor.idBroker,
        idVendedor: brokerVendedor.idVendedor,
        porcentajeComision: brokerVendedor.porcentajeComision,
        fechaAsignacion: brokerVendedor.fechaAsignacion,
      },
    };
  }

  async getVendedoresByBroker(brokerId: string) {
    // Verificar que el broker existe y tiene rol de Broker
    const broker = await this.usuarioRepository.findOne({
      where: { idUsuario: brokerId, estaActivo: true },
      relations: ['rol'],
    });

    if (!broker) {
      throw new BadRequestException('Broker no encontrado');
    }

    if (broker.rol.nombre !== 'Broker') {
      throw new ForbiddenException('Solo los Brokers pueden acceder a esta información');
    }

    // Obtener todos los vendedores asignados a este broker
    const brokerVendedores = await this.brokerVendedorRepository.find({
      where: { idBroker: brokerId, estaActivo: true },
      relations: ['vendedor', 'vendedor.rol'],
      order: { fechaAsignacion: 'DESC' },
    });

    // Formatear la respuesta
    const vendedores = brokerVendedores.map(bv => ({
      idUsuario: bv.vendedor.idUsuario,
      nombreUsuario: bv.vendedor.nombreUsuario,
      email: bv.vendedor.email,
      nombre: bv.vendedor.nombre,
      apellido: bv.vendedor.apellido,
      telefono: bv.vendedor.telefono,
      documentoIdentidad: bv.vendedor.documentoIdentidad,
      estaActivo: bv.vendedor.estaActivo,
      ultimoAcceso: bv.vendedor.ultimoAcceso,
      fechaCreacion: bv.vendedor.fechaCreacion,
      cuentaBloqueada: bv.vendedor.cuentaBloqueada,
      porcentajeComision: bv.porcentajeComision,
      fechaAsignacion: bv.fechaAsignacion,
      rol: bv.vendedor.rol,
    }));

    return {
      vendedores,
      total: vendedores.length,
      activos: vendedores.filter(v => v.estaActivo).length,
    };
  }

  async updateVendedor(brokerId: string, vendedorId: string, updateVendedorDto: UpdateVendedorDto) {
    // Verificar que el broker existe y tiene rol de Broker
    const broker = await this.usuarioRepository.findOne({
      where: { idUsuario: brokerId, estaActivo: true },
      relations: ['rol'],
    });

    if (!broker) {
      throw new BadRequestException('Broker no encontrado');
    }

    if (broker.rol.nombre !== 'Broker') {
      throw new ForbiddenException('Solo los Brokers pueden actualizar Vendedores');
    }

    // Verificar que el vendedor existe y está asignado a este broker
    const brokerVendedor = await this.brokerVendedorRepository.findOne({
      where: {
        idBroker: brokerId,
        idVendedor: vendedorId,
        estaActivo: true
      },
      relations: ['vendedor'],
    });

    if (!brokerVendedor) {
      throw new ForbiddenException('Vendedor no encontrado o no asignado a este broker');
    }

    // Verificar si el email o nombre de usuario ya existe (si se están actualizando)
    if (updateVendedorDto.email || updateVendedorDto.nombreUsuario) {
      const whereConditions: any[] = [];
      if (updateVendedorDto.email) {
        whereConditions.push({ email: updateVendedorDto.email });
      }
      if (updateVendedorDto.nombreUsuario) {
        whereConditions.push({ nombreUsuario: updateVendedorDto.nombreUsuario });
      }

      const existingUser = await this.usuarioRepository.findOne({
        where: whereConditions.length > 1 ? whereConditions : whereConditions[0],
      });

      if (existingUser && existingUser.idUsuario !== vendedorId) {
        throw new ConflictException(
          'El email o nombre de usuario ya está en uso por otro usuario',
        );
      }
    }

    // Actualizar el usuario vendedor
    const updateData: any = {};
    if (updateVendedorDto.nombreUsuario) updateData.nombreUsuario = updateVendedorDto.nombreUsuario;
    if (updateVendedorDto.email) updateData.email = updateVendedorDto.email;
    if (updateVendedorDto.telefono !== undefined) updateData.telefono = updateVendedorDto.telefono;

    if (Object.keys(updateData).length > 0) {
      await this.usuarioRepository.update(vendedorId, updateData);
    }

    // Actualizar la relación broker-vendedor si se cambió el porcentaje
    if (updateVendedorDto.porcentajeComision !== undefined) {
      await this.brokerVendedorRepository.update(
        { idBroker: brokerId, idVendedor: vendedorId },
        { porcentajeComision: updateVendedorDto.porcentajeComision }
      );
    }

    // Retornar el vendedor actualizado
    const updatedVendedor = await this.usuarioRepository.findOne({
      where: { idUsuario: vendedorId },
      relations: ['rol'],
    });

    if (!updatedVendedor) {
      throw new BadRequestException('Error al recuperar el vendedor actualizado');
    }

    // Obtener la relación actualizada
    const updatedBrokerVendedor = await this.brokerVendedorRepository.findOne({
      where: { idBroker: brokerId, idVendedor: vendedorId },
    });

    return {
      vendedor: {
        idUsuario: updatedVendedor.idUsuario,
        nombreUsuario: updatedVendedor.nombreUsuario,
        email: updatedVendedor.email,
        nombre: updatedVendedor.nombre,
        apellido: updatedVendedor.apellido,
        telefono: updatedVendedor.telefono,
        documentoIdentidad: updatedVendedor.documentoIdentidad,
        estaActivo: updatedVendedor.estaActivo,
        ultimoAcceso: updatedVendedor.ultimoAcceso,
        fechaCreacion: updatedVendedor.fechaCreacion,
        cuentaBloqueada: updatedVendedor.cuentaBloqueada,
        idRol: updatedVendedor.idRol,
        rol: updatedVendedor.rol,
      },
      brokerVendedor: updatedBrokerVendedor ? {
        idBroker: updatedBrokerVendedor.idBroker,
        idVendedor: updatedBrokerVendedor.idVendedor,
        porcentajeComision: updatedBrokerVendedor.porcentajeComision,
        fechaAsignacion: updatedBrokerVendedor.fechaAsignacion,
      } : null,
    };
  }
}
