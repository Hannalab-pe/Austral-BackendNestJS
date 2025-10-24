import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuario')
@Index('idx_usuario_email', ['email'])
@Index('idx_usuario_activo', ['estaActivo'])
export class Usuario {
  @PrimaryGeneratedColumn('uuid', { name: 'id_usuario' })
  idUsuario: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'nombre_usuario' })
  nombreUsuario: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contrasena: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'documento_identidad' })
  documentoIdentidad?: string;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'ultimo_acceso' })
  ultimoAcceso?: Date;

  @Column({ type: 'int', default: 0, name: 'intentos_fallidos' })
  intentosFallidos: number;

  @Column({ type: 'boolean', default: false, name: 'cuenta_bloqueada' })
  cuentaBloqueada: boolean;

  @Column({ type: 'uuid', name: 'id_rol' })
  idRol: string;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
