import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('permiso')
@Index('idx_permiso_activo', ['estaActivo'])
export class Permiso {
  @PrimaryGeneratedColumn('uuid', { name: 'id_permiso' })
  idPermiso: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'boolean', default: true, name: 'esta_activo' })
  estaActivo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}