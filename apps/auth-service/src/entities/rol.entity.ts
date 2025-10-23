import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('rol')
@Index('idx_rol_nombre', ['nombre'])
export class Rol {
  @PrimaryGeneratedColumn('uuid', { name: 'id_rol' })
  idRol: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'int', default: 1, name: 'nivel_acceso' })
  nivelAcceso: number;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}
