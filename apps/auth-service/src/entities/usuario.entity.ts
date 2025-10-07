import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity, Rol } from 'y/common';

@Entity('usuario')
@Index('idx_usuario_email', ['email'])
@Index('idx_usuario_activo', ['estaActivo'])
@Index('idx_usuario_supervisor', ['supervisorId'])
@Index('idx_usuario_asociado', ['idAsociado'])
export class Usuario extends BaseEntity {
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

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'documento_identidad',
  })
  documentoIdentidad?: string;

  @Column({ type: 'uuid', nullable: true, name: 'id_asociado' })
  idAsociado?: string;

  @Column({ type: 'uuid', nullable: true, name: 'supervisor_id' })
  supervisorId?: string;

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

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: Usuario;

  @OneToMany(() => Usuario, (usuario) => usuario.supervisor)
  subordinados: Usuario[];
}
