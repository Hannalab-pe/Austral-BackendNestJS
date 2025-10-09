import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('usuario')
@Index('idx_usuario_email', ['email'])
@Index('idx_usuario_activo', ['esta_activo'])
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_usuario: string;

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

  @Column({ type: 'varchar', length: 20, nullable: true })
  documento_identidad?: string;

  @Column({ type: 'uuid', nullable: true })
  id_asociado?: string;

  @Column({ type: 'uuid', nullable: true })
  supervisor_id?: string;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @Column({ type: 'timestamp', nullable: true })
  ultimo_acceso?: Date;

  @Column({ type: 'int', default: 0 })
  intentos_fallidos: number;

  @Column({ type: 'boolean', default: false })
  cuenta_bloqueada: boolean;

  @Column({ type: 'uuid' })
  id_rol: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
