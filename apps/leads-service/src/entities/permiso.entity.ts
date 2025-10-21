import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('permiso')
@Index('idx_permiso_activo', ['esta_activo'])
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id_permiso: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;
}